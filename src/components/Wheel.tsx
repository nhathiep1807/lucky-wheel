"use client";

import BaseWheel from "./BaseWheel";
import { useTrackTime } from "@/hooks/useTrackTime";
import { AdminBoard } from "./admin-board";
import { Drawer } from "./drawer";
import EnergyRing from "./EnergyRing";

export default function Wheel() {
  const { holdTime, isHolding, handleMouseDown, handleMouseUp } =
    useTrackTime();

  return (
    <div>
      <Drawer>
        <AdminBoard />
      </Drawer>
      <div className="flex flex-col items-center justify-center w-full gap-4">
        <BaseWheel />
        <p className="text-2xl font-semibold text-gray-600">
          Hold Down, Speed Up—Your Next Drink Awaits!
        </p>
      </div>
    </div>
  );
}
