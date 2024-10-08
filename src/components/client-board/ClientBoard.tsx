import { GlobalContext } from '@/app/context';
import { useGetRankingMutation } from '@/hooks/users/useGetRanking';
import { TypeErrorResponse } from '@/types/common';
import { TRankingRequest } from '@/types/user';
import React, { useContext, useEffect, useRef } from 'react'
import toast from 'react-hot-toast';
import { Loader } from '../loader';

function getStartOfDay(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
}

function ClientBoard() {
    const rankingRef = useRef<any[]>();
    const { playerInfo } = useContext(GlobalContext);
    const { mutate: getRanking, isPending } = useGetRankingMutation()

    useEffect(() => {
        const date = new Date();
        const rankingBody: TRankingRequest = {
            fromDate: getStartOfDay(date),
            toDate: date.toISOString(),
        }
        getRanking(rankingBody, {
            onSuccess: (data) => {
                rankingRef.current = data.data;
            },
            onError: (error: any) => {
                const _error: TypeErrorResponse = error;
                toast.error(error);
            },
        })
    }, [getRanking])

    return (
        <div className='fixed top-20 left-0'>
            <div className="relative p-[4px] min-w-[200px] w-fit rounded-md bg-gray-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_0_1px_#fff,inset_0_0_0_1px_#fff,0_0_3px_#08f,0_0_5px_#08f,0_0_10px_#08f,0_0_15px_#08f]"></div>
                <div className="relative bg-white rounded-md p-4 z-10">
                    {playerInfo ? null : <h2 className="font-semibold text-xl text-black">Player Name</h2>}
                    <h2 className="font-semibold text-xl text-black">{playerInfo?.name}</h2>
                    {playerInfo ? <h3 className="text-black">Points: <span className="font-medium">{playerInfo?.totalPoints}</span></h3> : null}
                    <div className='border my-6'></div>
                    <h2 className="font-semibold text-3xl text-yellow-500 italic underline">Ranking</h2>
                    {rankingRef?.current ? (
                        <ol className='text-black list-decimal p-4' type='1'>
                            {rankingRef?.current?.map((player: any, index: number) => (
                                <li key={index}>{player.username} - {player.points}</li>
                            ))}
                        </ol>
                    ) : (
                        <Loader />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ClientBoard