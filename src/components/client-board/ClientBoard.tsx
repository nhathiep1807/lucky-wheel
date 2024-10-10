import { GlobalContext } from "@/app/context";
import { useGetRankingMutation } from "@/hooks/users/useGetRanking";
import { TypeErrorResponse } from "@/types/common";
import { TRankingRequest } from "@/types/user";
import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "../loader";

function getStartOfDay(date = new Date()) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).toISOString();
}

function ClientBoard() {
  const [rank, setRank] = useState<any[]>([]);
  const { playerInfo } = useContext(GlobalContext);
  const { mutate: getRanking, isPending } = useGetRankingMutation();

  useEffect(() => {
    const date = new Date();
    const rankingBody: TRankingRequest = {
      fromDate: getStartOfDay(date),
      toDate: date.toISOString(),
    };
    getRanking(rankingBody, {
      onSuccess: (data) => {
        setRank(data.data);
      },
      onError: (error: any) => {
        const _error: TypeErrorResponse = error;
        toast.error(error);
      },
    });
  }, [rank, getRanking]);

  return (
    <div className="fixed top-20 left-0 shadow-xl">
      <div className="relative p-[4px] min-w-[200px] w-fit rounded-md bg-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#16a34a] via-[#4f46e5] to-[#8b5cf6] shadow-[0_0_0_1px_#fff,inset_0_0_0_1px_#fff,0_0_3px_#08f,0_0_5px_#08f,0_0_10px_#08f,0_0_15px_#08f]"></div>
        <div className="relative rounded-md p-4 z-10 bg-neutral-100">
          {playerInfo ? null : (
            <h2 className="font-semibold text-xl text-black">Player Name</h2>
          )}
          <h2 className="font-semibold text-xl text-black">
            {playerInfo?.name}
          </h2>
          {playerInfo ? (
            <h3 className="text-black">
              Points:{" "}
              <span className="font-medium">{playerInfo?.totalPoints}</span>
            </h3>
          ) : null}
          <div className="border my-6"></div>
          <h2 className="font-semibold text-3xl text-yellow-500 italic underline">
            Ranking
          </h2>
          {rank.length > 0 ? (
            <ol className="text-black list-decimal p-4" type="1">
              {rank.map((player: any, index: number) => (
                <li key={index}>
                  {player.username} - {player.points}
                </li>
              ))}
            </ol>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientBoard;
