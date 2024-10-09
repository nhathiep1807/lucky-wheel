import { useTrackTime } from "@/hooks/useTrackTime";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import "./style.css";

import { GlobalContext } from "@/app/context";
import { useCountPointMutation } from "@/hooks/users/useCountPoint";
import { TypeErrorResponse } from "@/types/common";
import { TCountPointRequest } from "@/types/user";
import { Prize } from "@/utils/functions";
import { Dialog } from "@headlessui/react";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import useSound from "use-sound";

const BaseWheel: React.FC<{ prizes: Prize[] }> = ({ prizes }) => {
  const { holdTime, isHolding, handleMouseDown, handleMouseUp } =
    useTrackTime();

  const [lastPrize, setLastPrize] = useState<Prize | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const spinnerRef = useRef<HTMLUListElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentSliceRef = useRef<number>(0);
  const clickAudioRef = useRef<HTMLAudioElement>(null);
  const spinAudioRef = useRef<HTMLAudioElement>(null);

  const { playerInfo } = useContext(GlobalContext);

  const { mutate: countPoint } = useCountPointMutation();

  const [play, { stop }] = useSound("/sounds/power-up.mp3");

  const totalAngle = prizes.reduce((sum, prize) => sum + prize.angle, 0);

  const spinertia = (min: number, max: number) =>
    Math.floor(((holdTime * 2) / 1000) * (max - min + 1)) + min;

  const getCurrentPrize = useCallback(() => {
    if (!spinnerRef.current) return null;

    const spinnerStyles = window.getComputedStyle(spinnerRef.current);
    const values = spinnerStyles.transform
      .split("(")[1]
      .split(")")[0]
      .split(",");
    const a = parseFloat(values[0]);
    const b = parseFloat(values[1]);
    let rad = Math.atan2(b, a);
    if (rad < 0) rad += 2 * Math.PI;

    let angle = ((rad * 180) / Math.PI + 90) % 360;

    // The wheel spins clockwise, so we need to reverse the angle
    angle = (450 + rotation - angle) % 360;

    let accumulatedAngle = 0;
    for (let i = 0; i < prizes.length; i++) {
      accumulatedAngle += (prizes[i].angle * 360) / totalAngle;
      if (angle <= accumulatedAngle) {
        return prizes[i];
      }
    }

    // If we've gone through all prizes and haven't found a match,
    // it means we're in the last segment (which wraps around to 0)
    return prizes[prizes.length - 1];
  }, []);

  const createPrizeNodes = useCallback(() => {
    const spinner = spinnerRef.current;
    if (!spinner) return;

    const pieWidth = window.getComputedStyle(spinner).width;
    const rad = parseFloat(pieWidth) / 2;

    spinner.innerHTML = ""; // Clear existing prize nodes

    let currentRotation = 0;
    prizes.forEach(({ text, angle, image }) => {
      const realityAngle = (angle * 360) / totalAngle;
      const rotation = realityAngle / 2 + currentRotation;

      const heightImg =
        (rad * Math.sin(((realityAngle / 2) * Math.PI) / 180) * 4) / 5;

      const prizeElement = document.createElement("li");
      prizeElement.className = "prize";
      prizeElement.style.setProperty("--rotate", `${rotation}deg`);

      if (image) {
        const imgElement = document.createElement("img");
        imgElement.src = image;
        imgElement.alt = text || "";
        imgElement.className = "prize-image";
        imgElement.style.height = `${heightImg}px`;
        imgElement.style.width = `${heightImg}px`;
        prizeElement.appendChild(imgElement);
      }

      if (text && !image) {
        const textElement = document.createElement("span");
        textElement.className = "text";
        textElement.textContent = text;
        prizeElement.appendChild(textElement);
      }

      spinner.appendChild(prizeElement);
      currentRotation += realityAngle;
    });
  }, [totalAngle]);

  const createConicGradient = useCallback(() => {
    const spinner = spinnerRef.current;
    if (!spinner) return;

    let gradientString = "conic-gradient(from -90deg,";
    let currentAngle = 0;

    prizes.forEach(({ color, angle }, index) => {
      const startAngle = currentAngle;
      const endAngle = currentAngle + (angle * 360) / totalAngle;
      gradientString += `${color} ${startAngle}deg ${endAngle}deg${
        index < prizes.length - 1 ? "," : ")"
      }`;
      currentAngle = endAngle;
    });

    spinner.setAttribute("style", `background: ${gradientString};`);
  }, [totalAngle]);

  const setupWheel = useCallback(() => {
    createConicGradient();
    createPrizeNodes();
  }, [createConicGradient, createPrizeNodes]);

  const runTickerAnimation = useCallback(() => {
    if (!spinnerRef.current) return;

    const currentPrize = getCurrentPrize();

    if (
      currentPrize &&
      currentSliceRef.current !== prizes.indexOf(currentPrize)
    ) {
      if (spinAudioRef.current) {
        spinAudioRef.current.currentTime = 0;
        spinAudioRef.current.play();
      }

      if (tickerRef.current) {
        tickerRef.current.style.animation = "none";
        setTimeout(() => {
          if (tickerRef.current) {
            tickerRef.current.style.animation = "";
          }
        }, 1);
      }
      currentSliceRef.current = prizes.indexOf(currentPrize);
    }

    if (isSpinning) {
      animationFrameRef.current = requestAnimationFrame(runTickerAnimation);
    }
  }, [getCurrentPrize, isSpinning]);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    const newRotation =
      rotation +
      Math.floor(((holdTime * 3) / 1000) * 360 + spinertia(2000, 5000));

    setRotation(newRotation);
    if (tickerRef.current) {
      tickerRef.current.style.animation = "none";
    }

    animationFrameRef.current = requestAnimationFrame(runTickerAnimation);
  };

  const handleTransitionEnd = () => {
    const currentPrize = getCurrentPrize();
    setIsSpinning(false);

    setLastPrize(currentPrize);

    setRotation(rotation % 360);

    const countPointBody: TCountPointRequest = {
      userId: playerInfo?.id ?? 0,
      itemId: currentPrize?.itemId ?? 0,
    };

    countPoint(countPointBody, {
      onSuccess: () => {},
      onError: (error: any) => {
        const _error: TypeErrorResponse = error;
        toast.error(error);
      },
    });

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  useEffect(() => {
    setupWheel();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [setupWheel]);

  useEffect(() => {
    if (isSpinning) {
      animationFrameRef.current = requestAnimationFrame(runTickerAnimation);
    }
  }, [isSpinning, runTickerAnimation]);

  useEffect(() => {
    if (isHolding) play();
    else stop();
  }, [isHolding]);

  return (
    <div className="flex">
      <audio src="/sounds/spin.mp3" ref={spinAudioRef}></audio>

      <div className={twMerge("deal-wheel", isSpinning && "is-spinning")}>
        <ul
          className="spinner"
          ref={spinnerRef}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? `transform ${3 + rotation / 1000}s cubic-bezier(.05,.99,.66,1)`
              : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        ></ul>

        <div className="ticker" ref={tickerRef}></div>
        <audio src="/sounds/click.mp3" ref={clickAudioRef}></audio>
        <button
          onMouseDown={() => {
            if (isSpinning) return;
            clickAudioRef.current?.play();
            handleMouseDown();
          }}
          onMouseUp={() => {
            if (isSpinning) return;
            handleMouseUp();
            handleSpin();
          }}
          onTouchStart={handleMouseDown}
          onTouchEnd={() => {
            handleMouseUp();
            handleSpin();
          }}
          disabled={isSpinning}
          className={twMerge(
            isSpinning ? "select-none" : "hover:active:scale-90",
            "absolute group hover:scale-105 flex items-center justify-center shadow-inner w-10 h-10 font-bold bg-white -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 group md:w-16 md:h-16 lg:w-24 lg:h-24 left-1/2 transition-all duration-300"
          )}
        >
          {!isSpinning && !isHolding && (
            <span className="w-full h-full z-1 bg-red-300 rounded-full animate-ping-slow"></span>
          )}
          <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 select-none md:tex-xl lg:text-2xl bg-clip-text text-transparent animate-text">
            {isHolding ? "Release" : "Spin"}
          </span>
        </button>
      </div>

      <Dialog
        open={!!lastPrize}
        onClose={() => setLastPrize(null)}
        className="relative z-[1000]"
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex items-center justify-center">
          <audio src="/sounds/cheer.mp3" autoPlay />

          <Confetti width={3000} height={3000} />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
          <div className="w-[98%] md:w-[50%] py-10 bg-white relative z-1 px-4 md:px-10 rounded-lg">
            <p className="text-2xl font-bold text-center mb-10">
              Congratulations! You won
            </p>
            <p className="text-4xl font-medium text-red-400 text-center mb-10">
              {lastPrize?.text}
            </p>
            {lastPrize?.image && (
              <img
                src={lastPrize?.image}
                alt={lastPrize?.text}
                className="w-full h-full object-contain aspect-video mb-6 max-w-[50%] mx-auto"
              />
            )}
            <button
              className="w-full bg-red-400 hover:bg-red-500 text-white font-bold py-4 px-10 rounded-lg text-xl"
              onClick={() => {
                setLastPrize(null);
              }}
            >
              Yayyy!
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default BaseWheel;
