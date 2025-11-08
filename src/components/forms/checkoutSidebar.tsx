"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { Select } from "antd";
import * as Yup from "yup";
import OrderSuccessModal from "../modal/order.modal";
import { locations } from "@/utils/constant";

interface CheckoutInterface {
    isOpen: boolean;
    selectedStore: string;
    setSelectedStore: (str: string) => void;
    setIsOrderPlaced: (flag: boolean) => void;
    onSubmit: (data: any) => void;
    isOrderPlaced: boolean;
    onClose?: () => void;
    setIsOpen: (flag: boolean) => void;
    orderId: string;
    isLoading: boolean;
}

const CheckoutSidebarComponent: React.FC<CheckoutInterface> = ({
    isOpen,
    selectedStore,
    setSelectedStore,
    onSubmit,
    setIsOrderPlaced,
    isOrderPlaced,
    onClose,
    setIsOpen,
    orderId,
    isLoading
}) => {
    const validationSchema = Yup.object({
        store: Yup.string().required("Please select a store."),
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="checkout-sidebar"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 80, damping: 20 }}
                    className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-xl z-50 flex flex-col"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold font-advent text-gray-800">
                            Checkout
                        </h2>
                        <motion.button
                            onClick={() => setIsOpen(false)}
                            whileHover={{ rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 rounded-full hover:bg-gray-100 transition"
                        >
                            <X size={20} className="text-gray-600" />
                        </motion.button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex justify-center items-start py-10 px-6 bg-white text-gray-800">
                            <motion.div
                                className="w-full max-w-md"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <h3 className="text-base font-medium mb-2">
                                    You can checkout for:
                                </h3>

                                {/* ✅ Formik Form */}
                                <Formik
                                    enableReinitialize
                                    initialValues={{
                                        store: selectedStore || "",
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={(values) => {
                                        onSubmit(values);
                                    }}
                                >
                                    {({ values, handleChange, handleSubmit }) => {
                                        const selectedLocation = locations.find(
                                            (loc) => loc.name === values.store
                                        );

                                        return (
                                            <Form onSubmit={handleSubmit}>
                                                <Select
                                                    showSearch
                                                    placeholder="Select store..."
                                                    value={values.store || undefined}
                                                    onChange={(value) => {
                                                        setSelectedStore(value);
                                                        handleChange({ target: { name: "store", value } });
                                                    }}
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

                                                {selectedLocation && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="bg-white border border-gray-200 rounded-md p-4 mb-5 text-sm text-gray-700 shadow-sm font-advent"
                                                    >
                                                        <p>
                                                            <strong>Address:</strong>{" "}
                                                            {selectedLocation.address}
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
                                                        {selectedLocation.description && (
                                                            <p className="mt-2 text-gray-600 text-xs italic">
                                                                {selectedLocation.description}
                                                            </p>
                                                        )}
                                                    </motion.div>
                                                )}

                                                <hr className="border-gray-300 my-5" />

                                                {/* Checkout Button */}
                                                <motion.button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    whileHover={!isLoading ? { scale: 1.03 } : {}}
                                                    whileTap={!isLoading ? { scale: 0.97 } : {}}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                    className={`w-full py-2.5 text-white text-sm font-medium rounded-md flex items-center justify-center gap-2
          ${isLoading ? "bg-gray-600 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-900"}
        `}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        "Proceed to Checkout"
                                                    )}
                                                </motion.button>
                                            </Form>
                                        );
                                    }}
                                </Formik>
                            </motion.div>
                        </div>
                    </div>

                    <OrderSuccessModal
                        open={isOrderPlaced}
                        orderId={orderId}
                        onClose={() => setIsOrderPlaced(false)}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CheckoutSidebarComponent;
