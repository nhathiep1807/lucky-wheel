import React, { useState, useEffect } from 'react';
import { PencilIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { RULES } from '@/constants/common';

type EditAbleProps = {
    initialText: string
}

const EditableText = ({ initialText }: EditAbleProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(initialText);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        localStorage.setItem(RULES, text);
        setText(text)
    };

    const handleChange = (value: string) => {
        setText(value)
    }

    useEffect(() => {
        const rulesFromStorage = localStorage.getItem(RULES)
        setText(rulesFromStorage ?? '')
    }, [])


    return (
        <div className="flex items-center space-x-2 overflow-y-auto p-4 relative">
            {isEditing ? (
                <div className='flex gap-2 w-full'>
                    <textarea
                        value={text}
                        name="rule"
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="Input your rules"
                        className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
                    />
                    <button type="button" onClick={handleSave}>
                        <CheckCircleIcon className="text-black w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className='max-h-[100px]'>
                    <pre className="block w-full h-full px-4 py-2 text-sm whitespace-pre-wrap overflow-y-auto">
                        {text}
                    </pre>
                    <button type="button" onClick={handleEdit} className='absolute top-5 right-5'>
                        <PencilIcon className="text-black w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditableText;