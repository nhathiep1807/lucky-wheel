import axiosClient from "@/axios-client";
import { TLoginRequest } from "@/types/auth";

const authApi = {
    login: (data: TLoginRequest): Promise<unknown> =>
        axiosClient.post("/auth/login", data),
};

export default authApi;
