"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "tui-image-editor/dist/tui-image-editor.css";

// ✅ Dynamically import the editor (no SSR)
const TuiImageEditor = dynamic(
    async () => {
        const mod = await import("@toast-ui/react-image-editor");
        // Forward ref to the actual component
        const Wrapped = React.forwardRef<any, any>((props, ref) => (
            <mod.default {...props} ref={ref} />
        ));
        Wrapped.displayName = "TuiImageEditor";
        return Wrapped;
    },
    { ssr: false }
);

// 🎨 Light Theme
const lightTheme = {
    "common.backgroundColor": "#fff",
    "menu.normalIcon.color": "#666",
    "menu.activeIcon.color": "#000",
    "menu.disabledIcon.color": "#ccc",
    "submenu.backgroundColor": "#f9f9f9",
};

// 🌙 Dark Theme
const darkTheme = {
    "common.backgroundColor": "#1e1e1e",
    "menu.normalIcon.color": "#8a8a8a",
    "menu.activeIcon.color": "#fff",
    "menu.disabledIcon.color": "#555",
    "submenu.backgroundColor": "#2a2a2a",
};

export default function ImageEditor({
    image,
    onSave,
    onClose,
    themeMode,
}: {
    image: string;
    onSave: (file: File) => void;
    onClose: () => void;
    themeMode?: boolean | object;
}) {
    const editorRef = useRef<any>(null);

    const handleSave = () => {
        const editorInstance = editorRef.current?.getInstance();
        if (editorInstance) {
            const dataUrl = editorInstance.toDataURL();
            const arr = dataUrl.split(",");
            const mime = arr[0].match(/:(.*?);/)![1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            const file = new File([u8arr], "edited.png", { type: mime });
            onSave(file);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[10000] bg-black/70 flex items-center justify-center">
            <div className="w-full h-full md:w-4/5 md:h-4/5 relative rounded-lg overflow-hidden">
                {image && (
                    <TuiImageEditor
                        ref={editorRef}
                        includeUI={{
                            loadImage: {
                                path: image,
                                name: "SampleImage",
                                crossOrigin: "anonymous",
                            },
                            theme: themeMode ? lightTheme : darkTheme,
                            menu: [
                                "crop",
                                "flip",
                                "rotate",
                                "draw",
                                "shape",
                                "icon",
                                "text",
                                "mask",
                                "filter",
                            ],
                            initMenu: "crop",
                            uiSize: {
                                width: "100%",
                                height: "100%",
                            },
                            menuBarPosition: "bottom",
                            menuBar: true,
                            locale: {},
                        }}
                        cssMaxHeight={600}
                        cssMaxWidth={800}
                        selectionStyle={{
                            cornerSize: 20,
                            rotatingPointOffset: 70,
                        }}
                        usageStatistics={false}
                        crossOrigin="anonymous"
                    />
                )}

                {/* Custom Save/Cancel */}
                <div className="absolute top-2 right-2 flex gap-2">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-[#D6A680] text-white font-semibold rounded-md shadow-md hover:bg-[#bc8151] hover:scale-105 transition transform duration-200"
                    >
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 hover:scale-105 transition transform duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
