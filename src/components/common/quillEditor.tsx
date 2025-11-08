"use client";

import React, { useRef, useState, useEffect } from "react";
import type Quill from "quill";
import type DeltaStatic from "quill-delta";
import Editor from "./editor"; // <-- your custom wrapper
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { selectAuthData } from "@/app/redux/slice/auth.slice";

const QuillEditor = ({ setValue,value }: any) => {
  const [range, setRange] = useState<any>(null);
  const [lastChange, setLastChange] = useState<DeltaStatic | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const quillRef = useRef<Quill | null>(null);
  const [Delta, setDelta] = useState<any>(null);
  const authData = useSelector(selectAuthData);
  const theme = authData?.admin?.theme;
  
  useEffect(() => {
    (async () => {
      const { default: Quill } = await import("quill");
      const DeltaCtor = Quill.import("delta");
      setDelta(() => DeltaCtor);
    })();
  }, []);

  if (!Delta) return <div>Loading editor...</div>;
  console.log("Rangae : ", range, lastChange);
  // console.log("HTML content:", html);

  return (
    <div>
      <Editor
        ref={quillRef}
        readOnly={readOnly}
        defaultValue={value}
        onSelectionChange={setRange}
        onTextChange={(e) => {
          const html = quillRef.current?.root.innerHTML;
          setLastChange(e)
          setValue("detail",html)
        }}
        themeMode={theme}
      />
    </div>
  );
};

export default QuillEditor;
