import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageModalProps {
  images: string[];
  alt?: string;
  onClose: () => void;
  theme: boolean | object;
  initialIndex?: number;
}

const ImageModal = ({
  images,
  alt = "image",
  onClose,
  theme,
  initialIndex = 0
}: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <AnimatePresence>
      {images.length > 0 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative rounded-2xl shadow-2xl p-4 max-w-[90vw] max-h-[90vh] ${theme ? "bg-white" : "bg-[#2D333C]"
              }`}
          >
            {/* Close button */}
            <button
              className="absolute cursor-pointer top-2 right-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={onClose}
            >
              <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Prev button */}
            {images.length > 1 && (
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60"
                onClick={handlePrev}
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
            )}

            {/* Image */}
            <Image
              src={images[currentIndex]}
              alt={alt}
              width={800}
              height={600}
              className="object-contain max-h-[80vh] max-w-full rounded-lg"
            />

            {/* Next button */}
            {images.length > 1 && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-gray-200">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;