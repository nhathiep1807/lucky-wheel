import wheelItemsApi from "@/api/wheel-items";
import { useQuery } from "@tanstack/react-query";

export const useGetListWheelItemQuery = () => {
    return useQuery({
        queryKey: ["wheelItems"],
        queryFn: () => wheelItemsApi.getWheelItems(),
    });
};