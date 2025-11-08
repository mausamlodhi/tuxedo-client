"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { updateLayers } from "@/hooks/useLayers";
import { updateLayerInCategory } from "@/app/redux/slice/look-builder.slice";
import { useDispatch, useSelector } from "react-redux";
import { areLayersEqual } from "@/utils";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

type ProductDrawerProps = {
  isOpen: boolean;
  priceType: string;
  onClose: () => void;
  category: string;
  products: any;
  selectedCategory?: string;
  selectedProduct: Product | null;
  onProductSelect: (product: Product | null) => void;
};

const ProductDrawer: React.FC<ProductDrawerProps> = ({
  isOpen,
  onClose,
  category,
  products,
  selectedCategory,
  priceType
}) => {
  const dispatch = useDispatch();
  const layers = useSelector((state: any) => state.lookBuilder.present);
  const selectedLayer = layers[selectedCategory] || [];
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleProductSelect = async (product: any) => {
    const layer = await updateLayers(selectedCategory, {
      details: product?.collections?.details,
      id: product?.id,
      rental_price: product?.rental_price,
      buy_price: product?.buy_price,
      title: product?.style,
      tie_type: product?.tie_type || "",
      description: product?.description
    });
    const isSame = areLayersEqual(selectedLayer, layer);
    const updatedLayers = { ...layers, [selectedCategory]: isSame ? undefined : layer };
    dispatch(updateLayerInCategory({ category: selectedCategory, layer: updatedLayers }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            className=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => {
              setSelectedLayerIndex(0);
              onClose();
            }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl flex flex-col 
              sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-2xl
              max-sm:right-0 max-sm:bottom-0 max-sm:top-auto max-sm:h-[85vh] max-sm:w-full max-sm:max-w-none max-sm:rounded-t-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-gray-50">
              <h2 className="text-lg sm:text-xl font-semibold font-marcellus">
                {category}
              </h2>
              <button
                onClick={() => {
                  setSelectedLayerIndex(0);
                  onClose();
                }}
                className="flex items-center gap-1 p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">CLOSE</span>
              </button>
            </div>

            {/* Filters placeholder */}
            <div className="p-3 sm:p-4 border-b bg-gray-50">
              <h3 className="text-xs sm:text-sm font-semibold text-black mb-2 font-advent">
                FILTERS
              </h3>
              <div className="flex flex-wrap gap-2">{/* Future filters */}</div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              {products && products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
                  {products.map((product, idx) => {
                    const isSelected = selectedLayer?.[0]?.id === product.id;
                    const isLayerSelected = selectedLayerIndex === product.id;
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                        className={`relative cursor-pointer border overflow-hidden hover:border-[#D6A680] hover:shadow-md ${isSelected
                          ? "border-[#D6A680] ring-2 ring-[#D6A680]"
                          : "border-gray-200"
                          }`}
                        onClick={() => {
                          setSelectedLayerIndex(product.id);
                          handleProductSelect(product);
                        }}
                      >
                        <div className="aspect-square bg-white relative">
                          <Image
                            src={product?.images?.[0]}
                            alt={product.style}
                            fill
                            className="object-cover"
                          />

                          {(isLayerSelected && isSelected) && (
                            <div className="absolute inset-0 flex flex-col items-center justify-end  z-10 gap-3">
                              {/* Confirm Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLayerIndex(0);
                                  onClose();
                                }}
                                className="bg-[#D6A680] hover:bg-[#b98964] text-white px-4 py-2 rounded font-advent text-sm tracking-wide transition-colors"
                              >
                                CONFIRM
                              </button>

                              {/* Cancel Button (X) */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProductSelect(product);
                                }}
                                className="absolute top-2 right-2 bg-[#D6A680] text-white p-1 rounded hover:bg-[#b98964] transition-colors"
                              >
                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="p-1 sm:p-2 bg-white">
                          <h2 className="text-sm sm:text-base text-gray-800 mb-1 font-advent line-clamp-1">
                            {product?.description}
                          </h2>
                          {/* <p className="text-xs text-gray-600 font-advent">
                            {priceType === "rental_price"
                               ? `Rent : $${product.rental_price || 0}`
                             : `Buy : $${product.buy_price || 0}`}
                            Rent ${product.rental_price}
                          </p> */}

                          <p className="text-xs text-gray-600 font-advent">
                            {["PocketSquare", "Suspenders", "Socks"].includes(selectedCategory)
                              ? `Buy : $${product?.buy_price || 0}`
                              : priceType === "rental_price"
                                ? `Rent : $${product?.rental_price || 0}`
                                : `Buy : $${product?.buy_price || 0}`}
                          </p>

                        </div>
                      </motion.div>

                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 font-advent text-base sm:text-lg">
                  No record found
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductDrawer;
