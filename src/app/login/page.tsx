"use client"

import React, { useContext } from 'react'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { useLogin } from '@/hooks/useLogin';
import { useRouter } from 'next/navigation';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PATH from '@/constants/path';
import { GlobalContext } from '../context';
import { TypeErrorResponse } from '@/types/common';
import cookie from '@/utils/cookie';
import { ACCESS_TOKEN } from '@/constants/common';


const LoginSchema = z.object({
    phoneNumber: z.string().min(1, "User Name must be at least 1 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof LoginSchema>;

function Login() {
    const router = useRouter();
    const { setIsAuthenticated, setUserInfo } = useContext(GlobalContext);
    const { mutate: login, isPending } = useLogin()

    const { handleSubmit, register, formState } = useForm<LoginForm>({
        defaultValues: {
            phoneNumber: "",
            password: "",
        },
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = (data: LoginForm) => {
        login(data, {
            onSuccess: (data) => {
                cookie.set(ACCESS_TOKEN, data.data?.access_token);
                setIsAuthenticated(true);
                setUserInfo(data.data.user);
                router.push(PATH.home);
            },
            onError: (error: any) => {
                const _error: TypeErrorResponse = error;
                console.log('error!', error)
            },
        });
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
                            label="Phone Number"
                            name="phoneNumber"
                            type="text"
                            placeholder="Phone Number"
                            register={register}
                            error={formState.errors.phoneNumber?.message}
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