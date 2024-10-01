"use client"

import React from 'react'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { useLogin } from '@/hooks/useLogin';
import { useRouter } from 'next/navigation';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PATH from '@/constants/path';


const LoginSchema = z.object({
    userName: z.string().min(1, "User Name must be at least 1 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof LoginSchema>;

function Login() {
    const router = useRouter();
    const { mutate: login, isPending } = useLogin()

    const { handleSubmit, register, formState } = useForm<LoginForm>({
        defaultValues: {
            userName: "",
            password: "",
        },
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = (data: LoginForm) => {
        router.push(PATH.home);
        // login(data, {
        //     onSuccess: (data) => {

        //     },
        //     onError: (error: any) => {
        //     },
        // });
    };

    return (
        <div className='w-dvw h-dvh flex items-center bg-[#F4D03F] bg-[linear-gradient(132deg,_#F4D03F_0%,_#16A085_100%)]'>
            <div className='min-w-96 m-auto'>
                <div className="p-4 rounded-xl border-stone-300 border-2 bg-stone-100 text-black text-sm shadow-[10px_10px_0px_0px_#000] transition duration-200">
                    <h2 className="uppercase text-3xl text-center font-bold text-text-title">
                        Login
                    </h2>

                    <form className="mt-6 grid gap-4">
                        <Input
                            label="Username"
                            name="userName"
                            type="text"
                            placeholder="User Name"
                            register={register}
                            error={formState.errors.userName?.message}
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            register={register}
                            error={formState.errors.password?.message}
                        />
                    </form>

                    <Button
                        className='mt-5 m-auto'
                        name="Login"
                        onClick={handleSubmit(onSubmit)}
                        isLoading={isPending}
                    />
                </div>
            </div>
        </div>
    )
}

export default Login