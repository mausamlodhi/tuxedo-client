"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Trash2, Upload, GripVertical, Edit2 } from "lucide-react";
import { ErrorMessage } from "formik";
import React, { useEffect, useRef, useState } from "react";
import ImageEditor from "./editImage.modal";
import logger from "@/utils/logger";

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

interface Props {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  errors: any;
  touched: any;
  theme?: boolean | object;
  handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    setFieldValue: any,
    values: any
  ) => void;
  removeImage: (index: number, setFieldValue: any, values: any) => void;
  dragActive: boolean;
  handleFileSelect: (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
    values: any
  ) => void;
}

export default function ImageUpload({
  values,
  setFieldValue,
  errors,
  touched,
  theme,
  removeImage,
  handleDrag,
  handleDrop,
  dragActive,
  handleFileSelect,
}: Props) {
  const objectUrlsRef = useRef<string[]>([]);
  const [editor, setEditor] = useState<{ open: boolean; image: string; index: number }>({
    open: false,
    image: "",
    index: -1,
  });
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = reorder(
      values.images,
      result.source.index,
      result.destination.index
    );

    // 🔑 Force Formik to update
    setFieldValue("images", [...reordered]);
  };

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  const handleRemove = (index: number) => {
    const img = values.images[index];
    if (img instanceof File) {
      const url = objectUrlsRef.current.find((u) => u.includes(img.name));
      if (url) {
        URL.revokeObjectURL(url);
        objectUrlsRef.current = objectUrlsRef.current.filter((u) => u !== url);
      }
    }
    removeImage(index, setFieldValue, values);
  };

  useEffect(() => {
    return () => {
      const lastChild = document.body.lastElementChild;
      if (lastChild && lastChild.tagName.toLowerCase() === "svg") {
        lastChild.remove();
      }
    };
  }, []);

  return (
    <div>
      <label
        className={`block text-sm font-medium mb-2 ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
          }`}
      >
        Images
      </label>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
          ? "border-blue-500 bg-blue-500 bg-opacity-10"
          : errors.images && touched.images
            ? "border-red-500 bg-red-500 bg-opacity-5"
            : "border-slate-600 hover:border-slate-500"
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={(e) => handleDrop(e, setFieldValue, values)}
      >
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-gray-300 mb-2">
          Drop your images here or{" "}
          <label className="text-blue-400 cursor-pointer hover:text-blue-300">
            click to browse
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, setFieldValue, values)}
            />
          </label>
        </p>
        <p className="text-xs text-gray-400">
          You can upload multiple images and then drag to rearrange them.
        </p>
      </div>

      {values.images && values.images.length > 0 && (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="droppable-images" direction="horizontal">
            {(provided) => (
              <div
                className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {values.images.map((fileOrUrl: File | string, index: number) => {
                  let preview: string;

                  if (typeof fileOrUrl === "string") {
                    preview = fileOrUrl;
                  } else {
                    preview = URL.createObjectURL(fileOrUrl);
                    if (!objectUrlsRef.current.includes(preview)) {
                      objectUrlsRef.current.push(preview);
                    }
                  }

                  return (
                    <Draggable
                      key={`image-${index}-${typeof fileOrUrl === "string" ? fileOrUrl : fileOrUrl.name}`}
                      draggableId={`image-${index}-${typeof fileOrUrl === "string" ? fileOrUrl : fileOrUrl.name}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={provided.draggableProps.style}
                          className="relative bg-[#313A46] rounded-lg p-2"
                        >
                          {/* Drag handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="absolute top-1 left-1 text-gray-400 hover:text-gray-200 cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical size={30} />
                          </div>

                          <div className="aspect-square bg-slate-600 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                            <img
                              src={preview}
                              alt={`preview-${index}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <p className="text-xs text-gray-300 truncate">
                            {typeof fileOrUrl === "string"
                              ? "Uploaded Image"
                              : fileOrUrl.name}
                          </p>

                          <div className="absolute top-1 right-1 flex gap-1">
                            <button
                              type="button"
                              onClick={() => setEditor({ open: true, image: preview, index })}
                              className="bg-[#D6A680] hover:bg-[#c18758] text-white rounded-full p-1 transition transform hover:scale-110"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemove(index)}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition transform hover:scale-110"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <ErrorMessage
        name="images"
        component="div"
        className="text-red-400 text-sm mt-1"
      />
      {editor.open && (
        <ImageEditor
          image={editor.image}
          onSave={(file) => {
            const newImages = [...values.images];
            newImages[editor.index] = file;
            setFieldValue("images", newImages);
          }}
          themeMode={theme}
          onClose={() => setEditor({ open: false, image: "", index: -1 })}
        />
      )}
    </div>
  );
}
