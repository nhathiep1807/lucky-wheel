import React, { ButtonHTMLAttributes } from "react";
import classcat from "classcat";
import { Loader } from "../loader";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    isLoading?: boolean;
    onClick: () => void;
    name: string;
    disable?: boolean
}

const Button = ({
    className,
    isLoading,
    onClick,
    type = "button",
    name,
    disable
}: Props) => {
    return (
        <button
            onClick={onClick}
            type={type}
            className={classcat([
                `flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:cursor-pointer ${!disable ? "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200" : ""}`,
                ,
                className,
                isLoading && "opacity-50",
                disable && "bg-gray-400"
            ])}
            disabled={isLoading || disable}
        >
            {isLoading && <Loader />}
            {name}
        </button>
    );
};

export default Button;

