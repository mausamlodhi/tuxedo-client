"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

interface CoatDetailProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    title: string;
    color: string;
    pant: string;
    slimFit: string;
    ultraSlimFit: string;
    matchingShirt: string;
    matchingVest: string;
    matchingShoe: string;
    matchingTie: string;
    pocketSquare: string;
    studsCufflinks: string;
    image: string;
  };
}

const CoatDetailModal: React.FC<CoatDetailProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-[#2D333C] text-white rounded-lg shadow-2xl p-6 w-[500px] max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-700"
              onClick={onClose}
            >
              <X className="h-5 w-5 text-gray-200" />
            </button>

            {/* Title */}
            <h2 className="text-lg font-semibold mb-4">Coat Detail</h2>

            {/* Image */}
            <div className="flex gap-4">
              <Image
                src={data.image}
                alt={data.title}
                width={120}
                height={160}
                className="rounded-md object-cover"
              />

              <div className="flex-1">
                <p className="text-sm text-gray-300">#{data.id}</p>
                <h3 className="text-xl font-bold">{data.title}</h3>
                <p>
                  <span className="font-semibold">Color: </span>
                  {data.color}
                </p>
                <p>
                  <span className="font-semibold">Pant: </span>
                  {data.pant}
                </p>
              </div>
            </div>

            <hr className="my-4 border-gray-600" />

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-semibold">Slim Fit: </span>
                {data.slimFit}
              </p>
              <p>
                <span className="font-semibold">Ultra Slim Fit: </span>
                {data.ultraSlimFit}
              </p>
              <p>
                <span className="font-semibold">Matching Shirt: </span>
                {data.matchingShirt}
              </p>
              <p>
                <span className="font-semibold">Matching Vest: </span>
                {data.matchingVest}
              </p>
              <p>
                <span className="font-semibold">Matching Shoe: </span>
                {data.matchingShoe}
              </p>
              <p>
                <span className="font-semibold">Matching Tie: </span>
                {data.matchingTie}
              </p>
              <p>
                <span className="font-semibold">Pocket Square: </span>
                {data.pocketSquare}
              </p>
              <p>
                <span className="font-semibold">Studs & Cufflinks: </span>
                {data.studsCufflinks}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-6">
              <button className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">
                Edit
              </button>
              <button className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CoatDetailModal;
