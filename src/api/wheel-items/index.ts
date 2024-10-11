import axiosClient from "@/axios-client";
import { TBaseResponse } from "@/types/common";
import { TCreateWheelItemResponse } from "@/types/wheelItems";
import { postRequest } from "@/utils/functions";

const wheelItemsApi = {
  createWheelItem: (
    data: FormData
  ): Promise<TBaseResponse<TCreateWheelItemResponse>> =>
    postRequest("/item", data, true),
  getWheelItems: (): Promise<TBaseResponse<TCreateWheelItemResponse[]>> =>
    axiosClient.get("/item"),
  getWheelItemById: (id: string): Promise<TBaseResponse<any>> =>
    axiosClient.get(`/item/${id}`),
  updateWheelItem: (data: FormData): Promise<TBaseResponse<any>> =>
    axiosClient.put(`/item`, data),
  reorderWheelItem: (
    data: { id: number; order: number }[]
  ): Promise<TBaseResponse<any>> => axiosClient.post(`/item/reorder`, data),
  deleteWheelItem: (id: string): Promise<TBaseResponse<any>> =>
    axiosClient.delete(`/item/${id}`),

};

export default wheelItemsApi;
