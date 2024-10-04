import axiosClient from "@/axios-client";
import { TBaseResponse } from "@/types/common";
import { TCreateNewUserResquest } from "@/types/user";
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
};

export default userApi;
