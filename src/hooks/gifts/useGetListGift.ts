import giftApi from "@/api/gift";
import userApi from "@/api/users";
import { TPlayer } from "@/types/auth";
import { TBaseResponse } from "@/types/common";
import { TGift } from "@/types/gift";
import { useQuery } from "@tanstack/react-query";

export const useGetListGiftQuery = () => {
    return useQuery<TBaseResponse<any>, Error, TBaseResponse<TGift[]>>({
        queryKey: ["gift"],
        queryFn: () => giftApi.getListRedeemGift(),
        refetchOnWindowFocus: false,
    });
};