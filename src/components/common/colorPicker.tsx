"use client";

import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker, RgbaColorPicker } from "react-colorful";

type ColorPickerProps = {
  value?: string; // "#rrggbb" or "rgba(r,g,b,a)"
  onChange: (val: string) => void;
  withAlpha?: boolean; // true => rgba picker, false => hex picker
  disablePopover?: boolean; // if true, render inline
  label?: string;
  presets?: string[]; // optional color swatches
};

export default function ColorPicker({
  value = "#ffffff",
  onChange,
  withAlpha = false,
  disablePopover = false,
  label,
  presets = [],
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disablePopover) return;
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [disablePopover]);

  function parseRgbaString(rgba: string): { r: number; g: number; b: number; a: number } {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d\.]+)?\)/);
    if (match) {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: match[4] !== undefined ? parseFloat(match[4]) : 1,
      };
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  }

  const renderPicker = () =>
    withAlpha ? (
      <RgbaColorPicker
        color={parseRgbaString(value)}
        onChange={(c) => onChange(`rgba(${c.r},${c.g},${c.b},${c.a})`)}
      />
    ) : (
      <HexColorPicker color={value} onChange={onChange} />
    );

  return (
    <div className="relative inline-grid" ref={containerRef}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}

      {/* Trigger */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => (disablePopover ? null : setOpen((s) => !s))}
          className="flex items-center gap-2 px-2 py-1 border rounded"
          aria-haspopup={!disablePopover ? "dialog" : undefined}
        >
          <div
            style={{ background: value }}
            className="w-6 h-6 rounded-sm border"
            aria-hidden
          />
          <span className="text-xs">{value}</span>
        </button>

        {/* Inline mode: always show picker */}
        {disablePopover && (
          <div className="ml-3">
            <div className="p-1 bg-white rounded shadow-sm">{renderPicker()}</div>
          </div>
        )}
      </div>

      {/* Popover */}
      {!disablePopover && open && (
        <div className="absolute z-50 mt-2" style={{ left: 70, bottom:2 }}>
          <div className="rounded p-3 shadow-lg">
            <div className="mb-3">{renderPicker()}</div>

            {presets.length > 0 && (
              <div className=" bg-gray-200 flex gap-2 flex-wrap mb-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onChange(p)}
                    className="w-8 h-8 rounded-sm border"
                    style={{ background: p }}
                    aria-label={`preset ${p}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
