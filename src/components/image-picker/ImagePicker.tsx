import React, { useState } from "react";

type Props = {
    handleTakeFileImg: (file: File) => void
}

const ImagePicker = ({ handleTakeFileImg }: Props) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            handleTakeFileImg(file)
            const reader = new FileReader();

            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };

            reader.readAsDataURL(file);
            console.log('selected image', file)
        }
    };

    return (
        <div>
            <label htmlFor="image-input" className="block text-sm font-semibold text-gray-700"> Select an image: </label>
            < input type="file" id="image-input" accept="image/*" onChange={handleImageChange} />
            {selectedImage && (<div className="mt-2">
                <img src={selectedImage} alt="Selected" className="w-40 h-40" />
            </div>)}
        </div>
    );
};

export default ImagePicker;