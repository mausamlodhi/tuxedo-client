"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select } from "antd";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function BodyMeasurementsForm({ onClose, handleNext, data }) {
  const validationSchema = Yup.object({
    genderType: Yup.string().required("Please select gender type"),
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
    shirtNeckSize: Yup.number()
      .typeError("Shirt neck must be a number")
      .positive("Must be positive")
      .nullable(),
    shirtSleeveLength: Yup.number()
      .typeError("Shirt sleeve must be a number")
      .positive("Must be positive")
      .nullable(),
    shoeSize: Yup.string().nullable(),
    bodyType: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      genderType: data?.genderType||"",
      height: data?.height || "",
      weight: data?.weight || "",
      bodyType: data?.bodyType || "",
      chestOverArms: data?.chestOverArms || "",
      chest: data?.chest || "",
      trouserWaist: data?.trouserWaist || "",
      trouserLength: data?.trouserLength || "",
      shirtNeckSize: data?.shirtNeckSize || "",
      shirtSleeveLength: data?.shirtSleeveLength || "",
      shoeSize: data?.shoeSize || "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form values:", values);
      handleNext(values);
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


  const handleSave = (values: any) => {
    console.log("Form values:", values);
    handleNext(values);
  };
  const boyHeights = [];
  const menHeights = [];
  for (let feet = 3; feet <= 6; feet++) {
    for (let inch = feet === 3 ? 1 : 0; inch <= 11; inch++) {
      const heightLabel = `${feet}'${inch}"`;
      if (feet < 5) boyHeights.push(heightLabel);
      else menHeights.push(heightLabel);
    }
  }

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="w-full max-w-5xl bg-white rounded-xl p-6 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-full mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <motion.h2
              className="text-2xl sm:text-3xl font-semibold font-advent text-left"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Body Measurements
            </motion.h2>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNext()}
              className="flex items-center gap-2 px-5 py-2 h-[45px] min-w-[220px] border border-gray-300 text-gray-700 font-advent font-medium hover:bg-gray-100 transition-all mt-3 sm:mt-0"
            >
              <MapPin size={18} />
              Visit a store for the measurement
            </motion.button>
          </div>

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
                {formik.errors.genderType?.toString()}
              </p>
            )}
          </div>

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

          <div className="flex flex-col w-full sm:w-[32%]">
            {" "}
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
                {formik.errors.weight.toString()}
              </p>
            )}
          </div>

          <div className="flex flex-col w-full sm:w-[32%]">
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
          {[
            ["chestOverArms", "Chest over arms", "in inches"],
            ["chest", "Chest", "in inches"],
            ["trouserWaist", "Trouser waist", "in inches"],
            ["trouserLength", "Trouser length", "inseam in inches"],
            ["shirtNeckSize", "Shirt neck size", "in inches"],
            ["shirtSleeveLength", "Shirt sleeve length", "in inches"],
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

          <div className="flex flex-col w-full sm:w-[32%]">
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 w-full font-advent gap-3">
            {/* Left text */}
            <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left w-full sm:w-auto">
              All fields are optional — enter what you know.
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-center sm:justify-end w-full sm:w-auto">
              <motion.button
                type="button"
                onClick={() => {
                  onClose()
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm text-gray-700 w-[150px] h-[45px] border border-gray-300 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                onClick={() => handleSave(formik.values)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm bg-[#d4a077] w-[150px] h-[45px] text-white hover:bg-[#c28150] transition cursor-pointer"
              >
                Save
              </motion.button>
            </div>
          </div>

        </form>

      </motion.div>
    </motion.div>
  );
}
