import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const useCreateNewUserForm = () => {
    const CreateNewUserSchema = z.object({
        name: z.string().min(1, "Name must be at least 1 characters"),
        phoneNumber: z.string().min(10, "Phone Number must be at least 10 characters"),
    });

    type CreateNewUserForm = z.infer<typeof CreateNewUserSchema>

    const { handleSubmit: submitNewUser, register: registerNewUser, formState: formStateNewUser, reset: resetCreateUserForm } = useForm<CreateNewUserForm>({
        defaultValues: {
            name: "",
            phoneNumber: ""
        },
        resolver: zodResolver(CreateNewUserSchema),
    });

    return {
        submitNewUser,
        registerNewUser,
        formStateNewUser,
        resetCreateUserForm
    }
}

