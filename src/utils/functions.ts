import { TGift } from '@/types/gift';
import axiosClient from "@/axios-client";
import { TBaseResponse } from "@/types/common";
import { TCreateWheelItemResponse } from "@/types/wheelItems";
import { AxiosResponse } from "axios";

export interface Prize {
  text?: string;
  color: string;
  image?: string;
  angle: number;
  itemId?: number
}

export const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export function formatToPrizeArray(data: TCreateWheelItemResponse[] | undefined): Prize[] {
  const totalItems = data?.length;
  if (data && totalItems) return data.map((item, index) => ({
    text: item.name,
    color: item.color,
    image: item.img,
    angle: +item.weight,
    itemId: item.id
  }));
  return [{
    color: '',
    angle: 360
  }]
}

const convertResponse = <T>(response: AxiosResponse): TBaseResponse<T> => {
  return {
    isSuccess: response.status >= 200 && response.status < 300,
    message: response.statusText,
    data: response.data
  };
};

export const postRequest = <T>(url: string, data: any, isFormData = false): Promise<TBaseResponse<T>> => {
  const headers = isFormData
    ? { "Content-Type": "multipart/form-data" }
    : { "Content-Type": "application/json" };

  return axiosClient.post(url, data, { headers })
    .then(response => convertResponse<T>(response))
    .catch(error => {
      if (error.response) {
        return convertResponse<T>(error.response);
      }
      throw error;
    });
};

export const FormatRedeemGiftList = (data?: TGift[]) => {
  return data ? data.map((item) => ({ id: item.id, name: item.name, totalPoint: item.totalPoint.toString() })) : []
}