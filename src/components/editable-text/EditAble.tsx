import React, { useState } from 'react';
import { Input } from '../input';
import { PencilIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

type EditAbleProps = {
    initialText: string
}

const EditableText = ({ initialText }: EditAbleProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(`How to redeem points

    1. Accumulate Points: Each spin gives you a chance 
    to land on a point segment or a gift segment.
    
    2. Gift Segments: Land on a gift segment to instantly 
    win the displayed prize!
    
    3. Point Segments: Earn points from spins, which are 
    stored in your account.
    
    4. Redeem Gifts: Once you’ve collected enough points, 
    you can exchange them for special gifts.
    
    5. Check Your Points: Your total points are displayed 
    beneath the wheel. Keep spinning to unlock bigger 
    rewards!`);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        setText('abc')
    };

    return (
        <div className="flex items-center space-x-2 max-h-full overflow-y-auto p-4">
            {isEditing ? (
                <form>
                    <Input
                        value={initialText}
                        name="rule"
                        type="text"
                        placeholder="Input your rules"
                    />
                    <button type="button" onClick={handleSave}>
                        <CheckCircleIcon className="text-black w-5 h-5" />
                    </button>
                </form>
            ) : (
                <>
                    <span>{text}</span>
                    <button type="button" onClick={handleEdit}>
                        <PencilIcon className="text-black w-5 h-5" />
                    </button>
                </>
            )}
        </div>
    );
};

export default EditableText;