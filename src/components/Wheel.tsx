"use client";

import BaseWheel from "./BaseWheel";

export default function Wheel() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <p className="text-2xl font-semibold text-gray-600">
        Click, hold, and release the spin to win!
      </p>
      <BaseWheel />
    </div>
  );
}
