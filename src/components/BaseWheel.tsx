import React, { useCallback, useEffect, useRef, useState } from "react";
import "./style.css";
import { twMerge } from "tailwind-merge";
import { useTrackTime } from "@/hooks/useTrackTime";

import EnergyRing from "./EnergyRing";
import Confetti from "react-confetti";

interface Prize {
  text: string;
  color: string;
  angle: number;
}

const prizes: Prize[] = [
  { text: "10% Off Sticker Price", color: "hsl(197 30% 43%)", angle: 30 }, //34.8deg
  { text: "No Money Down", color: "hsl(43 74% 66%)", angle: 40 },
  { text: "Half Off Sticker Price", color: "hsl(27 87% 67%)", angle: 40 },
  { text: "Free DIY Carwash", color: "hsl(12 76% 61%)", angle: 40 },
  { text: "Free Car", color: "hsl(173 58% 39%)", angle: 30 },
  { text: "Eternal Damnation", color: "hsl(350 60% 52%)", angle: 60 },
  { text: "One Solid Hug", color: "hsl(140 11% 74%)", angle: 20 },
  { text: "Used Travel Mug", color: "hsl(91 43% 54%)", angle: 60 },
];

const BaseWheel: React.FC = () => {
  const { holdTime, isHolding, handleMouseDown, handleMouseUp } =
    useTrackTime();

  const [lastPrize, setLastPrize] = useState<Prize | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const spinnerRef = useRef<HTMLUListElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentSliceRef = useRef<number>(0);

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

    let currentRotation = 0;
    prizes.forEach(({ text, angle }) => {
      const realityAngle = (angle * 360) / totalAngle;
      const rotation = realityAngle / 2 + currentRotation;

      spinner.insertAdjacentHTML(
        "beforeend",
        `<li class="prize" style="--rotate: ${rotation}deg">
          <span class="text">${text}</span>
        </li>`
      );
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
    setIsSpinning(false);
    console.log("enddddd");
    setLastPrize(getCurrentPrize());

    setRotation(rotation % 360);
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

  return (
    <div className="flex">
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
        <EnergyRing
          holdTime={holdTime}
          isHolding={isHolding}
          className="absolute top-0 left-0 w-full h-full"
        />

        <div className="ticker" ref={tickerRef}></div>
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={() => {
            handleMouseUp();
            handleSpin();
          }}
          onTouchStart={handleMouseDown}
          onTouchEnd={() => {
            handleMouseUp();
            handleSpin();
          }}
          disabled={isSpinning}
          className="absolute flex items-center justify-center w-10 h-10 p-4 px-5 py-3 overflow-hidden font-bold text-indigo-600 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-2xl top-1/2 group md:w-16 md:h-16 lg:w-24 lg:h-24 left-1/2 hover:scale-110 transition-all duration-300"
        >
          <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
          <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
            <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-500 rounded-full blur-md"></span>
            <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-pink-500 rounded-full blur-md"></span>
          </span>
          <span className="relative text-white select-none md:tex-xl lg:text-2xl">
            {isHolding ? "Release" : "Spin"}
          </span>
        </button>
      </div>

      {lastPrize && (
        <div
          className={twMerge(
            "fixed top-0 left-0 w-full h-full z-[999] flex items-center justify-center"
            // lastPrize ? "flex" : "hidden"
          )}
        >
          <audio src="/sounds/cheer.mp3" autoPlay />
          <Confetti width={3000} height={3000} />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
          <div className="w-[50%] py-10 bg-white relative z-1 px-10 rounded-lg">
            <p className="text-2xl font-bold text-center mb-10">
              Congratulations! You won
            </p>
            <p className="text-4xl font-medium text-red-400 text-center mb-10">
              {lastPrize?.text}
            </p>
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
      )}
    </div>
  );
};

export default BaseWheel;
