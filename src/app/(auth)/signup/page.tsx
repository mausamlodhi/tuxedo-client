"use client";

import React, { useEffect, useState, useRef } from "react"; // <-- added useRef
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as crypto from "crypto";
import Link from "next/link";
import { useDispatch } from "react-redux";
import modalNotification from "@/utils/notification";
import AuthLeftSection from "@/components/common/leftSection";
import VipLogoSection from "@/components/common/vipLogo";
import { UserAuthServices } from "@/servivces/user/auth.service";
import { AdminAuthServices } from "@/servivces/admin/auth/auth.service";
import logger from "@/utils/logger";
import { CUSTOMER_ROLE, OTP_TIMER_DURATION } from "@/utils/env";
import { setLocalStorageToken } from "@/utils";
import { loginAction } from "@/app/redux/slice/auth.slice";
import { ImageServices } from "@/servivces/image/image.service";

const SignupPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const emailParam = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [step, setStep] = useState<1 | 2>(() => {
    const savedStep =
      typeof window !== "undefined" ? localStorage.getItem("signupStep") : null;
    if (savedStep === "2" || stepParam === "2") return 2;
    return 1;
  });
  const [signupEmail, setSignupEmail] = useState("");

  const selectedEmail = signupEmail || emailParam;

  useEffect(() => {
    try {
      localStorage.setItem("signupStep", step.toString());
      const savedEmail = localStorage.getItem("signupEmail");
      if (savedEmail) {
        setSignupEmail(savedEmail);
      }
    } catch (err) {
      logger("LocalStorage error:", err);
    }
  }, [step]);

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    image: null,
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters, include one uppercase, one lowercase, one number, and one special character (@, $, !, %, *, ?, &)"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),

    firstName: Yup.string()
      .matches(/^[A-Za-z]+$/, "First name can only contain letters")
      .min(2, "First name must be at least 2 characters")
      .max(30, "First name cannot exceed 30 characters"),

    lastName: Yup.string()
      .matches(/^[A-Za-z]+$/, "Last name can only contain letters")
      .min(2, "Last name must be at least 2 characters"),

    phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(8, "Phone number must be at least 8 digits")
      .max(15, "Phone number cannot exceed 15 digits"),
  });

  const otpInitialValues = {
    email: "",
    otp: "",
  };

  const otpValidationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    otp: Yup.string()
      .required("OTP is required")
      .matches(/^\d{6}$/, "OTP must be exactly 6 digits"),
  });

  const getAllRoles = async (search: string = "") => {
    try {
      const response = await AdminAuthServices.getRoles({ search });
      if (response?.status) {
        setRoleList(response?.data?.rows || []);
      } else {
        modalNotification({
          message: response?.message || "Failed to fetch roles",
          type: "error",
        });
      }
    } catch (error) {
      logger("Error : ", error);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign in clicked");
  };

  const handleBusinessSignIn = () => {
    console.log("Business sign in clicked");
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setIsSubmitting(true);
      const hashedPassword = crypto
        .createHash("sha256")
        .update(values.password)
        .digest("hex");
      const customerRole = roleList.find((role) => role.name === CUSTOMER_ROLE);

      let imageUrl = null;
      if (values.image) {
        const formData = new FormData();
        formData.append("image", values.image);

        const imageRes = await ImageServices.uploadImage(formData);

        if (imageRes?.status && imageRes?.data?.length > 0) {
          imageUrl = imageRes.data[0].url;
        }
      }
      const payload = {
        email: values.email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        roleId: customerRole?.id || 2,
        image: imageUrl,
      };
      const response = await UserAuthServices.userSignUp(payload);

      if (response?.status) {
        modalNotification({
          message: response?.message || "SignUp successfully",
          type: "success",
        });
        setSignupEmail(values.email);
        setStep(2);
        localStorage.setItem("signupStep", "2");
        localStorage.setItem("signupEmail", values.email);
      } else {
        modalNotification({
          message: response?.message || "Signup failed, please try again",
          type: "error",
        });
      }
    } catch (error) {
      logger("Error : ", error);
    }
    setIsSubmitting(false);
  };

  const handleOtpSubmit = async (values: typeof otpInitialValues) => {
    try {
      setIsSubmitting(true);
      const response = await UserAuthServices.verifyOTP(values);
      if (response?.status) {
        modalNotification({
          message: response?.message || "OTP verified successfully",
          type: "success",
        });
        // clear expiry for this email on successful verify
        try {
          localStorage.removeItem(`otpExpiry_${values.email}`);
        } catch (e) { }
        if (response?.status) {
          modalNotification({
            message: response?.message || "You have logged in successfully",
            type: "success",
          });
          dispatch(
            loginAction({
              ...response?.data.user,
              accessToken: response?.data?.accessToken,
              refreshToken: response?.data?.refreshToken,
            })
          );
          setLocalStorageToken(response?.data?.accessToken);
          (router.push("/complete-profile") as any).then(() => {
            setStep(1);
            localStorage.removeItem("signupStep");
            localStorage.removeItem("signupEmail");
          });
        }
      } else {
        modalNotification({
          message: response?.message || "Invalid OTP, please try again",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message:
          error?.response?.data?.message ||
          "Something went wrong, please try again",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsSubmitting(false);
  };
  useEffect(() => {
    getAllRoles();
  }, []);

  const otpDuration =
    Number(OTP_TIMER_DURATION) > 0 ? Number(OTP_TIMER_DURATION) : 120;
  const [timeLeft, setTimeLeft] = useState<number>(otpDuration);
  const [canResend, setCanResend] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const startInterval = (initial: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (initial <= 0) {
      setTimeLeft(0);
      setCanResend(true);
      return;
    }
    setCanResend(false);
    setTimeLeft(initial);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (step !== 2) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const key = `otpExpiry_${selectedEmail || "default"}`;

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const expiry = parseInt(saved, 10);
        const remaining = Math.max(Math.ceil((expiry - Date.now()) / 1000), 0);
        if (remaining > 0) {
          startInterval(remaining);
        } else {
          const newExpiry = Date.now() + otpDuration * 1000;
          localStorage.setItem(key, newExpiry.toString());
          startInterval(otpDuration);
        }
      } else {
        const newExpiry = Date.now() + otpDuration * 1000;
        localStorage.setItem(key, newExpiry.toString());
        startInterval(otpDuration);
      }
    } catch (err) {
      logger("LocalStorage error:", err);
      startInterval(otpDuration);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [step, selectedEmail]);

  const handleResend = async () => {
    if (!canResend && timeLeft > 0) return;
    try {
      const res = await UserAuthServices.resendEmail({ email: selectedEmail });
      modalNotification({
        message: res?.message || "OTP resent successfully",
        type: "success",
      });

      const key = `otpExpiry_${selectedEmail || "default"}`;
      const newExpiry = Date.now() + otpDuration * 1000;
      try {
        localStorage.setItem(key, newExpiry.toString());
      } catch (e) {
        /* ignore */
      }

      startInterval(otpDuration);
    } catch (err) {
      logger("Resend error:", err);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-screen overflow-y-auto sm:overflow-y-hidden">
      {/* Left Section */}
      <div className="relative w-full lg:w-2/3 h-auto lg:h-full overflow-visible">
        {/* Background Image - only on desktop */}
        <div className="hidden lg:block absolute inset-0">
          <AuthLeftSection imageSrc="/assets/images/mask_group.png" />
        </div>
        {/* Mobile logo */}
        <div className="block lg:hidden ml-4">
          <VipLogoSection />
        </div>
        {/* Steps overlay */}
        <div className="relative flex flex-col justify-start p-4 lg:p-8 z-10">
          <div className="rounded-xl p-4 lg:p-8 w-auto max-w-xl 3xl:max-w-2xl text-white">
            <h2 className="font-advent text-xl lg:text-2xl font-semibold mb-4 text-gray-700">
              Our rental process is simple
            </h2>

            <div className="space-y-4 w-full max-w-2xl">
              {/* Step 1 */}
              <div className="border border-[#BB9D7B] rounded-md p-3 lg:p-4 flex justify-between items-start bg-white shadow-md">
                <div>
                  <h3 className="font-semibold font-advent text-sm lg:text-base text-black">
                    Enter the details of your event
                  </h3>
                  <p className="text-xs lg:text-sm font-advent  text-gray-800 mt-1">
                    Provide us with the details of your event, such as the date,
                    the location etc..  Then select the closest VIP Formal Wear
                    location to you.
                  </p>
                </div>
                <span className="text-gray-300 font-advent font-semibold text-lg lg:text-xl">
                  01
                </span>
              </div>

              {/* Step 2 (reversed) */}
              <div className="border border-[#BB9D7B] rounded-md p-3 lg:p-4 flex justify-between items-start bg-white shadow-md flex-row-reverse text-right">
                <div>
                  <h3 className="font-semibold font-advent text-sm lg:text-base text-black">
                    Add outfits & members
                  </h3>
                  <p className="text-xs lg:text-sm font-advent  text-gray-800 mt-1">
                    Choose the attire from our vast collection of styles, then
                    add your members and assign outfits to each member{" "}
                  </p>
                </div>
                <span className="text-gray-300 font-advent font-semibold text-lg lg:text-xl">
                  02
                </span>
              </div>

              {/* Step 3 */}
              <div className="border border-[#BB9D7B] rounded-md p-3 lg:p-4 flex justify-between items-start bg-white shadow-md">
                <div>
                  <h3 className="font-semibold font-advent text-sm lg:text-base text-black">
                    Send invite
                  </h3>
                  <p className="text-xs lg:text-sm font-advent  text-gray-800 mt-1">
                    We will send an invite to each member of your event. 
                    Everyone will receive a simple prompt to complete their
                    details online.{" "}
                  </p>
                </div>
                <span className="text-gray-300 font-advent font-semibold text-lg lg:text-xl">
                  03
                </span>
              </div>

              {/* Step 4 (reversed) */}
              <div className="border border-[#BB9D7B] rounded-md p-3 lg:p-4 flex justify-between items-start bg-white shadow-md flex-row-reverse text-right">
                <div>
                  <h3 className="font-advent font-semibold text-sm lg:text-base text-black">
                    Finalize your event
                  </h3>
                  <p className="text-xs lg:text-sm font-advent  text-gray-800 mt-1">
                    Review your selection and members, and confirm your event
                    registration.{" "}
                  </p>
                </div>
                <span className="text-gray-300 font-advent font-semibold text-lg lg:text-xl">
                  04
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="w-full lg:w-1/3 h-auto lg:h-full flex flex-col bg-white overflow-y-auto">
        {/* <div className="hidden lg:block top-4 left-4 lg:top-6 lg:left-6"> */}
        <div className="hidden lg:block  lg:p-6">
          <VipLogoSection />
        </div>

        {step === 1 && (
          <div className="flex-1 mb-10 px-4 sm:px-6 sm:py-8 md:mx-6 md:p-1 md:pr-10 ">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-1 lg:space-y-12">
                  <div>
                    <h3 className="font-advent text-black font-semibold text-xl lg:text-2xl mt-0">
                      Nice to see you again
                    </h3>
                    <span className="mt-2 font-advent text-xs lg:text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link
                        href="/signin"
                        className="font-advent text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        Sign in now
                      </Link>
                    </span>
                  </div>
                  <div className="space-y-0 lg:space-y-3">
                    <div>
                      <label className="font-advent block text-xs lg:text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="font-advent w-full px-2 py-1.5 lg:px-3 lg:py-2 border-none rounded-md bg-gray-100 focus:outline-none focus:ring-1 lg:focus:ring-2 focus:ring-[#BB9D7B] text-gray-700 text-xs lg:text-sm"
                      />

                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="font-advent block text-xs lg:text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password"
                          className="font-advent w-full px-2 py-1.5 lg:px-3 lg:py-2 border-none rounded-md bg-gray-100 focus:outline-none focus:ring-1 lg:focus:ring-2 focus:ring-[#BB9D7B] text-gray-700 text-xs lg:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-2 lg:pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="font-advent block text-xs lg:text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Field
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Re-enter your password"
                          className="font-advent w-full px-2 py-1.5 lg:px-3 lg:py-2 border-none rounded-md bg-gray-100 focus:outline-none focus:ring-1 lg:focus:ring-2 focus:ring-[#BB9D7B] text-gray-700 text-xs lg:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-2 lg:pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-advent block text-xs lg:text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <Field
                        type="text"
                        name="firstName"
                        placeholder="Enter your first name"
                        className="font-advent w-full px-2 py-1.5 lg:px-3 lg:py-2 border-none rounded-md 
               bg-gray-100 focus:outline-none focus:ring-1 lg:focus:ring-2 
               focus:ring-[#BB9D7B] text-gray-700 text-xs lg:text-sm"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="font-advent block text-xs lg:text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Field
                        type="text"
                        name="lastName"
                        placeholder="Enter your last name"
                        className="font-advent w-full px-2 py-1.5 lg:px-3 lg:py-2 border-none rounded-md 
               bg-gray-100 focus:outline-none focus:ring-1 lg:focus:ring-2 
               focus:ring-[#BB9D7B] text-gray-700 text-xs lg:text-sm"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="font-advent block text-xs lg:text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <Field
                        type="text"
                        name="phone"
                        placeholder="Enter your phone number"
                        className="font-advent w-full px-2 py-1.5 lg:px-3 lg:py-2 border-none rounded-md 
               bg-gray-100 focus:outline-none focus:ring-1 lg:focus:ring-2 
               focus:ring-[#BB9D7B] text-gray-700 text-xs lg:text-sm"
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="font-advent block text-xs lg:text-sm font-medium text-gray-700 mb-1">
                        Image
                      </label>
                      <Field name="image">
                        {({ form }: any) => (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file =
                                event.currentTarget.files?.[0] || null;
                              form.setFieldValue("image", file);
                            }}
                            className="font-advent w-full px-2 py-1.5 lg:px-3 lg:py-2 
            border-none rounded-md bg-gray-100 focus:outline-none 
            focus:ring-1 lg:focus:ring-2 focus:ring-[#BB9D7B] 
            text-gray-700 text-xs lg:text-sm"
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="image"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`font-advent w-full mt-2 lg:mt-4 
                                        ${isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#BB9D7B] hover:bg-[#a68b6b] cursor-pointer"
                        } 
                                        text-white font-medium py-1.5 lg:py-2.5 px-4 rounded-md transition duration-200 text-xs lg:text-sm`}
                    >
                      {isSubmitting ? "Signup..." : "Sign UP"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="my-1 lg:my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-2 lg:px-4 text-xs lg:text-sm text-gray-500">
                or
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="space-y-1 lg:space-y-3">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center px-2 py-1.5 lg:px-4 lg:py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
              >
                {/* Google SVG */}
                <svg
                  className="w-3 h-3 lg:w-5 lg:h-5 mr-1 lg:mr-2"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-advent text-gray-700 text-xs lg:text-sm">
                  Sign in with Google
                </span>
              </button>

              <button
                onClick={handleBusinessSignIn}
                className="w-full flex items-center justify-center px-2 py-1.5 lg:px-4 lg:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
              >
                <svg
                  className="w-3 h-3 lg:w-5 lg:h-5 mr-1 lg:mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="font-advent text-xs lg:text-sm">
                  Sign in with Business
                </span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 px-4 mt-1 sm:px-6 sm:py-8 md:mt-25 md:mx-6 md:p-1 md:pr-10 relative">
            <Formik
              initialValues={{ email: selectedEmail, otp: "" }}
              validationSchema={otpValidationSchema}
              onSubmit={handleOtpSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form className="space-y-1 lg:space-y-12">
                  <h3 className="text-black font-semibold text-sm lg:text-base">
                    Verify your email
                  </h3>

                  <div>
                    <Link
                      href="/signin"
                      className="flex items-center text-[#1e1000] hover:text-[#a68b6b] text-xs lg:text-sm font-medium transition"
                    >
                      <ArrowLeft size={16} className="mr-1" />
                      Back to Login
                    </Link>
                  </div>

                  <div className="space-y-0 lg:space-y-3">
                    <div>
                      <label className="font-advent block text-xs lg:text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        disabled
                        className="font-advent w-full px-2 py-1.5 lg:px-3 lg:py-2 border-none rounded-md bg-gray-100 
                             focus:outline-none focus:ring-1 lg:focus:ring-2 focus:ring-[#BB9D7B] 
                             text-gray-700 text-xs lg:text-sm"
                      />
                    </div>

                    <div>
                      <label className="font-advent block text-xs lg:text-sm font-medium text-gray-700 mb-1">
                        OTP
                      </label>
                      <Field
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        className="font-advent w-full px-2 py-1.5 lg:px-3 lg:py-2 border-none rounded-md bg-gray-100 
                             focus:outline-none focus:ring-1 lg:focus:ring-2 focus:ring-[#BB9D7B] 
                             text-gray-700 text-xs lg:text-sm"
                      />
                      <ErrorMessage
                        name="otp"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div className="flex justify-between items-center mt-3 text-xs lg:text-sm">
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={!canResend}
                        className={`font-medium font-advent ${canResend
                          ? "text-[#BB9D7B] hover:underline cursor-pointer"
                          : "text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        Resend OTP
                      </button>
                      <span className="text-gray-600">
                        {formatTime(timeLeft)}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="font-advent w-full mt-2 lg:mt-4 bg-[#BB9D7B] hover:bg-[#a68b6b] 
                           text-white font-medium py-1.5 lg:py-2.5 px-4 rounded-md 
                           transition duration-200 text-xs lg:text-sm cursor-pointer"
                    >
                      Verify OTP
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
