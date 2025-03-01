import React, { useState } from 'react';
import { PlusIcon, CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';
import { useCreateWheelItemMutation } from '@/hooks/wheel-items/useCreateWheelItem';
import { TypeErrorResponse } from '@/types/common';
import toast from 'react-hot-toast';
import { Loader } from '../loader';

type ItemInput = {
    id: string,
    name: string,
    value: string,
    isLoading: boolean
};

const CreateItemSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 character"),
    value: z.string().min(1, "Value must be at least 1 character"),
});

const DynamicInput = () => {
    const [items, setItems] = useState<ItemInput[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: { name?: string; value?: string, isLoading?: boolean } }>({});
    const { mutate: creacreateWheelItem, isPending } = useCreateWheelItemMutation()

    const addNewInput = () => {
        setItems([...items, { id: uuidv4(), name: '', value: '', isLoading: false }]);
    };

    const handleChange = (id: string, field: keyof ItemInput, value: string) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setItems(updatedItems);
    };

    const onSubmit = (item: ItemInput) => {
        const result = CreateItemSchema.safeParse(item);
        if (!result.success) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [item.id]: {
                    name: result.error.formErrors.fieldErrors.name?.[0],
                    value: result.error.formErrors.fieldErrors.value?.[0]
                }
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                [item.id]: {}
            }));
            let formData = new FormData()
            formData.append('name', item.name)
            formData.append('value', item.value)
            formData.append('color', '#ffffff')
            formData.append('categoryId', '1')
            item.isLoading = true
            creacreateWheelItem(formData,
                {
                    onSuccess: (data) => {
                        toast.success('Create wheel item success!');
                        item.isLoading = false;
                        deleteItem(item.id)
                    },
                    onError: (error: any) => {
                        const _error: TypeErrorResponse = error;
                        item.isLoading = false
                        toast.error(error);
                    },
                })
        }
    };

    const deleteItem = (id: string) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
        setErrors(prevErrors => {
            const { [id]: removedError, ...restErrors } = prevErrors;
            return restErrors;
        });
    };

    return (
        <div className="space-y-4">
            <button className="flex items-center gap-1" type="button" onClick={addNewInput}>
                <PlusIcon className="text-black w-4 h-4" /><span className='font-semibold'>Add Item</span>
            </button>
            <div className='border max-h-[120px] min-h-[120px] overflow-y-auto'>
                {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 p-2">
                        <div className="flex items-baseline space-x-2">
                            <div>
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                                    placeholder="Name"
                                    className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
                                />
                                {errors[item.id]?.name && (
                                    <span className="text-sm text-red-600">{errors[item.id]?.name}</span>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={item.value}
                                    onChange={(e) => handleChange(item.id, 'value', e.target.value)}
                                    placeholder="Value"
                                    className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
                                />
                                {errors[item.id]?.value && (
                                    <p className="text-sm text-red-600">{errors[item.id]?.value}</p>
                                )}
                            </div>

                        </div>
                        <div className="flex items-center justify-center">
                            <button type="button" onClick={() => onSubmit(item)}>
                                {item.isLoading ? <Loader /> : <CheckCircleIcon className="text-black w-5 h-5" />}
                            </button>
                            <button type="button" onClick={() => deleteItem(item.id)}>
                                <TrashIcon className="text-black w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default DynamicInput;
