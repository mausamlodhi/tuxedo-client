"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Image from "next/image";
import * as crypto from "crypto";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import logger from "@/utils/logger";
import { AdminAuthServices } from "@/servivces/admin/auth/auth.service";
import modalNotification from "@/utils/notification";
import { loginAction } from "../redux/slice/auth.slice";
import { setLocalStorageToken } from "@/utils";
import { ADMIN_ROLE_ID } from "@/utils/env";

interface LoginFormData {
  email: string;
  password: string;
}
interface LoginErrors {
  email?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const hashedPassword = crypto
        .createHash("sha256")
        .update(formData.password)
        .digest("hex");

      const response = await AdminAuthServices.adminLogin({
        email: formData.email,
        password: hashedPassword,
        roleId: ADMIN_ROLE_ID
      });

      if (response?.status) {
        modalNotification({
          message: response?.message || "Logged in successfully",
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
        router.push("/vipadmin/dashboard");
      }
    } catch (error) {
      logger("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(29,78,216,0.15),transparent),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.15),transparent)] animate-pulse"></div>

      <div className="relative w-full max-w-md p-6">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Logo + Title */}
          <div className="text-center mb-8">
            <Image
              src="/assets/SVG/icons/footer-logo.png"
              alt="Logo"
              width={65}
              height={80}
              className="mx-auto mb-3"
            />
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-slate-400 text-sm">
              Welcome back! Sign in to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 outline-none focus:ring-2 ${
                    errors.email
                      ? "border border-red-500 focus:ring-red-500"
                      : "border border-slate-600 focus:ring-blue-500"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 outline-none focus:ring-2 ${
                    errors.password
                      ? "border border-red-500 focus:ring-red-500"
                      : "border border-slate-600 focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded accent-blue-500"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          © 2025 VIP Formal Wear. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
