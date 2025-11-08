"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import BuilderListComponent from "./common/builderListComponent";
import logger from "@/utils/logger";
import { CURRENCY } from "@/utils/env";
import { ArrowRight } from "lucide-react";
import DeleteConfirmationModal from "./modal/delete.modal";
import { useState } from "react";

const AddOutfitAndMemberComponent = (props: any) => {
  const {
    outfits,
    duplicateOutfit,
    addOutfit,
    deleteOutfit,
    outfitLayers,
    editOutfit,
    handleNext
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null);
  return (
    <main className="flex-1 px-6 py-6 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 font-advent py-2 h-[45px] w-[150px] bg-[#e7c0a1] text-white font-semibold cursor-pointer"
          >
            Event Detail
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addOutfit}
            className="px-4 font-advent py-2 h-[45px] w-[150px] border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            + Add Outfit
          </motion.button>
        </div>

        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 px-5 py-2 h-[45px] min-w-[160px] bg-[#e7c0a1] text-white cursor-pointer font-advent font-medium hover:bg-[#d1a989] transition-all"
        >
          Next
          <ArrowRight size={18} />
        </motion.button>
      </div>


      {/* <motion.p
        className="text-lg font-advent font-semibold mb-1"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Everyone gets their outfit 2 weeks before the wedding.
      </motion.p>
      <motion.p
        className="text-sm font-advent text-gray-500 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Plenty of time for adjustments if needed.
      </motion.p> */}

      {/* Outfit list */}
      <AnimatePresence>
        {outfits?.length ? <div className="flex flex-col gap-3">
          {outfits.map((outfit: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between border border-gray-200 rounded-lg px-5 py-3 bg-white hover:shadow-md transition-all"
            >
              {/* Left section */}
              <div className="flex items-center gap-4">
                <BuilderListComponent
                  layers={outfitLayers[index] || []}
                  setShowCustomizer={(flag: boolean) => logger("Show customizer", flag)}
                  height={170}
                  width={116}
                  outfitClassName="outfit-list"
                />

                <div>
                  <h3 className="font-semibold text-[16px]">{outfit?.firstName} {outfit?.lastName}</h3>
                  <p className="text-gray-700 text-sm font-medium">
                    {CURRENCY}&nbsp;{outfit?.totalAmount || 'N/A'}
                  </p>

                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Image
                      src="/assets/SVG/icons/groom.svg"
                      alt="Role Icon"
                      width={20}
                      height={20}
                    />
                    &nbsp;{outfit?.owner?.role || 'Groom'}
                  </div>

                  {/* <p className="text-xs text-[#313131] mt-1">Free Home Try-On</p>
                  <p className="text-xs text-[#d26c6c] font-medium cursor-pointer hover:underline">
                    Get Started
                  </p> */}
                </div>
                <div className="flex items-center gap-8 flex-wrap">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer font-advent font-semibold flex gap-1 border-2 border-[#313131] rounded-sm text-[#313131] px-3 py-1 text-sm hover:bg-gray-100"
                    onClick={() => {
                      duplicateOutfit(index);
                    }}
                  >
                    <Image
                      src="/assets/SVG/icons/copyIcon.svg"
                      alt="Copy Icon"
                      width={16}
                      height={16}
                    />
                    Add New Member Same Outfit
                  </motion.button>

                  {/* Email and Phone beside the button */}
                  <div className="text-sm text-gray-600 font-advent flex gap-16">
                    <span>
                      Email: {outfit?.owner?.email || outfit?.email || "N/A"}
                    </span>
                    <span>
                      Phone: {outfit?.owner?.phone || outfit?.phone || "N/A"}
                    </span>
                  </div>
                </div>

              </div>
              {/* Right icons + fabric sample */}
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <Image
                    className="cursor-pointer"
                    src="/assets/SVG/icons/editIcon.svg"
                    alt="Copy Icon"
                    width={28}
                    height={28}
                    onClick={async () => {
                      editOutfit(outfitLayers[index], index);
                    }}
                  />
                  <Image
                    className="cursor-pointer"
                    src="/assets/SVG/icons/delete.svg"
                    alt="Delete Icon"
                    width={28}
                    height={28}
                    onClick={() => {
                      setSelectedOutfitId(outfit?.id);
                      setIsModalOpen(true);
                    }}
                  />

                </div>
              </div>
            </motion.div>
          ))}
        </div> : <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <Image
            src="/assets/SVG/icons/delete.svg"
            alt="No Outfits"
            width={100}
            height={100}
            className="mb-4 opacity-80"
          />
          <h2 className="text-lg font-semibold text-gray-700">No outfits yet!</h2>
          <p className="text-sm text-gray-500 mt-1">
            Start building your first look and customize it your way
          </p>
          <button
            onClick={addOutfit} // your custom function to start
            className="mt-5 bg-[#e7c0a1] text-white px-5 py-2 rounded-md text-sm hover:bg-[#d59e71] transition cursor-pointer"
          >
            Create Outfit
          </button>
        </div>}
        {
          isModalOpen ?
            <DeleteConfirmationModal
              isOpen={isModalOpen}
              isLoading={false}
              theme={true}
              deleteMessage="Are you sure you want to delete this outfit?"
              confirmMessage="Yes, delete"
              onClose={() => setIsModalOpen(false)}
              onConfirm={() => {
                deleteOutfit(selectedOutfitId);
                setIsModalOpen(false);
              }}
            /> : null
        }
      </AnimatePresence>
    </main>
  );
};

export default AddOutfitAndMemberComponent;
