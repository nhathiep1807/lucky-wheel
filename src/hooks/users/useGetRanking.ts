import userApi from "@/api/users";
import { TBaseResponse } from "@/types/common";
import { TRankingRequest } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetRankingMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<TBaseResponse<any>, Error, TRankingRequest>({
        mutationFn: (data) => userApi.getRanking(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["player"] });
        },
    });
};
