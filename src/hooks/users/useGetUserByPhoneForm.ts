import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const useGetUserByPhoneForm = () => {
    const CreateNewUserSchema = z.object({
        phone: z.string().min(10, "Phone Number must be at least 10 characters"),
    });

    type CreateNewUserForm = z.infer<typeof CreateNewUserSchema>

    const { handleSubmit: submitGetUser, register: registerGetUser, formState: formStateGetUser, reset: resetGetUserForm, getValues: getFieldsData } = useForm<CreateNewUserForm>({
        defaultValues: {
            phone: "",
        },
        resolver: zodResolver(CreateNewUserSchema),
    });

    return {
        submitGetUser,
        registerGetUser,
        formStateGetUser,
        resetGetUserForm,
        getFieldsData
    }
}

