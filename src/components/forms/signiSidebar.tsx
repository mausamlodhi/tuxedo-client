"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";

interface SignInSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; password: string }) => void;
  onSignUpClick?: () => void;
  isSubmitting: boolean;
}

const SignInSidebarForm: React.FC<SignInSidebarProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSignUpClick,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="signin-sidebar"
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

          {/* Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            <motion.form
              key="signin-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              <h2 className="text-lg font-semibold text-gray-800 text-start">
                Welcome Back
              </h2>
              <p className="cursor-pointer text-sm text-gray-600 mb-2">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onSignUpClick}
                  className="text-[#e7c0a1] cursor-pointer font-medium hover:none"
                >
                  Sign Up
                </button>
              </p>

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
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 text-sm py-2 pr-8 focus:border-[#e7c0a1] outline-none"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 text-xs px-2"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right text-sm">
                <button
                  type="button"
                  className="text-[#e7c0a1] hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.97 }}
                whileHover={!isSubmitting ? { scale: 1.03 } : {}}
                className={`mt-4 h-[40px] flex items-center justify-center gap-2 text-white py-2 font-semibold tracking-wide shadow transition rounded
                ${
                  isSubmitting
                    ? "bg-[#d8b79b] cursor-not-allowed"
                    : "bg-[#e7c0a1] hover:shadow-md"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </motion.button>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="px-3 text-gray-400 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              {/* Social Sign In */}
              <div className="flex flex-col gap-3">
                <button className="w-full flex items-center justify-center px-2 py-1.5 lg:px-4 lg:py-2.5 border border-gray-300 bg-black text-white hover:bg-gray-900 transition duration-200 cursor-pointer">
                  <Image
                    src="/assets/SVG/icons/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  <span className="font-advent text-xs lg:text-sm ms-4">
                    Sign in with Google
                  </span>
                </button>

                <button className="w-full flex items-center justify-center px-2 py-1.5 lg:px-4 lg:py-2.5 bg-blue-600 hover:bg-blue-700 text-white transition duration-200 cursor-pointer">
                  <Image
                    src="/assets/SVG/icons/facebook.svg"
                    alt="Facebook"
                    width={20}
                    height={20}
                  />
                  <span className="font-advent text-xs lg:text-sm ms-4">
                    Sign in with Facebook
                  </span>
                </button>
              </div>
            </motion.form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignInSidebarForm;
