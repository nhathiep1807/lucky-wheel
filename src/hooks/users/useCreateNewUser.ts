import userApi from "@/api/users";
import { TBaseResponse } from "@/types/common";
import { TCreateNewUserResquest } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateNewUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<TBaseResponse<any>, Error, TCreateNewUserResquest>({
        mutationFn: (data) => userApi.createNewUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
};
