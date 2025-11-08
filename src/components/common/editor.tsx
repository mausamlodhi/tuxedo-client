"use client";

import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  MutableRefObject,
} from "react";
import type Quill from "quill";
import "quill/dist/quill.snow.css";

interface EditorProps {
  readOnly?: boolean;
  defaultValue?: any; // string (HTML) or Delta
  onTextChange?: (...args: any[]) => void;
  onSelectionChange?: (...args: any[]) => void;
  themeMode?: "light" | "dark";
}

const Editor = forwardRef<Quill | null, EditorProps>(
  (
    { readOnly = false, defaultValue, onTextChange, onSelectionChange, themeMode = "light" },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const quillInstance = useRef<Quill | null>(null);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      (async () => {
        if (quillInstance.current) return;

        const { default: Quill } = await import("quill");
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = "";
        const editorContainer = container.appendChild(
          container.ownerDocument.createElement("div")
        );

        const quill = new Quill(editorContainer, {
          theme: "snow",
          readOnly,
        });

        quillInstance.current = quill;

        if (typeof ref === "function") {
          ref(quill);
        } else if (ref) {
          (ref as MutableRefObject<Quill | null>).current = quill;
        }

        // Set default value (string HTML or Delta)
        if (defaultValueRef.current) {
          if (typeof defaultValueRef.current === "string") {
            // Convert HTML to Delta
            const delta = quill.clipboard.convert(defaultValueRef.current);
            quill.setContents(delta, "silent");
          } else {
            quill.setContents(defaultValueRef.current, "silent");
          }
        }

        quill.on("text-change", (...args) => {
          onTextChangeRef.current?.(...args);
        });

        quill.on("selection-change", (...args) => {
          onSelectionChangeRef.current?.(...args);
        });

        // Dynamic colors
        const toolbar = container.querySelector(".ql-toolbar") as HTMLElement;
        const editor = container.querySelector(".ql-container") as HTMLElement;

        if (toolbar && editor) {
          if (!themeMode) {
            toolbar.style.background = "#111827";
            toolbar.style.color = "#FFFFFF";
            toolbar.style.border = "1px solid #374151";
            editor.style.background = "#313A46";
            editor.style.color = "#f9fafb";
            editor.style.border = "1px solid #374151";
            editor.style.borderRadius = "2px 5px 2px 6px";
          } else {
            toolbar.style.background = "#ffffff";
            toolbar.style.color = "#313A46";
            editor.style.background = "#ffffff";
            editor.style.color = "#313A46";
            editor.style.border = "1px solid #d1d5db";
            editor.style.borderRadius = "2px 5px 2px 6px";
          }
        }
      })();

      return () => {
        if (quillInstance.current) {
          quillInstance.current = null;
          if (typeof ref === "function") ref(null);
          else if (ref) (ref as MutableRefObject<Quill | null>).current = null;
        }
        if (containerRef.current) containerRef.current.innerHTML = "";
      };
    }, [ref, readOnly, themeMode]);

    return <div ref={containerRef} />;
  }
);

Editor.displayName = "Editor";

export default Editor;
