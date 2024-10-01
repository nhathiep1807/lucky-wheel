import React, { useState } from 'react';
import { PlusIcon, CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Input } from '../input';

type ItemInput = {
    name: string,
    value: string
}

const DynamicInput = () => {
    const [items, setItems] = useState<ItemInput[]>([]);

    const addNewInput = () => {
        setItems([...items, { name: '', value: '' }]);
    };

    // const handleChange = (index, field, value) => {
    //     const updatedItems = [...items];
    //     updatedItems[index][field] = value;
    //     setItems(updatedItems);
    // };

    const saveItem = (index: number) => {
        const updatedItems = [...items];
        setItems(updatedItems);
    };

    const deleteItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    return (
        <div className="space-y-4">
            <button className='flex items-center gap-1' type="button" onClick={addNewInput}>
                <PlusIcon className="text-black w-4 h-4" /> Add item
            </button>
            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <Input
                        name="name"
                        type="text"
                        placeholder='Input Name'
                    />
                    <Input
                        name="value"
                        type="text"
                        placeholder='Input Value'
                    />
                    <div className='flex items-center justify-center'>
                        <button type="button" onClick={() => saveItem(index)}>
                            <CheckCircleIcon className="text-black w-5 h-5" />
                        </button>

                        <button type="button" onClick={() => deleteItem(index)}>
                            <TrashIcon className="text-black w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DynamicInput;