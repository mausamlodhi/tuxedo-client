"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import logger from "@/utils/logger";

interface SidebarFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: any) => void;
    onSignInClick?: () => void;
    step: number;
    setStep: (num:any)=> void;
    handleSubmitOtp : (data:any)=>void;
    resendOTP : () => void;
    isSubmitting: boolean;
}

const SignUpSidebarForm: React.FC<SidebarFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    onSignInClick,
    setStep,
    step,
    isSubmitting,
    handleSubmitOtp,
    resendOTP
}) => {
    const [otp, setOtp] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        image: null as File | null,
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [previewImage, setPreviewImage] = useState<string>("");
    const [timer, setTimer] = useState(60);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === "image" && files && files[0]) {
            const file = files[0];
            setFormData({ ...formData, image: file });
            setPreviewImage(URL.createObjectURL(file));
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format.";
        if (!formData.password.trim()) newErrors.password = "Password is required.";
        if (formData.password.length < 6)
            newErrors.password = "Password must be at least 6 characters.";
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSubmit(formData)        
        console.log("OTP sent to:", formData);
    };

    const handleOtpVerify = (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            setErrors({ otp: "Please enter a valid 6-digit OTP." });
            return;
        }

        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) form.append(key, value as any);
        });
        handleSubmitOtp({otp:otp})
    };

    const handleResendOtp = async () => {
        try {
            resendOTP()

            setTimer(600);
            setOtp("");
        } catch (error) {
            console.error("Failed to resend OTP:", error);
        }
    };

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="signup-sidebar"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 80, damping: 20 }}
                    className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-xl z-50 flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4">
                        <Image
                            src="/assets/SVG/icons/logo.svg"
                            alt="Logo"
                            width={60}
                            height={40}
                            className="object-contain"
                        />
                        <button
                            onClick={onClose}
                            className="p-2 rounded hover:bg-gray-100 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex justify-center items-center gap-3 py-4 text-sm font-medium">
                        <div
                            className={`flex items-center gap-2 ${step === 1 ? "text-[#e7c0a1]" : "text-gray-400"
                                }`}
                        >
                            <span
                                className={`w-6 h-6 flex items-center justify-center rounded-full border ${step === 1 ? "border-[#e7c0a1]" : "border-gray-300"
                                    }`}
                            >
                                1
                            </span>
                            Sign Up
                        </div>
                        <div className="h-px bg-gray-300 w-8" />
                        <div
                            className={`flex items-center gap-2 ${step === 2 ? "text-[#e7c0a1]" : "text-gray-400"
                                }`}
                        >
                            <span
                                className={`w-6 h-6 flex items-center justify-center rounded-full border ${step === 2 ? "border-[#e7c0a1]" : "border-gray-300"
                                    }`}
                            >
                                2
                            </span>
                            Verify OTP
                        </div>
                    </div>

                    {/* Stepper Content */}
                    <div className="p-6 flex-1 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.form
                                    key="signup-step"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleSignupSubmit}
                                    className="flex flex-col gap-4"
                                >
                                    <h2 className="text-lg font-semibold text-gray-800 text-start">
                                        Create Your Account
                                    </h2>

                                    <p className="text-start text-sm text-gray-600">
                                        Already have an account?{" "}
                                        <button
                                            type="button"
                                            onClick={onSignInClick}
                                            className="text-[#e7c0a1] cursor-pointer font-medium "
                                        >
                                            Sign In
                                        </button>
                                    </p>
                                    <br />
                                    {/* First & Last Name */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1">
                                            <input
                                                name="firstName"
                                                type="text"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full border-b border-gray-300 text-sm py-2 focus:border-[#e7c0a1] outline-none"
                                                placeholder="Enter first name"
                                            />
                                            {errors.firstName && (
                                                <p className="text-red-500 text-xs">{errors.firstName}</p>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <input
                                                name="lastName"
                                                type="text"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full border-b border-gray-300 text-sm py-2 focus:border-[#e7c0a1] outline-none"
                                                placeholder="Enter last name"
                                            />
                                            {errors.lastName && (
                                                <p className="text-red-500 text-xs">{errors.lastName}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full border-b border-gray-300 text-sm py-2 focus:border-[#e7c0a1] outline-none"
                                            placeholder="Enter your email"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <input
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full border-b border-gray-300 text-sm py-2 focus:border-[#e7c0a1] outline-none"
                                            placeholder="Enter password"
                                        />
                                        {errors.password && (
                                            <p className="text-red-500 text-xs">{errors.password}</p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full border-b border-gray-300 text-sm py-2 focus:border-[#e7c0a1] outline-none"
                                            placeholder="Confirm password"
                                        />
                                        {errors.confirmPassword && (
                                            <p className="text-red-500 text-xs">
                                                {errors.confirmPassword}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            name="phone"
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/\D/g, "");
                                                if (value.length > 10) value = value.slice(0, 10);

                                                let formatted = value;
                                                if (value.length > 6) {
                                                    formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
                                                } else if (value.length > 3) {
                                                    formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                                                } else if (value.length > 0) {
                                                    formatted = `(${value}`;
                                                }

                                                setFormData({ ...formData, phone: formatted });
                                            }}
                                            placeholder="(123) 456-7890"
                                            className={`w-full border-b text-sm py-2 outline-none ${errors.phone ? "border-red-500" : "border-gray-300 focus:border-[#e7c0a1]"
                                                }`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 mb-2 block">
                                            Profile Image
                                        </label>
                                        <div className="flex items-center gap-4">
                                            {previewImage && (<Image src={previewImage} alt="Profile Preview" width={50} height={50} className="rounded-full border" />
                                            )}
                                            <input name="image" type="file" accept="image/*" onChange={handleChange} className="text-sm" />
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileTap={{ scale: 0.97 }}
                                        className="mt-6 disabled:cursor-pointer bg-[#e7c0a1] h-[40px] cursor-pointer text-white py-2 font-semibold tracking-wide shadow hover:shadow-md transition"
                                    >
                                        Continue
                                    </motion.button>
                                    <div className="flex items-center my-4">
                                        <div className="flex-1 h-px bg-gray-300" />
                                        <span className="px-3 text-gray-400 text-sm">OR</span>
                                        <div className="flex-1 h-px bg-gray-300" />
                                    </div>

                                    {/* Social Signup */}
                                    <div className="flex flex-col gap-3">
                                        <button
                                            className="w-full cursor-pointer flex items-center justify-center px-2 py-1.5 lg:px-4 lg:py-2.5 border border-gray-300 bg-black text-white hover:bg-gray-900 transition duration-200"
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
                                            className="w-full flex cursor-pointer items-center justify-center px-2 py-1.5 lg:px-4 lg:py-2.5 bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
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
                                </motion.form>
                            )}

                            {step === 2 && (
                                <motion.form
                                    key="otp-step"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleOtpVerify}
                                    className="flex flex-col gap-4"
                                >
                                    <h2 className="text-lg font-semibold text-gray-800">Verify Your Email</h2>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Enter the 6-digit OTP sent to your email address.
                                    </p>

                                    {/* OTP Input */}
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full border-b border-gray-300 text-center text-lg tracking-widest py-2 focus:border-[#e7c0a1] outline-none"
                                        placeholder="______"
                                    />
                                    {errors.otp && (
                                        <p className="text-red-500 text-xs text-center">{errors.otp}</p>
                                    )}

                                    {/* Timer & Resend */}
                                    <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-600">
                                        {timer > 0 ? (
                                            <span>
                                                Resend OTP in{" "}
                                                <span className="text-[#e7c0a1] font-semibold">
                                                    {Math.floor(timer / 60)
                                                        .toString()
                                                        .padStart(2, "0")}
                                                    :
                                                    {(timer % 60).toString().padStart(2, "0")}
                                                </span>
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                className="text-[#e7c0a1] font-medium hover:underline cursor-pointer"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex justify-between mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="text-sm text-gray-500 cursor-pointer hover:underline"
                                        >
                                            ← Back
                                        </button>

                                        <motion.button
                                            type="submit"
                                            whileTap={{ scale: 0.97 }}
                                            className="bg-[#e7c0a1] text-white cursor-pointer py-2 px-6 font-semibold h-[45px] hover:shadow-md transition"
                                        >
                                            Verify OTP
                                        </motion.button>
                                    </div>
                                </motion.form>

                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SignUpSidebarForm;
