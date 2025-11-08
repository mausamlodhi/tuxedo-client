"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UserAuthServices } from '@/servivces/user/auth.service';
import modalNotification from "@/utils/notification";

const ChangePasswordPage: React.FC = () => {
  // Initial Values
  const initialValues = { email: "" };

  // Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });


  const handleSubmit = async (values: { email: string }) => {
    try {
      const response = await UserAuthServices.forgotPassword(values);
      if (response?.status) {
        modalNotification({
          message: response?.message || "Password reset email sent successfully. Please check your inbox.",
          type: "success"
        });
      }

    }
    catch (error) {
      modalNotification({
        message: error?.message || "An error occurred. Please try again later.",
        type: "error"
      });

    }
  };
  return (
    <div className="w-full max-w-4xl mx-auto gap-3">
      {/* Header */}

      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-advent mb-2 whitespace-nowrap">
        Password Reset
      </h2>
      {/* Formik Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
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
              className="w-full sm:w-100 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-400"
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
            className="w-38 border border-[#D6A680] text-[#D6A680] font-[#D6A680] py-2 hover:bg-orange-50 transition"
          >
            SEND LINK
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default ChangePasswordPage;
