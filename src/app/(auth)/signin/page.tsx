"use client";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import * as crypto from "crypto";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLeftSection from "@/components/common/leftSection";
import VipLogoSection from "@/components/common/vipLogo";
import useGoogleAuth from "@/hooks/auth";
import logger from "@/utils/logger";
import { loginAction } from "@/app/redux/slice/auth.slice";
import { UserAuthServices } from "@/servivces/user/auth.service";
import { useDispatch } from "react-redux";
import { setLocalStorageToken } from "@/utils";
import modalNotification from "@/utils/notification";
import { CUSTOMER_ROLE_ID } from "@/utils/env";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
   const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { googleLogin } = useGoogleAuth();
  const initialValues = {
    email: "",
    password: "",
  };

  const redirectPath = searchParams.get("redirect");


  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // const handleGoogleSignIn = () => {
  //     console.log('Google sign in clicked');
  // };

  const handleGoogleSignIn = () => {
    logger("calledddd");
    googleLogin();
  };

  const handleBusinessSignIn = () => {
    console.log("Business sign in clicked");
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    const hashedPassword = crypto
      .createHash("sha256")
      .update(values.password)
      .digest("hex");
    try {
      const response = await UserAuthServices.userLogin({
        email: values.email,
        password: hashedPassword,
        roleId: CUSTOMER_ROLE_ID
      });
      if (response?.status) {
        dispatch(
          loginAction({
            ...response?.data.user,
            accessToken: response?.data?.accessToken,
            refreshToken: response?.data?.refreshToken,
          })
        );
        setLocalStorageToken(response?.data?.accessToken);
        
        router.push(redirectPath || "/");

        modalNotification({
          message: response?.message || "Login successful",
          type: "success",
        });
      }

      if (!response?.status) {
        if (response?.flag) {
          router.push("/send-email?mode=verify");
          modalNotification({
            message:
              response?.message || "Please verify your email before logging in",
            type: "error",
          });
        } else {
          modalNotification({
            message:
              response?.message || "Invalid credentials, please try again",
            type: "error",
          });
          logger("Login failed:", response?.message);
        }
      }
    } catch (error) {
      logger("Login error", error);
      modalNotification({
        message:
          error?.response?.data?.message ||
          "Something went wrong. Please try again later.",
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <div className="w-full lg:w-[650vh] h-[40vh] lg:h-full">
        <AuthLeftSection imageSrc="/assets/images/signin.png" />
      </div>

      <div className="w-full lg:w-[350vh] h-[60vh] lg:h-full flex flex-col bg-white relative overflow-y-auto">
        <div className="hidden lg:block p-4 lg:p-6">
          <VipLogoSection />
        </div>

        <div className="flex-1 px-6 py-4 sm:py-6 relative xs:overflow-visible">
          <div className="space-y-3 md:space-y-4 lg:space-y-6 ">
            <h3 className="font-advent text-black font-semibold text-sm lg:text-base mt-4">
              Nice to see you again
              <br/>
              <span className="mt-2 font-advent text-xs lg:text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  onClick={() => {
                    localStorage.removeItem("signupStep");
                    localStorage.removeItem("signupEmail");
                  }}
                  className="font-advent text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  Sign up now
                </Link>
              </span>
            </h3>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-8 lg:space-y-6 md:space-x-2">
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
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-advent block text-xs lg:text-sm -mt-[0.5] font-medium text-gray-700 mb-1 ">
                        Password
                      </label>
                      <div className="relative">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password"
                          className="font-advent w-full px-2  py-1.5 lg:px-3 lg:py-2 border-none rounded-md bg-gray-100 focus:outline-none focus:ring-1 lg:focus:ring-2 focus:ring-[#BB9D7B] text-gray-700 text-xs lg:text-sm"
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
                        className="text-red-500 text-xs mt-0.5"
                      />
                    </div>

                    <div className="font-advent text-right -mt-[5px]">
                      <Link
                        href="/send-email"
                        className="text-xs lg:text-sm text-blue-600 hover:text-blue-800"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="font-advent w-full mt-2 lg:mt-4 bg-[#BB9D7B] hover:bg-[#a68b6b] text-white font-medium py-1.5 lg:py-2.5 px-4 rounded-md transition duration-200 text-xs lg:text-sm cursor-pointer"
                    >
                      Sign in
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
                className="w-full cursor-pointer flex items-center justify-center px-2 py-1.5 lg:px-4 lg:py-2.5 border border-gray-300 rounded-md bg-black text-white hover:bg-gray-900 transition duration-200"
              >
                <Image
                  src="/assets/SVG/icons/google.svg"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="object-cover"
                />
                <span className="font-advent text-xs lg:text-sm ms-4">
                  Sign in with Google
                </span>
              </button>

              <button
                onClick={handleBusinessSignIn}
                className="w-full flex cursor-pointer items-center justify-center px-2 py-1.5 lg:px-4 lg:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
              >
                <Image
                  src="/assets/SVG/icons/facebook.svg"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="object-cover"
                />
                <span className="font-advent text-xs lg:text-sm ms-4">
                  Sign in with Facebook
                </span>
              </button>
            </div>

            

            <div className="mt-4 lg:mt-8 text-center">
              <p className="text-xs text-[#000000]">
                vipformalwear ©2025 | All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignInPage;
