"use client";

import { AdminBoard } from "./admin-board";
import BaseWheel from "./BaseWheel";
// import { ClientBoard } from "./client-board";
import { Drawer } from "./drawer";

export default function Wheel() {
  return (
    <div>
      <Drawer>
        <AdminBoard />
      </Drawer>
      {/* <ClientBoard /> */}
      <div className="flex flex-col items-center justify-center w-full gap-14">
        <p className="text-3xl font-semibold text-gray-600">
          Hold Down, Speed Up—Your Next Drink Awaits!
        </p>
        <BaseWheel />
      </div>
    </div>
  );
}
