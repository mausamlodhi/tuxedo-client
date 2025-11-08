"use client";

import React from "react";
import { motion } from "framer-motion";
import logger from "@/utils/logger";

interface Layer {
  src: string;
  alt?: string;
  z: number;
  className?: string;
}

interface BuilderProps {
  layers: Layer[];
  setShowCustomizer: (flag: boolean) => void;
  width?: string | number;
  height?: string | number;
  className?: string;
  outfitClassName?: string;
}

const BuilderListComponent: React.FC<BuilderProps> = ({
  layers,
  setShowCustomizer,
  width = "50%",
  height = "100%",
  className = "",
  outfitClassName
}) => {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      <motion.div
        className="relative"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08 },
          },
        }}
        onClick={() => setShowCustomizer(true)}
      >
        {layers
          ?.sort((a, b) => a.z - b.z)
          ?.map((layer, idx) => (
            <motion.img
              key={idx}
              src={layer?.src}
              alt={layer?.alt || `layer-${idx}`}
              className={`layer absolute inset-0 w-full h-full object-contain list-${layer?.className || ""}${outfitClassName ? `${outfitClassName}` : ""}`}
              style={{ zIndex: layer?.z }}
              variants={{
                hidden: { opacity: 0, y: 10, scale: 0.98 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.95, ease: "easeOut" },
                },
              }}
            />
          ))}
      </motion.div>
    </div>
  );
};

export default BuilderListComponent;
