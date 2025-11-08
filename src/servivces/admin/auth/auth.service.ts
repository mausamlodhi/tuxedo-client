import logger from "@/utils/logger";
import Auth from "@/apiEndPoints/auth";
import APIrequest from "@/servivces/axios";
import { setCookie } from "cookies-next";
import { ADMIN_ROLE, CUSTOMER_ROLE, TOKEN_KEY } from "@/utils/env";
import { log } from "node:console";

interface BodyData {
  [key: string]: any;
}

export const AdminAuthServices = {
  adminLogin: async (bodyData: BodyData): Promise<any> => {
    try {
      const payload = {
        ...Auth.login,
        bodyData,
      };

      const res = await APIrequest(payload);
      
      

      if (res?.data?.accessToken && res.data.user.roleName) {
        setCookie(TOKEN_KEY, res.data.accessToken, {
          httpOnly: false, // can't be true in client
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24,
          path: "/",
        });

        if (res.data.user.roleName === "CUSTOMER") {
        setCookie(CUSTOMER_ROLE, "CUSTOMER", {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24,
        });
      } else if (res.data.user.roleName === "ADMIN") {
        setCookie(ADMIN_ROLE, "ADMIN", {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24,
        });
      }

    }
      return res;
    } 
    catch (error) {
      logger(error as any, "");
      throw error;
    }
  },

  adminSignUp: async (bodyData: BodyData): Promise<any> => {
    try {
      const payload = {
        ...Auth.signup,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  adminLogout: async (): Promise<any> => {
    try {
      const payload = {
        ...Auth.logout,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  getRoles: async (queryParams: BodyData): Promise<any> => {
    try {
      const payload = {
        ...Auth.getRoles,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
};
