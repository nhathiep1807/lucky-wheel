import React from "react";
import classcat from "classcat";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    name?: string;
    register?: any;
    placeholder?: string;
    error?: string;
    options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({
    label,
    name,
    register,
    error,
    placeholder,
    className,
    options,
    ...props
}) => {
    return (
        <div className={classcat(["grid gap-2", className])}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-semibold text-gray-700"
                >
                    {label}
                </label>
            )}
            <select
                id={name}
                className="block w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
                {...register?.(name)}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled className="text-gray-500">
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default Select;
