import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { twMerge } from "tailwind-merge";
import { useTrackTime } from "@/hooks/useTrackTime";
import EnergyBar from "./EnergyBar";
import EnergyRing from "./EnergyRing";

interface Prize {
  text: string;
  color: string;
}

const prizes: Prize[] = [
  { text: "10% Off Sticker Price", color: "hsl(197 30% 43%)" },
  { text: "Free Car", color: "hsl(173 58% 39%)" },
  { text: "No Money Down", color: "hsl(43 74% 66%)" },
  { text: "Half Off Sticker Price", color: "hsl(27 87% 67%)" },
  { text: "Free DIY Carwash", color: "hsl(12 76% 61%)" },
  { text: "Eternal Damnation", color: "hsl(350 60% 52%)" },
  { text: "Used Travel Mug", color: "hsl(91 43% 54%)" },
  { text: "One Solid Hug", color: "hsl(140 36% 74%)" },
];

const BaseWheel: React.FC = () => {
  const { holdTime, isHolding, handleMouseDown, handleMouseUp } =
    useTrackTime();

  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const spinnerRef = useRef<HTMLUListElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  let currentSlice = 0;

  const prizeSlice = 360 / prizes.length;
  const prizeOffset = Math.floor(180 / prizes.length);

  const spinertia = (min: number, max: number) =>
    Math.floor(((holdTime * 2) / 1000) * (max - min + 1)) + min;

  const setupWheel = () => {
    createConicGradient();
    createPrizeNodes();
  };

  const createPrizeNodes = () => {
    const spinner = spinnerRef.current;
    if (!spinner) return;

    prizes.forEach(({ text }, i) => {
      const rotation = prizeSlice * i * -1 - prizeOffset;
      spinner.insertAdjacentHTML(
        "beforeend",
        `<li class="prize" style="--rotate: ${rotation}deg">
          <span class="text">${text}</span>
        </li>`
      );
    });
  };

  const createConicGradient = () => {
    const spinner = spinnerRef.current;
    if (!spinner) return;

    spinner.setAttribute(
      "style",
      `background: conic-gradient(
        from -90deg,
        ${prizes
          .map(
            ({ color }, i) =>
              `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`
          )
          .reverse()}
      );`
    );
  };

  const runTickerAnimation = () => {
    if (!spinnerRef.current) return;

    const spinnerStyles = window.getComputedStyle(spinnerRef.current);
    const values = spinnerStyles.transform
      .split("(")[1]
      .split(")")[0]
      .split(",");
    const a = parseFloat(values[0]);
    const b = parseFloat(values[1]);
    let rad = Math.atan2(b, a);
    if (rad < 0) rad += 2 * Math.PI;

    const angle = Math.round(rad * (180 / Math.PI));
    const slice = Math.floor(angle / prizeSlice);

    if (currentSlice !== slice) {
      if (tickerRef.current) {
        tickerRef.current.style.animation = "none";
        setTimeout(() => {
          if (tickerRef.current) {
            tickerRef.current.style.animation = "";
          }
        }, 1);
      }
      currentSlice = slice;
    }

    if (isSpinning) {
      animationFrameRef.current = requestAnimationFrame(runTickerAnimation);
    }
  };

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
  }, []);

  useEffect(() => {
    if (isSpinning) {
      animationFrameRef.current = requestAnimationFrame(runTickerAnimation);
    }
  }, [isSpinning]);

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
          className="absolute flex items-center justify-center w-10 h-10 p-4 px-5 py-3 overflow-hidden font-bold text-indigo-600 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-2xl top-1/2 group md:w-16 md:h-16 lg:w-32 lg:h-32 left-1/2"
        >
          <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
          <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
            <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-500 rounded-full blur-md"></span>
            <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-pink-500 rounded-full blur-md"></span>
          </span>
          <span className="relative text-white select-none">
            {isHolding ? "Release" : "Spin"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default BaseWheel;
