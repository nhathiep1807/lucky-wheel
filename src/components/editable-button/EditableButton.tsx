import React, { useState } from 'react';

type EditableButtonProps = {
    title: string;
    amount: string;
};

function EditableButton({ title, amount }: EditableButtonProps) {
    const [isHold, setIsHold] = useState(false);
    const [content, setContent] = useState({ title, amount });

    const handleMouseDown = () => setIsHold(true);
    const handleMouseUp = () => setIsHold(false);

    const handleDelete = () => {
        console.log(`Deleting ${content.title}`);
        // Thực hiện xử lý xóa nếu cần
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent({
            ...content,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="relative">
            {isHold && (
                <button
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            )}
            <button
                className="border py-2 px-10 rounded-xl w-full flex justify-between"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            >
                {isHold ? (
                    <input
                        name="title"
                        value={content.title}
                        onChange={handleContentChange}
                        className="border-b border-gray-300 focus:outline-none"
                    />
                ) : (
                    <span>{content.title}</span>
                )}
                {isHold ? (
                    <input
                        name="amount"
                        value={content.amount}
                        onChange={handleContentChange}
                        className="border-b border-gray-300 focus:outline-none text-right"
                    />
                ) : (
                    <span>{content.amount}</span>
                )}
            </button>
        </div>
    );
}

export default EditableButton;
