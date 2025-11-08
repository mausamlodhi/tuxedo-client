
export const DEV_ENVIRONMENT = process.env.NEXT_PUBLIC_DEV_ENV || "development";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050/api/v1/";

export const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY ||"%t45434%&@ftg645435_vip@5345dg_forrmal"

export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "$"

export const ADMIN_ROLE = process.env.NEXT_PUBLIC_ADMIN_ROLE || "ADMIN"

export const CUSTOMER_ROLE = process.env.NEXT_PUBLIC_CUSTOMER_ROLE || "CUSTOMER"

export const PER_PAGE_LIMIT = parseInt(process.env.NEXT_PUBLIC_PER_PAGE_LIMIT || "10")

export const OTP_TIMER_DURATION = parseInt(process.env.NEXT_PUBLIC_OTP_TIMER_DURATION || "120", 120);

export const TINY_APP_KEY = process.env.NEXT_PUBLIC_TINY_KEY || "";

export const GOOGLE_STUDIO_KEY = process.env.NEXT_PUBLIC_GOOGLE_AI || "";

export const MAX_HISTORY = parseInt(process.env.NEXT_PUBLIC_MAX_HISTORY || "30");

export const ADMIN_ROLE_ID = parseInt(process.env.NEXT_PUBLIC_ADMIN_ROLE_ID || "1");

export const CUSTOMER_ROLE_ID = parseInt(process.env.NEXT_PUBLIC_CUSTOMER_ROLE_ID || "2");