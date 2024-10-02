import axiosClient from "@/axios-client";
import { TLoginRequest, TLoginResponse } from "@/types/auth";
import { TBaseResponse } from "@/types/common";

const authApi = {
    login: (data: TLoginRequest): Promise<TBaseResponse<TLoginResponse>> =>
        axiosClient.post("/auth/login", data),
};

export default authApi;
