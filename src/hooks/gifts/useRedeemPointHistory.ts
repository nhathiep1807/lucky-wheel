import giftApi from "@/api/gift";
import { TBaseResponse } from "@/types/common";
import { TRedeemPointRequest } from "@/types/gift";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRedeemPointHistoryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<TBaseResponse<any>, Error, TRedeemPointRequest>({
        mutationFn: (data) => giftApi.redeemPointHistory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["player"] });
        },
    });
};
