"use client";

import { useGetListWheelItemQuery } from "@/hooks/wheel-items/useGetListWheelItem";
import { formatToPrizeArray } from "@/utils/functions";
import React, { useMemo } from "react";
import { AdminBoard } from "./admin-board";
import BaseWheel from "./BaseWheel";
import { ClientBoard } from "./client-board";
import { Drawer } from "./drawer";

export default function Wheel() {
  const { data: listWheelItems, isLoading } = useGetListWheelItemQuery()
  const BaseWheelMemo = React.memo(BaseWheel)
  const ClientBoardMemo = React.memo(ClientBoard)
  const prizes = useMemo(
    () => formatToPrizeArray(listWheelItems?.data),
    [listWheelItems]
  );

  return (
    <div>
      <Drawer>
        <AdminBoard />
      </Drawer>
      <ClientBoardMemo />
      <div className="flex flex-col items-center justify-center w-full gap-14">
        <p className="text-[40px] text-3xl font-semibold bg-clip-text text-transparent animate-text">
          Hold Down, Speed Up—Your Next Drink Awaits!
        </p>

        <BaseWheelMemo prizes={prizes} />
      </div>
    </div>
  );
}
