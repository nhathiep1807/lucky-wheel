import wheelItemsApi from "@/api/wheel-items";
import { useQuery } from "@tanstack/react-query";

export const useGetListWheelItemQuery = () => {
    return useQuery({
        queryKey: ["items"],
        queryFn: () => wheelItemsApi.getWheelItems,
    });
};