import logger from "@/utils/logger";
import APIrequest from "../axios";
import ContactUs from "@/apiEndPoints/user/contactUs";

interface BodyData {
  [key: string]: any;
}

export const contactUsServices = {
  getContactUsList: async (queryParams: BodyData): Promise<any> => {
    try {
      const payload = { ...ContactUs.list };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error as any, "");
      throw error;
    }
  },
  createContactUs: async (bodyData: BodyData): Promise<any> => {
    try {
      const payload = { ...ContactUs.create, bodyData };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  contactUsDetails: async (id: number): Promise<any> => {
    try {
      const payload = { ...ContactUs.details(id) };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateContactUs: async (bodyData: BodyData, id: number): Promise<any> => {
    try {
      const payload = { ...ContactUs.update(id), bodyData };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  deleteContactUs: async (id: number): Promise<any> => {
    try {
      const payload = { ...ContactUs.delete(id) };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
};
