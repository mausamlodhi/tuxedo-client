"use client";

import React from "react";
import { motion } from "framer-motion";

const Builder = ({ layers,setShowCustomizer }: { layers: any[],setShowCustomizer:(flag:boolean) => void }) => {
  return (
    <div className="builder-wrapper overflow-hidden">
      <motion.div
        className="LookPreview cursor-pointer"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08, // slight stagger for elegance
            },
          },
        }}
        onClick={() => setShowCustomizer(true)}
      >
        {layers
          ?.sort((a, b) => a.z - b.z)
          .map((layer, idx) => (
            <motion.img
              key={idx}
              src={layer?.src}
              alt={layer?.alt}
              className={`layer absolute ${layer?.className}`}
              style={{ zIndex: layer?.z }}
              variants={{
                hidden: { opacity: 0, y: 10, scale: 0.98 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.95,
                    ease: "easeOut",
                  },
                },
              }}
            />
          ))}
      </motion.div>
    </div>
  );
};

export default Builder;
