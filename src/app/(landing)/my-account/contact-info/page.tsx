"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Phone } from "lucide-react";

const ContactInfoPage: React.FC = () => {
  // Define Types
  interface FormValuesContactinfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }
  interface FormValuesOthertinfo {
    email: string;
  }
  const initialValuesContactInfo: FormValuesContactinfo = {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  };
  const initialValuesOtherInfo: FormValuesOthertinfo = { email: "" };

  // Validation Schema
  const validationSchemaContactInfo = Yup.object({
    firstName: Yup.string().required("First Name should be required"),
    lastName: Yup.string().required("Last Name should be required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });

  const validationSchemaOtherInfo = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });
  // Submit Handler
  const handleSubmitContactInfo = (values: FormValuesContactinfo) => {};
  const handleSubmitOtherInfo = (values: FormValuesOthertinfo) => {};

  return (
    <div className="w-full max-w-4xl mx-auto gap-3">
      {/* Header */}

      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 font-advent mb-2 whitespace-nowrap">
        Contact Info
      </h2>
      <p className="text-sm lg:text-xl text-gray-900 font-advent mb-2 whitespace-nowrap">
        YOUR INFO
      </p>

      <Formik
        initialValues={initialValuesContactInfo}
        validationSchema={validationSchemaContactInfo}
        onSubmit={handleSubmitContactInfo}
      >
        <Form className="space-y-6">
          {/* First + Last Name */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                First name
              </label>
              <Field
                name="firstName"
                type="text"
                className="mt-1 block w-full border border-gray-300 p-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Last name
              </label>
              <Field
                name="lastName"
                type="text"
                className="mt-1 block w-full border border-gray-300 p-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <Field
                name="email"
                type="email"
                className="mt-1 block w-full border border-gray-300 p-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <Field
                name="phone"
                type="text"
                className="mt-1 block w-full border border-gray-300 p-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>
          </div>

          {/* Save Button */}
          <div>
            <button
              type="submit"
              className="w-40 border border-[#D6A680] text-[#D6A680] font-[#D6A680] py-2 hover:bg-orange-50 transition"
            >
              SAVE CHANGES
            </button>
          </div>
        </Form>
      </Formik>
      <div className="mt-6">
        <h6 className="text-xl lg:text-2xl font-bold text-gray-900 font-advent mb-2 whitespace-nowrap">
          Significant Other Info
        </h6>
        <Formik
          initialValues={initialValuesOtherInfo}
          validationSchema={validationSchemaOtherInfo}
          onSubmit={handleSubmitOtherInfo}
        >
          <Form className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                E-mail
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder=""
                className="w-full sm:w-96 px-3 py-2 border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-40 border border-[#D6A680] text-[#D6A680] font-[#D6A680] py-2 hover:bg-orange-50 transition"
            >
              SEND LINK
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ContactInfoPage;
