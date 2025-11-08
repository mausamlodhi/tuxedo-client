"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthLeftSection from "@/components/common/leftSection";
import VipLogoSection from "@/components/common/vipLogo";
import { UserAuthServices } from "@/servivces/user/auth.service";
import modalNotification from "@/utils/notification";
import logger from "@/utils/logger";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const SendEmail = () => {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // detect mode: verification or reset
  const flag = searchParams.get("mode") || "reset"; // default reset

  const handleFormSubmit = async (values: { email: string }) => {
    try {
      setSubmitted(true);

      if (flag === "verify") {
        // 🔹 API for verification email
        const response = await UserAuthServices.resendEmail(values);
        logger(response, "response on verify otp");
        if (response?.status) {
          modalNotification({
            message:
              response?.message ||
              "Verification email sent successfully. Please check your inbox.",
            type: "success",
          });
          router.push(
            `/signup?step=2&email=${encodeURIComponent(values.email)}`
          );
        }
      } else {
        // 🔹 API for reset password
        const response = await UserAuthServices.forgotPassword(values);
        if (response?.status) {
          modalNotification({
            message:
              response?.message ||
              "Password reset email sent successfully. Please check your inbox.",
            type: "success",
          });
        }
      }

      setSubmitted(false);
    } catch (error) {
      logger(error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Left Section */}
      <div className="w-full lg:w-2/3 h-[40vh] lg:h-screen">
        <AuthLeftSection imageSrc="/assets/images/resetPassword.jpg" />
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/3 h-auto lg:h-screen flex flex-col justify-center bg-white relative overflow-y-auto xs:overflow-visible">
        {/* Logo - only visible on desktop */}
        <div className="hidden lg:block absolute top-4 left-4 z-50 cursor-pointer">
          <VipLogoSection />
        </div>

        <div className="flex-1 px-4 py-10 sm:px-6 md:px-8 lg:px-10 space-y-5 flex flex-col justify-center relative">
          {!submitted && (
            <span>
              <Link
                href="/signin"
                className="flex items-center text-[#1e1000] hover:text-[#a68b6b] text-xs lg:text-sm font-medium transition"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Login
              </Link>
            </span>
          )}

          <div className="space-y-1">
            <h2 className="font advent text-black text-lg font-semibold">
              {flag === "verify" ? "Send Verification Email" : "Reset Password"}
            </h2>
            {submitted && (
              <p className="text-black font-medium text-sm lg:text-base">
                {flag === "verify"
                  ? "We sent you an email with a verification link."
                  : "We sent you an email with instructions to reset your password."}
              </p>
            )}
          </div>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={submitted ? null : validationSchema}
            onSubmit={
              submitted ? () => router.push("/signIn") : handleFormSubmit
            }
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    disabled={submitted}
                    className="font advent w-full px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#BB9D7B]"
                  />
                  {!submitted && (
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="font advent w-full bg-[#BB9D7B] hover:bg-[#a68b6b] text-white font-medium py-2 px-4 rounded-md transition duration-200 text-sm"
                >
                  {flag === "verify"
                    ? "Send Verification Email"
                    : "Reset Password"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              vipformalwear ©2025 | All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendEmail;
