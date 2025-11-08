import logger from "@/utils/logger";
import APIrequest from "../axios";
import Auth from "@/apiEndPoints/auth";
import { setCookie } from "cookies-next";
import { ADMIN_ROLE, CUSTOMER_ROLE, TOKEN_KEY } from "@/utils/env";

interface BodyData {
  [key: string]: any;
}

export const UserAuthServices = {
  userLogin: async (bodyData: BodyData): Promise<any> => {
    try {
      const payload = {
        ...Auth.login,
        bodyData,
      };
      const res = await APIrequest(payload);
      if (res?.data?.accessToken && res.data.user.roleName) {
        setCookie(TOKEN_KEY, res.data.accessToken, {
          httpOnly: false,
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
    } catch (error) {
      logger(error as any, "");
      throw error;
    }
  },

  userSignUp: async (bodyData: BodyData): Promise<any> => {
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

  verifyOTP: async (bodyData: BodyData): Promise<any> => {
    try {
      const payload = {
        ...Auth.verifyEmail,
        bodyData,
      };
      const res = await APIrequest(payload);
      if (res?.data?.accessToken && res.data?.user?.roleName) {
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
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24,
          });
        } else if (res.data.user.roleName === "ADMIN") {
          setCookie(ADMIN_ROLE, "ADMIN", {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24,
          });
        }

      }
      return res;
    } catch (error) {
      logger(error as any, "");
      throw error;
    }
  },

  forgotPassword: async (bodyData: BodyData): Promise<any> => {
    try {
      const payload = {
       ...Auth.forgotPassword,
      bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    }
    catch (error) {
      logger(error);
      throw error;
    }
  },

  resendEmail:async (bodyData: BodyData): Promise<any> => {
    try {
    const payload={
      ...Auth.resendEmail,
      bodyData,
    }
    const res = await APIrequest(payload);
      return res;
    }catch(error){
      logger(error);
    }
  },

  resetPassword:async (bodyData: BodyData): Promise<any> => {
    try {
      const payload={
        ...Auth.resetPassword,
        bodyData,
      }
      const res = await APIrequest(payload);
      return res;
    }catch(error){
      logger(error);
    }

  },

  handleGetCustomerStatus : async (bodyData: BodyData): Promise<any> => {
    try {
      const payload = {
        ...Auth.getCustomerDetails,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  handleCreateOrder : async(bodyData:BodyData): Promise<any> =>{
    try{
      const payload = {
        ...Auth.createOrder,
        bodyData
      };
      const res = await APIrequest(payload);
      return res ;
    }catch(error){
      logger(error);
      throw error
    }
  },

  sendEventInvitation : async(bodyData:BodyData):Promise<any> =>{
    try{
      const payload = {
        ...Auth.eventInvitation,
        bodyData
      };
      const resposne = await APIrequest(payload);
      return resposne;
    }catch(error){
      logger('Getting error while sending an invitaion : ',error);
      throw error;
    }
  },

  getInvitedEventDetails : async(id:string):Promise<any> =>{
    try{
      const payload = {
        ...Auth.invitedEvent(id)
      };
      const response = await APIrequest(payload);
      return response;
    }catch(error){
      logger('Error while fetching Invited event details : ',error);
      throw error;
    }
  }

};




