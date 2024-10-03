import wheelItemsApi from "@/api/wheel-items";
import { TBaseResponse } from "@/types/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateWheelItemMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<TBaseResponse<any>, Error, FormData>({
        mutationFn: (formData) => wheelItemsApi.createWheelItem(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wheelItems"] });
        },
    });
};