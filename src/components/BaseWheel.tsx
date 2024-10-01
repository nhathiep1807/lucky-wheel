import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { twMerge } from "tailwind-merge";
import { useTrackTime } from "@/hooks/useTrackTime";

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

    prizes.forEach(({ text, color }, i) => {
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
      Math.floor(((holdTime * 2) / 1000) * 360 + spinertia(2000, 5000));

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
    <div className={twMerge("deal-wheel", isSpinning && "is-spinning")}>
      <ul
        className="spinner"
        ref={spinnerRef}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning
            ? "transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)"
            : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      ></ul>
      <div className="ticker" ref={tickerRef}></div>
      <button
        className="absolute flex items-center justify-center w-32 h-32 font-bold -translate-x-1/2 bg-white border-2 border-black rounded-full left-1/2"
        onMouseDown={handleMouseDown}
        onMouseUp={() => {
          handleMouseUp();
          handleSpin();
        }}
        disabled={isSpinning}
      >
        {isHolding ? "Release" : "Spin"}
      </button>
    </div>
  );
};

export default BaseWheel;
