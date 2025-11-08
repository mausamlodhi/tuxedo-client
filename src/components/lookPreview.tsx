"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Check } from "lucide-react";
import logger from "@/utils/logger";

interface Item {
  label: string;
  src: string;
  category: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as any,
    },
  },
};

const SelectItemPage = ({
  onBack,
  items,
  layerData,
  onSelectProduct,
}: {
  onBack: () => void,
  items: any[],
  layerData: any,
  onSelectProduct: (item: any) => void
},
) => {

  return (
    <div className="min-h-screen bg-[rgb(216_216_216/_59%)] flex flex-col items-center pt-16 overflow-hidden">
      {/* Title */}
      <motion.h2
        className="text-2xl font-semibold mb-12 border-b border-gray-300 pb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Select an Item
      </motion.h2>

      {/* Items Grid */}
      <motion.div
        className="grid grid-cols-4 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-y-20 gap-x-10 justify-items-center w-full max-w-[1500px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, idx) => {
          const src = layerData?.[item?.id]?.[0]?.src;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -8 }}
              className="flex flex-col items-center text-center"
            >
              <p className="text-sm font-medium mb-2">{item?.name}</p>

              {/* Downward triangle arrow */}
              <div className="mt-3 w-20 h-[2px] bg-[#BB9D7B] rounded-full"></div>
              <div className="w-4 h-2 relative">
                <div className="absolute left-1/2 -translate-x-1/2 w-0 h-10 border-l-8 border-r-8 border-l-transparent border-r-transparent border-t-9 border-t-[#BB9D7B]"></div>
              </div>

              <div className="relative h-[320px] w-[250px] flex items-center justify-center overflow-hidden">
                <Image
                  src={src || item?.image}
                  alt={item?.name}
                  width={300}
                  height={320}
                  onClick={() => {
                    onBack();
                    onSelectProduct(item?.id);
                  }}
                  className={`cursor-pointer object-contain transition-transform duration-300 hover:scale-110 ${src ? item?.lookPreviewClass : ''}`}
                />
              </div>
            </motion.div>
          );
        })}

      </motion.div>

      {/* Bottom Navigation */}
      <motion.div
        className="fixed bottom-10 flex items-center justify-center gap-0 bg-transparent"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        onClick={onBack}
      >
        <div className="flex shadow-xl rounded-md overflow-hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-white h-16 w-16 flex items-center justify-center border-r border-gray-300 hover:bg-gray-100"
          >
            <ChevronLeft size={22} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer bg-[#BB9D7B] text-white h-16 px-44 flex items-center justify-center hover:bg-[#cba273]"
          >
            <Check size={20} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectItemPage;
