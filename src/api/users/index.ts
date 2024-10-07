import axiosClient from "@/axios-client";
import { TBaseResponse } from "@/types/common";
import { TCreateNewUserResquest, TRankingRequest } from "@/types/user";
import { postRequest } from "@/utils/functions";

const userApi = {
    createNewUser: (data: TCreateNewUserResquest): Promise<TBaseResponse<any>> =>
        postRequest("/user", data),
    getUserByPhone: (phoneNumber: string): Promise<TBaseResponse<any>> =>
        axiosClient.get(`/user/${phoneNumber}`),
    updateUser: (data: FormData): Promise<TBaseResponse<any>> =>
        axiosClient.patch(`/user`, data),
    deleteUser: (id: string): Promise<TBaseResponse<any>> =>
        axiosClient.delete(`/user/${id}`),
    getRanking: (data: TRankingRequest): Promise<TBaseResponse<any>> => axiosClient.post('/ranking', data)
};

export default userApi;
