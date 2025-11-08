"use client";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import BodyMeasurementsForm from "./bodyMeasurementsForm";
import FitConfirmation from "../fitConfirmation";
import { EventParticipantInterface } from "@/app/event-details/page";
import { selectEventData } from "@/app/redux/slice/auth.slice";
import { locations } from "@/utils/constant";
import modalNotification from "@/utils/notification";

interface MeasurementInterface {
  participants?: EventParticipantInterface[];
  setSelectedTab?: (str: string) => void;
  setShowMeasurementForm?: (flag: boolean) => void;
  handleSaveMeasurements?: (data: any) => void;
  measurementType?: string;
  setMeasurementType?: (str: string) => void;
  measurementData?: any;
  submitMeasurement?: () => void;
  showButtons?: boolean;
  selectedDate?:string;
  setSelectedDate?: (str:string)=>void;
  selectedStore?:string;
  setSelectedStore?: (str:string)=>void;
}

const MeasurementComponent = ({
  participants,
  setSelectedTab,
  handleSaveMeasurements,
  measurementType,
  setMeasurementType,
  measurementData,
  submitMeasurement,
  showButtons,
  selectedDate,
  setSelectedDate,
  selectedStore,
  setSelectedStore
}: MeasurementInterface) => {
  const eventData = useSelector(selectEventData);
  const router = useRouter();

  const [confirmFit, setConfirmFit] = useState(false);
  const [errors, setErrors] = useState<{ store?: string; date?: string }>({});
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  useEffect(() => {
    setMeasurementType?.("");
  }, [setMeasurementType]);

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};
    if (!selectedStore) newErrors.store = "Please select a store.";
    if (!selectedDate) newErrors.date = "Please select an appointment date.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    submitMeasurement()
  };

  const handleStoreChange = (value: string) => {
    setSelectedStore(value);
    const location = locations.find((loc) => loc.name === value);
    setSelectedLocation(location || null);
  };

  const HeaderButtons = () => (
    <div className="flex items-center justify-between mt-2 px-6">
      <div className="min-w-[160px]" />
      {!measurementType && (
        <motion.h2
          className="text-2xl font-bold font-advent text-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          How would you like to share your measurements for{" "}
          {eventData?.eventName || "the outfit"}?
        </motion.h2>
      )}

      {!showButtons && (
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTab?.("sendInvite")}
            className="flex items-center justify-center gap-2 px-5 py-2 h-[45px] min-w-[160px] border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer font-advent font-medium transition-all"
          >
            <ArrowLeft size={18} />
            Previous
          </motion.button>

          <motion.button
            disabled={!measurementType}
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!measurementType) {
                modalNotification({
                  type: "error",
                  message:
                    "Select one of the following options to submit your measurements",
                });
              }
            }}
            className="flex items-center justify-center gap-2 px-5 py-2 h-[45px] min-w-[160px] bg-[#e7c0a1] disabled:bg-[#e0cbba] disabled:cursor-not-allowed text-white cursor-pointer font-advent font-medium hover:bg-[#d1a989] transition-all"
          >
            Next
            <ArrowRight size={18} />
          </motion.button>
        </div>
      )}
    </div>
  );

  // -------------------------------
  // 📋 Measurement Option Selector
  // -------------------------------
  const MeasurementTypeSelector = () => (
    <div className="flex-1 p-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="max-w-2xl mx-auto space-y-3">
          {["in-store", "online"].map((type) => (
            <motion.label
              key={type}
              whileHover={{ x: 5 }}
              className="flex items-center justify-between cursor-pointer py-3 rounded-md px-4 hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="measurementType"
                  value={type}
                  checked={measurementType === type}
                  onChange={(e) => setMeasurementType?.(e.target.value)}
                  className="w-5 h-5 accent-[#e7c0a1] cursor-pointer"
                />
                <h3 className="text-lg font-semibold text-gray-800 font-advent">
                  {type === "in-store"
                    ? "Visit a Store for Measurements"
                    : "Enter Measurements Online"}
                </h3>
              </div>
            </motion.label>
          ))}
        </div>
      </div>
    </div>
  );

  // -------------------------------
  // 🏬 In-Store Booking Form
  // -------------------------------
  const InStoreBookingForm = () => (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="w-full max-w-lg bg-white rounded-xl shadow-md p-8 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold font-advent mb-4 text-center">
          Select Store & Appointment Date
        </h2>

        <p className="text-gray-600 text-sm text-center mb-6 font-advent">
          Book an in-store appointment to get your measurements done professionally.
        </p>

        <form onSubmit={handleStoreSubmit} className="w-full flex flex-col gap-4">
          {/* Store Selection */}
          <div className="flex flex-col">
            <label className="block text-gray-700 font-medium mb-1 text-sm font-advent">
              Select Store
            </label>
            <Select
              showSearch
              placeholder="Select store..."
              value={selectedStore || undefined}
              onChange={handleStoreChange}
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
            {errors.store && (
              <p className="text-red-500 text-xs mt-1 font-advent">{errors.store}</p>
            )}

            {selectedLocation && (
              <div className="bg-white border border-gray-200 rounded-md p-4 mt-4 text-sm text-gray-700 shadow-sm font-advent">
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
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div className="flex flex-col">
            <label className="block text-gray-700 font-medium mb-1 text-sm font-advent">
              Select Appointment Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`w-full px-3 py-2 border rounded text-sm font-advent focus:outline-none focus:ring-2 transition ${
                errors.date
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-[#d4a077]"
              }`}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1 font-advent">{errors.date}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mt-4 font-advent">
            <motion.button
              type="button"
              onClick={() => setMeasurementType?.("")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 w-[200px] h-[45px] text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 w-[200px] h-[45px] text-sm bg-[#d4a077] text-white hover:bg-[#c28150] transition cursor-pointer"
            >
              Book Appointment
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );

  // -------------------------------
  // 🔁 Conditional Render
  // -------------------------------
  return (
    <>
      <HeaderButtons />

      {!measurementType && <MeasurementTypeSelector />}

      {measurementType === "online" && !confirmFit && (
        <BodyMeasurementsForm
          onClose={() => {
            setMeasurementType?.("");
            setConfirmFit(false);
          }}
          handleNext={(data) => {
            setConfirmFit(true);
            handleSaveMeasurements?.(data);
          }}
          data={measurementData}
        />
      )}

      {measurementType === "in-store" && !confirmFit && <InStoreBookingForm />}

      {confirmFit && (
        <FitConfirmation
          fitData={measurementData}
          handleNext={submitMeasurement}
          handlePrevious={() => {
            setConfirmFit(false);
            setMeasurementType?.("online");
          }}
        />
      )}
    </>
  );
};

export default MeasurementComponent;
