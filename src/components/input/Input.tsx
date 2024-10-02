import React from "react";
import classcat from "classcat";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    name?: string;
    register?: any;
    placeholder?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    name,
    type,
    placeholder,
    register,
    error,
    className,
    ...props
}) => {
    return (
        <div className={classcat(["grid gap-1", className])}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-semibold text-gray-700"
                >
                    {label}
                </label>
            )}
            <input
                id={name}
                type={type}
                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
                placeholder={placeholder}
                {...register?.(name)}
                {...props}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default Input;
