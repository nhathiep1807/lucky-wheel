import giftApi from "@/api/gift";
import { TBaseResponse } from "@/types/common";
import { TUpdateRedeemGiftRequest } from "@/types/gift";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateRedeemGiftMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<TBaseResponse<any>, Error, TUpdateRedeemGiftRequest>({
        mutationFn: (data) => giftApi.updateRedeemGift(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gift"] });
        },
    });
};
