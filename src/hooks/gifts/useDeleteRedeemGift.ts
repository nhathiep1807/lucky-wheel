import giftApi from "@/api/gift";
import { TBaseResponse } from "@/types/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useDeleteRedeemGiftMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<TBaseResponse<any>, Error, number>({
        mutationFn: (id: number) => giftApi.deleteRedeemGift(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gift"] });
        },
    });
};