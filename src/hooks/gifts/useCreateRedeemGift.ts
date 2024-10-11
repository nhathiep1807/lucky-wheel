import giftApi from "@/api/gift";
import { TBaseResponse } from "@/types/common";
import { TRedeemGiftRequest } from "@/types/gift";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateRedeemGiftMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<TBaseResponse<any>, Error, TRedeemGiftRequest>({
        mutationFn: (data) => giftApi.redeemGift(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gift"] });
        },
    });
};
