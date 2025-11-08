'use client';
import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import * as crypto from 'crypto';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserAuthServices } from '@/servivces/user/auth.service';
import AuthLeftSection from '@/components/common/leftSection';
import VipLogoSection from '@/components/common/vipLogo';
import logger from '@/utils/logger';
import modalNotification from '@/utils/notification';
import Link from 'next/link';

const ResetPasswordPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    console.log("Reset token:", token);
 const initialValues = {
        newPassword: '',
        confirmPassword: ''
    };

    const validationSchema = Yup.object({
        newPassword: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('New Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword')], 'Passwords must match')
            .required('Confirm Password is required')
    });

    const handleSubmit = async (values: typeof initialValues) => {
        setLoading(true);
        const hashedPassword = crypto.createHash('sha256').update(values.newPassword).digest('hex');

        try {
            const payload = {
                newPassword: hashedPassword,
                confirmPassword: hashedPassword,
                token: token
            };
            const res = await UserAuthServices.resetPassword(payload);
            if (res?.status) {
         modalNotification({
            message: res?.message || "Passsword reset successfully",
            type: "success"
          });

                
                router.push('/signin');
            }
            else {

                 modalNotification({
        message: res?.message || "Failed to reset password, please try again",
        type: "error",
      });
                logger("Reset password failed:", res);
            }

        } catch (error) {

             modalNotification({
      message:
        error?.response?.data?.message ||
        "Something went wrong. Please try again later.",
      type: "error",
    });
            logger("Reset password error", error);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen">
            <div className="w-full lg:w-[650vh] h-[40vh] lg:h-full">
                <AuthLeftSection imageSrc="/assets/images/signin.png" />
            </div>

            <div className="w-full lg:w-[350vh] h-[60vh] lg:h-full flex flex-col justify-start md:justify-center bg-white relative overflow-y-auto xs:overflow-visible">
                <div className="hidden lg:block absolute top-4 left-4 lg:top-6 lg:left-6 mx-2 ">
                    <VipLogoSection />
                </div>

                <div className="flex-1 px-4 sm:px-6 sm:py-8  xs:mt-20 sm:mt-15 md:mt-35 lg:mt-55 xl:mt-30 md:mx-6 md:p-1 md:pr-10">

                    <div className="space-y-3 md:space-y-2 lg:space-y-0 ">
                        <h3 className="font-advent text-black font-semibold text-sm lg:text-base">
                            Change Password
                        </h3>

                        <span>
                                  <Link
                                    href="/signin"
                                    className="flex items-center text-[#1e1000] hover:text-[#a68b6b] text-xs lg:text-sm font-medium transition mt-2"
                                  >
                                    <ArrowLeft size={16} className="mr-1" />
                                    Back to Login
                                  </Link>
                                </span>

                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                            {() => (
                                <Form className="space-y-8 lg:space-y-16 mt-4">
                                    <div className="space-y-3">
                                        {/* New Password */}
                                        <div>
                                            <label className="font-advent block text-xs lg:text-sm font-medium text-gray-700 mb-1">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="newPassword"
                                                    placeholder="Enter new password"
                                                    className="font-advent w-full px-2 py-1.5 lg:px-3 lg:py-2 border-none rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#BB9D7B] text-gray-700 text-xs lg:text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            <ErrorMessage name="newPassword" component="div" className="text-red-500 text-xs mt-0.5" />
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="font-advent block text-xs lg:text-sm font-medium text-gray-700 mb-1">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="confirmPassword"
                                                    placeholder="Confirm new password"
                                                    className="font-advent w-full px-2 py-1.5 lg:px-3 lg:py-2 border-none rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#BB9D7B] text-gray-700 text-xs lg:text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-0.5" />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="font-advent w-full mt-2 bg-[#BB9D7B] hover:bg-[#a68b6b] text-white font-medium py-1.5 lg:py-2.5 px-4 rounded-md transition duration-200 text-xs lg:text-sm cursor-pointer"
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>

                        <div className="mt-4 lg:mt-8 text-center">
                            <p className="text-xs text-[#000000]">vipformalwear ©2025 | All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ResetPasswordPage;
