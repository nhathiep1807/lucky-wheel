import wheelItemsApi from "@/api/wheel-items";
import { TBaseResponse } from "@/types/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateWheelItemMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<TBaseResponse<any>, Error, FormData>({
        mutationFn: (data) => wheelItemsApi.updateWheelItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wheelItems"] });
        },
    });
};
