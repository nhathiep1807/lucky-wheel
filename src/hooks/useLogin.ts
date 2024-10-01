import authApi from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
    return useMutation({
        mutationFn: authApi.login,
    });
};