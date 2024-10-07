import { XCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

type Props = {
  defaultImage?: string;
  handleTakeFileImg: (file: File) => void;
  onImageChange?: (imageUrl: string | null) => void;
};

const ImagePicker = ({ defaultImage, handleTakeFileImg, onImageChange }: Props) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    defaultImage || ""
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      handleTakeFileImg(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };


  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    onImageChange?.(selectedImage);
  }, [selectedImage, onImageChange]);

  return (
    <div>
      <label
        htmlFor="image-input"
        className="block text-sm font-semibold text-gray-700"
      >
        {" "}
        Select an image:{" "}
      </label>
      <input
        type="file"
        id="image-input"
        accept="image/*"
        onChange={handleImageChange}
      />
      {selectedImage && (
        <div className="mt-2 relative w-fit">
          <img src={selectedImage} alt="Selected" className="w-40 h-40" />
          <XCircleIcon
            className="absolute top-0 right-0 w-6 h-6 cursor-pointer"
            onClick={handleRemoveImage}
          />
        </div>
      )}
      <div className="text-xs text-gray-400">
        * The name will not be displayed if there is an image
      </div>
    </div>
  );
};

export default ImagePicker;
