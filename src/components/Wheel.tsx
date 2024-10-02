"use client";

import { AdminBoard } from "./admin-board";
import BaseWheel from "./BaseWheel";
import { Drawer } from "./drawer";

export default function Wheel() {
  return (
    <div>
      <Drawer>
        <AdminBoard />
      </Drawer>
      <div className="flex flex-col items-center justify-center w-full gap-4">
        <div></div>
        <BaseWheel />
        <p className="text-2xl font-semibold text-gray-600">
          Hold Down, Speed Up—Your Next Drink Awaits!
        </p>
      </div>
    </div>
  );
}
