"use client";

import React, { PropsWithChildren, useState } from "react";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/outline"

type DrawerProps = {
    className?: React.CSSProperties
}


const Drawer = ({ className, children }: PropsWithChildren<DrawerProps>) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div
            className={`${className} min-h-screen bg-white shadow-lg z-10 fixed right-0 top-0 ${isOpen ? "w-[400px]" : "w-10"
                } transition-width duration-300`}
        >
            <button
                onClick={toggleMenu}
                className="absolute top-2 left-[-12px] bg-white rounded-full px-2 py-1 text-gray-500 shadow-md border shadow-[4px_2px_0px_0px_#808080]"
            >
                {isOpen ? <ChevronDoubleRightIcon className="text-black w-3 h-5" /> : <ChevronDoubleLeftIcon className="text-black w-3 h-5" />}
            </button>
            <div className={`${isOpen ? "w-[400px]" : "w-10"}`}>
                {isOpen ? children : <div></div>}
            </div>
        </div>
    );
};

export default Drawer
