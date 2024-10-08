import userApi from "@/api/users";
import { TBaseResponse } from "@/types/common";
import { TCountPointRequest } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCountPointMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<TBaseResponse<any>, Error, TCountPointRequest>({
        mutationFn: (data) => userApi.countPoint(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["player"] });
        },
    });
};
