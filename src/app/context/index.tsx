"use client";
import { ACCESS_TOKEN, PLAYER_INFO, USER_INFO } from "@/constants/common";
import { TPlayer, TProfile } from "@/types/auth";
import cookie from "@/utils/cookie";
import { createContext, useLayoutEffect, useState } from "react";

type GlobalContextType = {
    userInfo: TProfile | null;
    setUserInfo: React.Dispatch<React.SetStateAction<TProfile | null>>;
    playerInfo: TPlayer | null;
    setPlayerInfo: React.Dispatch<React.SetStateAction<TPlayer | null>>;
    isAuthenticated: boolean | null;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
    reset: () => void;
};

const initialGlobalContext: GlobalContextType = {
    userInfo: null,
    setUserInfo: () => null,
    playerInfo: null,
    setPlayerInfo: () => null,
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

    const [playerInfo, setPlayerInfo] = useState<TPlayer | null>(
        initialGlobalContext.playerInfo
    );

    const reset = () => {
        setIsAuthenticated(false);
        setUserInfo(null);
        setPlayerInfo(null)
        localStorage.removeItem(USER_INFO);
        localStorage.removeItem(PLAYER_INFO);
    };

    useLayoutEffect(() => {
        const token = cookie.get(ACCESS_TOKEN);

        if (token) {
            setIsAuthenticated(true);
            const storedUserInfo = localStorage.getItem(USER_INFO);
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo));
            }

            const storePlayerInfo = localStorage.getItem(PLAYER_INFO);
            if (storePlayerInfo) {
                setPlayerInfo(JSON.parse(storePlayerInfo));
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

    useLayoutEffect(() => {
        if (playerInfo && playerInfo !== null) {
            localStorage.setItem(PLAYER_INFO, JSON.stringify(playerInfo));
        }
        else {
            localStorage.removeItem(PLAYER_INFO);
        }
    }, [playerInfo]);

    return (
        <GlobalContext.Provider
            value={{
                userInfo,
                setUserInfo,
                playerInfo,
                setPlayerInfo,
                isAuthenticated,
                setIsAuthenticated,
                reset,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
