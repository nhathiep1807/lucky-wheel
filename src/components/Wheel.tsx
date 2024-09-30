"use client";

import { useTrackTime } from "@/hooks/useTrackTime";
import EnergyRing from "./EnergyRing";

export default function Wheel() {
  const { holdTime, isHolding, handleMouseDown, handleMouseUp } =
    useTrackTime();

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <p className="text-2xl font-semibold text-gray-600">
        Click, hold, and release the spin to win!
      </p>
      <EnergyRing holdTime={holdTime} isHolding={isHolding} />
      <button
        className={`mt-4 px-6 py-2 text-white font-bold rounded-full transition-colors ${
          isHolding ? "bg-red-500" : "bg-blue-500 hover:bg-blue-600"
        }`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {isHolding ? "Release" : "Hold Me"}
      </button>

      <p>Hold Time: {holdTime}</p>
    </div>
  );
}
