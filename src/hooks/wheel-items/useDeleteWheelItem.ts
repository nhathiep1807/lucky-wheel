import wheelItemsApi from "@/api/wheel-items";
import { TBaseResponse } from "@/types/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useDeleteWheelItemMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<TBaseResponse<any>, Error, string>({
        mutationFn: (id: string) => wheelItemsApi.deleteWheelItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wheelItems"] });
        },
    });
};