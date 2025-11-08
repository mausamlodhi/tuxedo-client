"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Select } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import OrderSuccessModal from "./modal/order.modal";
import { locations } from "@/utils/constant";

interface CheckoutSectionProps {
  handlePrevious: () => void;
  isOrderPlaced: boolean;
  setIsOrderPlaced: (flag: any) => void;
  onSubmit: (data: any) => void
  orderId: string;
  selectedStore?: string;
  setSelectedStore?: (str: string) => void;
}

const CheckoutSection: React.FC<CheckoutSectionProps> = ({
  handlePrevious,
  isOrderPlaced,
  setIsOrderPlaced,
  onSubmit,
  orderId,
  selectedStore,
  setSelectedStore
}) => {

  const validationSchema = Yup.object({
    store: Yup.string().required("Please select a store."),
  });

  const formatPhone = (value: string) => {
    let input = value.replace(/\D/g, "");
    if (input.length > 10) input = input.slice(0, 10);
    if (input.length > 6) {
      return `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6)}`;
    } else if (input.length > 3) {
      return `(${input.slice(0, 3)}) ${input.slice(3)}`;
    } else if (input.length > 0) {
      return `(${input}`;
    }
    return "";
  };

  return (
    <>
      {/* Top Buttons */}
      <div className="flex items-center justify-end gap-4 mt-10 px-6">
        <motion.button
          onClick={handlePrevious}
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 px-5 py-2 h-[45px] min-w-[160px] bg-[#e7c0a1] text-white cursor-pointer font-advent font-medium hover:bg-[#d1a989] transition-all"
        >
          <ArrowLeft size={18} />
          Previous
        </motion.button>
      </div>

      {/* Main Checkout Section */}
      <div className="flex justify-center items-center py-16 bg-white text-gray-800">
        <motion.div
          className="border border-gray-300 bg-gray-50 rounded-md p-8 w-full max-w-md shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-lg font-semibold mb-2">You can checkout for:</h2>
          <Formik
            initialValues={{
              store: selectedStore || "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onSubmit(values)
            }}
          >
            {() => {
              const selectedLocation = locations.find(
                (loc) => loc.name === selectedStore
              );

              return (
                <Form>
                  <Select
                    showSearch
                    placeholder="Select store..."
                    value={selectedStore || undefined}
                    onChange={(value) => setSelectedStore(value)}
                    options={locations.map((loc) => ({
                      value: loc.name,
                      label: loc.name,
                    }))}
                    style={{
                      width: "100%",
                      backgroundColor: "#f3f4f6",
                      borderRadius: "6px",
                    }}
                    className="font-advent w-full text-sm text-gray-700 mb-1 cursor-pointer"
                  />
                  <ErrorMessage
                    name="store"
                    component="p"
                    className="text-red-500 text-xs mb-3"
                  />

                  <hr className="border-gray-300 my-5" />


                  {selectedLocation && (
                    <div className="bg-white border border-gray-200 rounded-md p-4 mb-5 text-sm text-gray-700 shadow-sm font-advent">
                      <p>
                        <strong>Address:</strong> {selectedLocation.address}
                      </p>
                      <p>
                        <strong>City:</strong> {selectedLocation.city}
                      </p>
                      <p>
                        <strong>State:</strong> {selectedLocation.state}
                      </p>
                      <p>
                        <strong>ZIP:</strong> {selectedLocation.zip}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedLocation.phone}
                      </p>
                      <p className="mt-2 text-gray-600 text-xs italic">
                        {selectedLocation.description}
                      </p>
                    </div>
                  )}

                  <hr className="border-gray-300 my-5" />

                  {/* Checkout Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-full py-2.5 text-white text-sm font-medium bg-gray-800 cursor-pointer hover:bg-gray-900"
                  >
                    Proceed to Checkout
                  </motion.button>
                </Form>
              );
            }}
          </Formik>

        </motion.div>
      </div>
      <OrderSuccessModal
        open={isOrderPlaced}
        orderId={orderId}
        onClose={() => {
          setIsOrderPlaced(false)
        }}
      />
    </>
  );
};

export default CheckoutSection;
