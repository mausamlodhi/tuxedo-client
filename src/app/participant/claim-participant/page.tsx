"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import * as crypto from "crypto";
import { Check, CheckCheck, Circle, } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getInvitedEventOutfits, updateSelectedOutfit } from "@/app/redux/slice/invited-event.slice";
import logger from "@/utils/logger";
import { checkIsAuthenicate, loginAction } from "@/app/redux/slice/auth.slice";
import SignUpSidebarForm from "@/components/forms/signupSidebar";
import modalNotification from "@/utils/notification";
import { setLocalStorageToken } from "@/utils";
import { UserAuthServices } from "@/servivces/user/auth.service";
import { ImageServices } from "@/servivces/image/image.service";
import { CUSTOMER_ROLE, CUSTOMER_ROLE_ID } from "@/utils/env";
import { AdminAuthServices } from "@/servivces/admin/auth/auth.service";
import SignInSidebarForm from "@/components/forms/signiSidebar";

interface OutfitInterface {
    id?: number;
    [key: string]: any;
}

const InvitePage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const eventOutfits = useSelector(getInvitedEventOutfits);
    const isAuthenticated = useSelector(checkIsAuthenicate);
    const [sidebarType, setSidebarType] = useState<string>('');
    const [selectedOutfit, setSelectedOutfit] = useState<OutfitInterface>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [roleList, setRoleList] = useState<any[]>([]);
    const [step, setStep] = useState<1 | 2>(1);
    const [signupEmail, setSignupEmail] = useState<string>("");
    const [loading,setLoading] = useState<boolean>(false);
    const handleClaimOutfit = () => {
        try {
            dispatch(updateSelectedOutfit(selectedOutfit));
            if (isAuthenticated) {
                router.push('/participant/body-measurements')
            } else {
                setSidebarType('signin')
            }
        } catch (error) {
            logger("Error while claiming an outfit : ", error);
        }
    }

    const handleSignup = async (values: any) => {
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
                localStorage.setItem("signupEmail", values.email);
                setStep(2);
                setSignupEmail(values?.email)
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

    const handleOtpSubmit = async (values: any) => {
        try {
            setIsSubmitting(true);
            const customerEmail = localStorage.getItem("signupEmail")
            const payload = {
                ...values,
                email: signupEmail || customerEmail
            }
            const response = await UserAuthServices.verifyOTP(payload);
            if (response?.status) {
                modalNotification({
                    message: response?.message || "OTP verified successfully",
                    type: "success",
                });

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
                    setSidebarType('');
                    router.push("./body-measurements")
                    setLocalStorageToken(response?.data?.accessToken);
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

    const handleSignin = async (values: any) => {
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

    const handleResend = async () => {
        try {
            const customerEmail = localStorage.getItem("signupEmail")
            const res = await UserAuthServices.resendEmail({ email: signupEmail || customerEmail });
            modalNotification({
                message: res?.message || "OTP resent successfully",
                type: "success",
            });
        } catch (err) {
            logger("Resend error:", err);
        }
    };

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

    useEffect(() => {
        getAllRoles();
    }, [])

    useEffect(() => {
        const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
        if (navEntries[0]?.type === "reload") {
            console.log("Page was reloaded!", selectedOutfit);
        }
    }, []);

    logger("Selected : ", selectedOutfit)

    return <>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex flex-col md:flex-row bg-white"
        >
            <div className="md:w-1/2 w-full relative h-[60vh] md:h-screen bg-black">
                <Image
                    src="/assets/images/vip-banner.jpg"
                    alt="VIP Formal Wear"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <div className="md:w-1/2 w-full flex items-center justify-center p-6 md:p-12">
                <div className="bg-white border border-gray-200 shadow-md rounded-xl p-8 w-full max-w-md">
                    <h1 className="text-2xl md:text-3xl font-advent font-semibold text-gray-900 mb-2">
                        <span className="font-bold text-black">John</span> has picked out a look
                        just for you.
                    </h1>
                    <p className="text-sm text-gray-600 mb-6">
                        Claim your name below to view the outfit and proceed.
                    </p>

                    <div className="space-y-3 mb-6">
                        {eventOutfits.map((outfit: any, idx: number) => (
                            <div
                                key={idx}
                                className={`flex items-center justify-between border rounded-lg px-3 py-2 ${selectedOutfit?.id === outfit?.id
                                    ? "border-[#e7c0a1] bg-[#fff8f2]"
                                    : "border-gray-200"
                                    }`}
                                onClick={() => {
                                    if (outfit?.isClaimed) {
                                        return;
                                    }
                                    setSelectedOutfit(outfit)
                                }}
                            >
                                <div>
                                    <p className="text-gray-800 text-sm font-semibold">{outfit?.firstName} {outfit?.lastName}</p>
                                </div>

                                {outfit?.isClaimed ? <div className="flex items-center space-x-2">
                                    <p className="text-xs text-gray-500">{outfit?.isClaimed ? "Claimed" : 'Available'}</p>
                                    <div className="w-px h-4 bg-gray-300" />
                                    <CheckCheck className="text-[#d1a989] w-5 h-5" />
                                </div>

                                    : (
                                        <button
                                            className={`w-5 h-5 flex items-center justify-center rounded-full border ${selectedOutfit?.id === outfit?.id
                                                ? "bg-[#d1a989] border-[#d1a989]"
                                                : "border-gray-400"
                                                }`}
                                        >
                                            {selectedOutfit?.id === outfit?.id ? (
                                                <Check className="text-white w-3 h-3" />
                                            ) : (
                                                <Circle className="text-gray-400 w-3 h-3" />
                                            )}
                                        </button>
                                    )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleClaimOutfit}
                            disabled={!selectedOutfit?.id}
                            className={`flex-1 py-2.5 cursor-pointer rounded-md text-white text-sm font-medium ${selectedOutfit?.id
                                ? "bg-[#e7c0a1] hover:bg-[#d1a989]"
                                : "bg-gray-400 cursor-not-allowed"
                                } transition-all`}
                        >
                            Claim My Spot
                        </button>
                        <button className="flex-1 py-2.5 cursor-pointer border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-100"
                            onClick={() => {
                                setSelectedOutfit(null)
                            }}
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Footer Note */}
                    <p className="text-xs text-gray-500 mt-4">
                        This action will reserve the selected outfit for you. You’ll receive
                        an email confirmation if the claim is successful.
                    </p>
                </div>
            </div>
        </motion.div>
        <SignInSidebarForm
            isOpen={sidebarType==='signin'}
            isSubmitting={loading}
            onClose={() => setSidebarType("")}
            onSubmit={handleSignin}
            onSignUpClick={()=>setSidebarType('signup')}
        />
        <SignUpSidebarForm
            isOpen={sidebarType === 'signup'}
            onClose={() => setSidebarType('')}
            onSubmit={handleSignup}
            handleSubmitOtp={handleOtpSubmit}
            resendOTP={handleResend}
            step={step}
            setStep={setStep}
            isSubmitting={isSubmitting}
            onSignInClick={()=>setSidebarType('signin')}
        />
    </>
};

export default InvitePage;
