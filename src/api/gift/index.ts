import axiosClient from "@/axios-client";
import { TBaseResponse } from "@/types/common";
import { TGift, TRedeemGiftRequest, TRedeemPointRequest, TUpdateRedeemGiftRequest } from "@/types/gift";
import { postRequest } from "@/utils/functions";

const giftApi = {
    getListRedeemGift: (): Promise<TBaseResponse<TGift>> =>
        axiosClient.get('/redeem-gift'),
    redeemPointHistory: (data: TRedeemPointRequest): Promise<TBaseResponse<any>> =>
        postRequest("/redeem-point-history", data),
    redeemGift: (data: TRedeemGiftRequest): Promise<TBaseResponse<any>> =>
        postRequest("/redeem-gift", data),
    updateRedeemGift: (data: TUpdateRedeemGiftRequest): Promise<TBaseResponse<any>> => axiosClient.put('/redeem-gift', data),
    deleteRedeemGift: (id: number): Promise<TBaseResponse<any>> =>
        axiosClient.delete(`/redeem-gift/${id}`),
};

export default giftApi;
