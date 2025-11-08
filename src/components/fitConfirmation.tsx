"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface FitData {
  height: string;
  weight: string;
  bodyType: string;
  chestOverArms: string;
  chest: string;
  trouserWaist: string;
  trouserLength: string;
  shirtNeckSize: string;
  shirtSleeveLength: string;
  shoeSize: string;
}

interface FitConfirmationProps {
  fitData: FitData;
  onConfirm?: (confirmed: boolean) => void;
  handlePrevious: () => void;
  handleNext: () => void;
}

const FitConfirmation: React.FC<FitConfirmationProps> = ({
  fitData: initialFitData,
  handlePrevious,
  handleNext,
}) => {
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [fitData, setFitData] = useState(initialFitData);

  return (
    <>
        <div className="flex justify-center py-10 bg-white text-gray-800">
          <motion.div
            className="border border-gray-300 p-8 w-full max-w-4xl rounded-md shadow-sm bg-gray-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Title */}
            <motion.h2
              className="text-2xl font-advent font-medium mb-2 text-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Confirm Your Fit.
            </motion.h2>

            <motion.p
              className="text-sm text-gray-600 mb-6 font-advent text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Looks like you’ve entered your fit details before. Are these sizes
              still accurate?
            </motion.p>

            <div className="h-px bg-gradient-to-r from-cyan-400 to-transparent mb-6"></div>

            {/* Measurements */}
            <motion.div
              className="mb-6 font-advent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-medium mb-4">Measurements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-gray-100 rounded px-4 py-3">
                  <span className="font-medium">Height:</span> {fitData.height}
                </div>
                <div className="bg-gray-100 rounded px-4 py-3">
                  <span className="font-semibold">Weight:</span>{" "}
                  {fitData.weight}
                </div>
                <div className="bg-gray-100 rounded px-4 py-3">
                  <span className="font-semibold">Body Type:</span>{" "}
                  {fitData.bodyType}
                </div>
                <div className="bg-gray-100 rounded px-4 py-3">
                  <span className="font-semibold">Chest over arms:</span>{" "}
                  {fitData.chestOverArms}
                </div>
                <div className="bg-gray-100 rounded px-4 py-3">
                  <span className="font-semibold">Chest:</span> {fitData.chest}
                </div>
                <div className="bg-gray-100 rounded px-4 py-3">
                  <span className="font-semibold">Trouser waist:</span>{" "}
                  {fitData.trouserWaist}
                </div>
                <div className="bg-gray-100 rounded px-4 py-3">
                  <span className="font-semibold">Trouser length:</span>{" "}
                  {fitData.trouserLength}
                </div>
                <div className="bg-gray-100 rounded px-4 py-3">
                  <span className="font-semibold">Shirt neck size:</span>{" "}
                  {fitData.shirtNeckSize}
                </div>
                <div className="bg-gray-100 rounded px-4 py-3">
                  <span className="font-semibold">Shirt sleeve length:</span>{" "}
                  {fitData.shirtSleeveLength}
                </div>
                <div className="bg-gray-100 rounded px-4 py-3 md:col-span-3">
                  <span className="font-semibold">Shoe Size:</span>{" "}
                  {fitData.shoeSize}
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 font-advent mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                onClick={() => handleNext()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-3 bg-[#d4a574] text-white rounded cursor-pointer font-semibold hover:bg-[#c09463] transition-all"
              >
                Yes
              </motion.button>
              <motion.button
                onClick={() => handlePrevious()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-3 bg-white border border-gray-500 cursor-pointer text-gray-800 rounded font-semibold hover:bg-gray-50 transition-all"
              >
                No
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
    </>
  );
};

export default FitConfirmation;
