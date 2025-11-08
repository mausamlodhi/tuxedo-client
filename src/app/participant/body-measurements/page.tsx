"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select } from "antd";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import FitConfirmation from "@/components/fitConfirmation";
import logger from "@/utils/logger";
import { useSelector } from "react-redux";
import { getInvitedEventDetails, getSelectedOutfit } from "@/app/redux/slice/invited-event.slice";
import { selectUserData } from "@/app/redux/slice/auth.slice";
import { EventDetailsServices } from "@/servivces/user/eventDetails.service";
import modalNotification from "@/utils/notification";
import { useRouter } from "next/navigation";
import { locations } from "@/utils/constant";

export default function BodyMeasurements() {
  const router = useRouter();
  const invitedEvent = useSelector(getInvitedEventDetails);
  const selectedOutfit = useSelector(getSelectedOutfit);
  const userData = useSelector(selectUserData);
  const [isConfirmFit, setIsConfirmFit] = useState<boolean>(false)
  const [measurementData, setMeasurementData] = useState(null);
  const [measurementType, setMeasurementType] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [errors, setErrors] = useState({ store: "", date: "" });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const validationSchema = Yup.object({
    genderType: Yup.string().required("Please select gender type"),
    // height: Yup.string().nullable(),
    height: Yup.string().when("genderType", {
      is: (val) => val === "Men" || val === "Boy",
      then: (schema) => schema.required("Please select your height"),
      otherwise: (schema) => schema.nullable(),
    }),
    weight: Yup.number()
      .typeError("Weight must be a number")
      .positive("Weight must be positive")
      .nullable(),
    chestOverArms: Yup.number()
      .typeError("Chest over arms must be a number")
      .positive("Must be positive")
      .nullable(),
    chest: Yup.number()
      .typeError("Chest must be a number")
      .positive("Must be positive")
      .nullable(),
    trouserWaist: Yup.number()
      .typeError("Trouser waist must be a number")
      .positive("Must be positive")
      .nullable(),
    trouserLength: Yup.number()
      .typeError("Trouser length must be a number")
      .positive("Must be positive")
      .nullable(),
    shirtNeck: Yup.number()
      .typeError("Shirt neck must be a number")
      .positive("Must be positive")
      .nullable(),
    shirtSleeve: Yup.number()
      .typeError("Shirt sleeve must be a number")
      .positive("Must be positive")
      .nullable(),
    shoeSize: Yup.string().nullable(),
    bodyType: Yup.string().nullable(),
  });

  const handleStoreSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    const newErrors = { store: "", date: "" };

    if (!selectedStore) {
      newErrors.store = "Please select a store.";
      valid = false;
    }

    if (!selectedDate) {
      newErrors.date = "Please select an appointment date.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    logger({
      store: selectedStore,
      date: selectedDate,
    });
    handleSubmit()
  };

  const handleStoreChange = (value) => {
    setSelectedStore(value);
    const location = locations.find((loc) => loc.name === value);
    setSelectedLocation(location || null);
  };

  const formik = useFormik({
    initialValues: {
      genderType: measurementData?.genderType || "",
      height: measurementData?.height || "",
      weight: measurementData?.weight || 0,
      bodyType: measurementData?.bodyType || "",
      chestOverArms: measurementData?.chestOverArms || 0,
      chest: measurementData?.chest || 0,
      trouserWaist: measurementData?.trouserWaist || 0,
      trouserLength: measurementData?.trouserLength || 0,
      shirtNeck: measurementData?.shirtNeck || 0,
      shirtSleeve: measurementData?.shirtSleeve || 0,
      shoeSize: measurementData?.shoeSize || "",
    },
    onSubmit: (values) => {
      setIsConfirmFit(true)
      setMeasurementData(values)
    },
  });

  const bodyTypes = ["Slim", "Average", "Athletic", "Plus Size"];
  const shoeSizes = [
    "6.5D",
    "7D",
    "7.5D",
    "8D",
    "8.5D",
    "9D",
    "9.5D",
    "10D",
    "10.5D",
    "11D",
    "11.5D",
    "12D",
    "13D",
    "14D",
    "15D",
    "16D",
    "17D",
    "18D",
  ];
  const boyHeights = [];
  const menHeights = [];
  for (let feet = 3; feet <= 6; feet++) {
    for (let inch = feet === 3 ? 1 : 0; inch <= 11; inch++) {
      const heightLabel = `${feet}'${inch}"`;
      if (feet < 5) boyHeights.push(heightLabel);
      else menHeights.push(heightLabel);
    }
  }

  const handleSubmit = async () => {
    try {
      let payload;
      if (measurementType === "online") {
        payload = {
          eventId: invitedEvent?.id,
          userId: userData?.id,
          outfitId: selectedOutfit?.id,
          ...measurementData,
          men_type: measurementData?.genderType || undefined,
          chest_over_arms: parseFloat(measurementData?.chestOverArms) || undefined,
          trouser_waist_size: parseFloat(measurementData?.trouserWaist) || undefined,
          trouser_length: parseFloat(measurementData?.trouserLength) || undefined,
          shirt_neck_size: parseFloat(measurementData?.shirtNeckSize) || undefined,
          shirt_sleeve_length: parseFloat(measurementData?.shirtSleeveLength) || undefined,
          body_type: measurementData?.bodyType || undefined,
          shoe_size: measurementData?.shoeSize || undefined,
          measurementProvinience:measurementType || undefined
        };
      }else{
        payload={
          eventId: invitedEvent?.id,
          userId: userData?.id,
          outfitId: selectedOutfit?.id,
          store:selectedLocation?.name,
          measurementProvinience:measurementType,
          measurementProvienenceDate:selectedDate,
          men_type:'men'
        }
      }
      const response = await EventDetailsServices.saveCustomerMeasurement(payload);
      if (response?.status) {
        modalNotification({
          type: 'success',
          message: response?.message || "Measurement has been saved successfully!"
        });
        router.push("./outfit-preview")
      }
    } catch (error) {
      logger('Getting an while submitting measurement : ', error)
    }
  }
  return <>
    {!measurementType ?
      <>
        <div className="mt-10">
          <motion.h2
            className="text-2xl font-bold font-advent text-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            How would you like to share your measurements for{" "}
            {"Cheeku"}'s outfit?
          </motion.h2>
          <div className="flex-1 p-6 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="max-w-2xl mx-auto space-y-3">
                <motion.label
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between cursor-pointer py-3 rounded-md px-4 hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="measurementType"
                      value="in-store"
                      checked={measurementType === "in-store"}
                      onChange={(e) => {
                        setMeasurementType(e.target.value)
                        // setSelectedTab('checkout')
                      }}
                      className="w-5 h-5 accent-[#e7c0a1] cursor-pointer"
                    />
                    <h3 className="text-lg font-semibold text-gray-800 font-advent">
                      Visit a Store for Measurements
                    </h3>
                  </div>
                </motion.label>
                <motion.label
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between cursor-pointer py-3 rounded-md px-4 hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="measurementType"
                      value="online"
                      checked={measurementType === "online"}
                      onChange={(e) => {
                        setMeasurementType(e.target.value)
                      }}
                      className="w-5 h-5 accent-[#e7c0a1] cursor-pointer"
                    />
                    <h3 className="text-lg font-semibold text-gray-800 font-advent">
                      Enter Measurements Online
                    </h3>
                  </div>
                </motion.label>
              </div>
            </div>
          </div>
        </div>
      </>
      : <>
        {
          isConfirmFit ? <FitConfirmation
            fitData={measurementData}
            handleNext={() => {
              logger("SDFDGFDg")
              handleSubmit()
              // submitMeasurement()
            }}
            handlePrevious={() => {
              setIsConfirmFit(false);
              setMeasurementType('online')
            }}
          /> : <>
            {
              measurementType === 'online' ? <motion.div
                className="flex items-center justify-center min-h-screen bg-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  className="w-full max-w-5xl bg-white rounded-xl p-10 flex flex-col items-center" //
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {/* Title and Button in same line, subtitle below */}
                  <div className="w-full mb-6">
                    {/* Top row: Title (left) + Button (right) */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                      {/* Title */}
                      <motion.h2
                        className="text-2xl sm:text-3xl font-semibold font-advent text-left"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        Body Measurements
                      </motion.h2>

                      {/* Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => logger("DFDFGDFG")}
                        className="flex items-center gap-2 px-5 py-2 h-[45px] min-w-[220px] border border-gray-300 text-gray-700 font-advent font-medium hover:bg-gray-100 transition-all mt-3 sm:mt-0"
                      >
                        <MapPin size={18} />
                        Visit a store for the measurement
                      </motion.button>
                    </div>

                    {/* Subtitle below */}
                    <motion.p
                      className="text-sm sm:text-base text-gray-600 font-advent text-left leading-relaxed mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Enter your measurements to help us build a better fit. Select your
                      body type outline if you prefer visuals over words.
                    </motion.p>
                  </div>

                  <form
                    onSubmit={formik.handleSubmit}
                    className="flex flex-wrap justify-start gap-y-5 gap-x-4 w-full"
                  >
                    {/* Gender Type */}
                    <div className="flex flex-col w-full sm:w-[32%]">
                      <label className="block text-gray-700 font-medium mb-1 text-sm">
                        Fit Type
                      </label>
                      <Select
                        placeholder="Choose Men or Boy"
                        value={formik.values.genderType || undefined}
                        onChange={(value) => formik.setFieldValue("genderType", value)}
                        options={[
                          { value: "Boy", label: "Boy" },
                          { value: "Men", label: "Men" },
                        ]}
                        className="w-full text-sm"
                        style={{ backgroundColor: "#f3f4f6", borderRadius: "6px" }}
                      />
                      {formik.errors.genderType && formik.touched.genderType && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.genderType.toString()}
                        </p>
                      )}
                    </div>

                    {/* Height */}
                    <div className="flex flex-col w-full sm:w-[32%]">
                      <label className="block text-gray-700 font-medium mb-1 text-sm">
                        Height
                      </label>
                      <Select
                        showSearch
                        placeholder={
                          formik.values.genderType
                            ? "Select height..."
                            : "Select gender first"
                        }
                        value={formik.values.height || undefined}
                        onChange={(value) => formik.setFieldValue("height", value)}
                        disabled={!formik.values.genderType}
                        options={
                          formik.values.genderType === "Boy"
                            ? boyHeights.map((h) => ({ value: h, label: h }))
                            : formik.values.genderType === "Men"
                              ? menHeights.map((h) => ({ value: h, label: h }))
                              : []
                        }
                        className="w-full text-sm"
                        style={{ backgroundColor: "#f3f4f6", borderRadius: "6px" }}
                      />
                      {formik.errors.height && formik.touched.height && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.height.toString()}
                        </p>
                      )}
                    </div>

                    {/* Weight */}
                    <div className="flex flex-col w-full sm:w-[32%]">
                      {" "}
                      {/* ✅ changed here */}
                      <label className="block text-gray-700 font-medium mb-1 text-sm font-advent">
                        Weight
                      </label>
                      <input
                        type="text"
                        name="weight"
                        placeholder="in lbs"
                        value={formik.values.weight}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 font-advent ${formik.errors.weight && formik.touched.weight
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-[#d4a077]"
                          } transition`}
                      />
                      {formik.errors.weight && formik.touched.weight && (
                        <p className="text-red-500 text-xs mt-1 font-advent">
                          {formik.errors.weight?.toString()}
                        </p>
                      )}
                    </div>

                    {/* Body Type */}
                    <div className="flex flex-col w-full sm:w-[32%]">
                      {" "}
                      {/* ✅ changed here */}
                      <label className="block text-gray-700 font-medium mb-2 text-sm font-advent">
                        Body Type
                      </label>
                      <Select
                        showSearch
                        placeholder="Select your body type..."
                        value={formik.values.bodyType || undefined}
                        onChange={(value) => formik.setFieldValue("bodyType", value)}
                        options={bodyTypes.map((type) => ({ value: type, label: type }))}
                        className="w-full text-sm"
                        style={{ backgroundColor: "#f3f4f6", borderRadius: "6px" }}
                      />
                    </div>

                    {/* Other Inputs */}
                    {[
                      ["chestOverArms", "Chest over arms", "in inches"],
                      ["chest", "Chest", "in inches"],
                      ["trouserWaist", "Trouser waist", "in inches"],
                      ["trouserLength", "Trouser length", "inseam in inches"],
                      ["shirtNeck", "Shirt neck size", "in inches"],
                      ["shirtSleeve", "Shirt sleeve length", "in inches"],
                    ].map(([name, label, placeholder]) => (
                      <div key={name} className="flex flex-col w-full sm:w-[32%]">
                        {" "}
                        <label className="block text-gray-700 font-medium mb-1 text-sm font-advent">
                          {label}
                        </label>
                        <input
                          type="text"
                          name={name}
                          placeholder={placeholder}
                          value={formik.values[name]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 font-advent ${formik.errors[name] && formik.touched[name]
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:ring-[#d4a077]"
                            } transition`}
                        />
                        {formik.errors[name] && formik.touched[name] && (
                          <p className="text-red-500 text-xs mt-1 font-advent">
                            {formik.errors[name]}
                          </p>
                        )}
                      </div>
                    ))}

                    {/* Shoe Size */}
                    <div className="flex flex-col w-full sm:w-[32%]">
                      {" "}
                      <label className="block text-gray-700 font-medium mb-1 text-sm font-advent">
                        Shoe Size
                      </label>
                      <Select
                        showSearch
                        placeholder="Select shoe size..."
                        value={formik.values.shoeSize || undefined}
                        onChange={(value) => formik.setFieldValue("shoeSize", value)}
                        options={shoeSizes.map((size) => ({
                          value: String(size),
                          label: String(size),
                        }))}
                        className="w-full text-sm"
                        style={{ backgroundColor: "#f3f4f6", borderRadius: "6px" }}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end mt-6 font-advent">
                      <motion.button
                        type="button"
                        onClick={() => setMeasurementType("")}
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
                        Save
                      </motion.button>
                      <p className="text-gray-500 text-xs sm:text-sm mt-2 text-center w-full font-advent">
                        All fields are optional — enter what you know.
                      </p>
                    </div>

                  </form>
                </motion.div>
              </motion.div> : <>
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
                          className={`w-full px-3 py-2 border rounded text-sm font-advent focus:outline-none focus:ring-2 transition ${errors.date
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
                          onClick={() => setMeasurementType("")}
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
              </>
            }
          </>
        }
      </>}
  </>
}
