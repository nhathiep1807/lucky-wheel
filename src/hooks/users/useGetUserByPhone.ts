import userApi from "@/api/users";
import { TPlayer } from "@/types/auth";
import { TBaseResponse } from "@/types/common";
import { useQuery } from "@tanstack/react-query";

export const useGetUserQuery = ({ phone }: { phone: string }) => {
    return useQuery<TBaseResponse<any>, Error, TBaseResponse<TPlayer>>({
        queryKey: ["activities", phone],
        queryFn: () => userApi.getUserByPhone(phone),
        refetchOnWindowFocus: false,
        enabled: !!phone
    });
};