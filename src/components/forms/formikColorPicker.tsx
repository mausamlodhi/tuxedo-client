'use client';
import React from "react";
import { useFormikContext } from "formik";
import ColorPicker from "../common/colorPicker";

type FormikColorPickerProps = {
  name: string;
  label?: string;
  withAlpha?: boolean;
  presets?: string[];
};

export const FormikColorPicker: React.FC<FormikColorPickerProps> = ({
  name,
  label,
  withAlpha = false,
  presets = [],
}) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const value = values?.[name] ?? (withAlpha ? "rgba(0,0,0,1)" : "#000000");

  return (
    <ColorPicker
      value={value}
      label={label}
      withAlpha={withAlpha}
      presets={presets}
      onChange={(val) => setFieldValue(name, val)}
    />
  );
};
