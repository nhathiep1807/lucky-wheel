"use client";
import { ACCESS_TOKEN, USER_INFO } from "@/constants/common";
import { TProfile } from "@/types/auth";
import cookie from "@/utils/cookie";
import { createContext, useLayoutEffect, useState } from "react";

type GlobalContextType = {
    userInfo: TProfile | null;
    setUserInfo: React.Dispatch<React.SetStateAction<TProfile | null>>;
    isAuthenticated: boolean | null;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
    reset: () => void;
};

const initialGlobalContext: GlobalContextType = {
    userInfo: null,
    setUserInfo: () => null,
    isAuthenticated: null,
    setIsAuthenticated: () => null,
    reset: () => null,
};

export const GlobalContext =
    createContext<GlobalContextType>(initialGlobalContext);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        initialGlobalContext.isAuthenticated
    );

    const [userInfo, setUserInfo] = useState<TProfile | null>(
        initialGlobalContext.userInfo
    );

    const reset = () => {
        setIsAuthenticated(false);
        setUserInfo(null);
        localStorage.removeItem(USER_INFO);
    };

    useLayoutEffect(() => {
        const token = cookie.get(ACCESS_TOKEN);

        if (token) {
            setIsAuthenticated(true);
            const storedUserInfo = localStorage.getItem(USER_INFO);
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo));
            }
        } else setIsAuthenticated(false);
    }, []);

    useLayoutEffect(() => {
        if (userInfo) {
            localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
        } else {
            localStorage.removeItem(USER_INFO);
        }
    }, [userInfo]);

    return (
        <GlobalContext.Provider
            value={{
                userInfo,
                setUserInfo,
                isAuthenticated,
                setIsAuthenticated,
                reset,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
