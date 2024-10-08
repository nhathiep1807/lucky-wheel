import wheelItemsApi from "@/api/wheel-items";
import { TBaseResponse } from "@/types/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReorderWheelItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TBaseResponse<any>,
    Error,
    { id: number; order: number }[]
  >({
    mutationFn: (data) => wheelItemsApi.reorderWheelItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wheelItems"] });
    },
  });
};
