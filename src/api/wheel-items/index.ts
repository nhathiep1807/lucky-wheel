import axiosClient from "@/axios-client";
import { TLoginRequest, TLoginResponse } from "@/types/auth";
import { TBaseResponse } from "@/types/common";
import { TCreateWheelItemResponse } from "@/types/wheelItems";

const wheelItemsApi = {
    createWheelItem: (data: FormData): Promise<TBaseResponse<TCreateWheelItemResponse>> =>
        axiosClient.post("/item", data),
    getWheelItems: (): Promise<TBaseResponse<TCreateWheelItemResponse[]>> =>
        axiosClient.get("/item"),
    getWheelItemById: (id: string): Promise<TBaseResponse<any>> =>
        axiosClient.get(`/item/${id}`),
    updateWheelItem: (id: string, data: FormData): Promise<TBaseResponse<any>> =>
        axiosClient.patch(`/item/${id}`, data),
    deleteWheelItem: (id: string): Promise<TBaseResponse<any>> =>
        axiosClient.delete(`/item/${id}`),
};

export default wheelItemsApi;
