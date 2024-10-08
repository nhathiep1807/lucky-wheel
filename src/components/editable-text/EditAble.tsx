import React, { useState, useEffect } from "react";
import { PencilIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { RULES } from "@/constants/common";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnNumberedList,
  BtnStyles,
  BtnUnderline,
  Editor,
  EditorProvider,
  Toolbar,
} from "react-simple-wysiwyg";

type EditAbleProps = {
  initialText: string;
};

const EditableText = ({ initialText }: EditAbleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    localStorage.setItem(RULES, text);
    setText(text);
  };

  const handleChange = (value: string) => {
    setText(value);
  };

  useEffect(() => {
    const rulesFromStorage = localStorage.getItem(RULES);
    setText(rulesFromStorage ?? "");
  }, []);

  return (
    <EditorProvider>
      <div className="flex items-center space-x-2 overflow-y-auto p-4 relative">
        {isEditing ? (
          <div className="flex gap-2 w-full">
            <Editor
              value={text}
              onChange={(e) => handleChange(e.target.value)}
              className="flex-1"
            >
              <Toolbar>
                <BtnBold />
                <BtnItalic />
                <BtnUnderline />
                <BtnNumberedList />
                <BtnBulletList />
                <BtnStyles />
              </Toolbar>
            </Editor>

            <button type="button" onClick={handleSave}>
              <CheckCircleIcon className="text-black w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="max-h-[100px]">
            <div
              dangerouslySetInnerHTML={{ __html: text }}
              className="rsw"
            ></div>
            {/* <pre className="block w-full h-full px-4 py-2 text-sm whitespace-pre-wrap overflow-y-auto">
              {text}
            </pre> */}
            <button
              type="button"
              onClick={handleEdit}
              className="absolute top-5 right-5"
            >
              <PencilIcon className="text-black w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </EditorProvider>
  );
};

export default EditableText;
