import logger from "@/utils/logger";
import APIrequest from "../axios";
import Outfit from "@/apiEndPoints/user/outfit";

interface BodyData {
  [key: string]: any;
}

export const outfitServices = {
  getOutfitList: async (queryParams: BodyData): Promise<any> => {
    try {
      const payload = { ...Outfit.list };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error as any, "");
      throw error;
    }
  },
  createOutfit: async (bodyData: BodyData): Promise<any> => {
    try {
      const payload = { ...Outfit.create, bodyData };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  outfitDetails: async (id: number): Promise<any> => {
    try {
      const payload = { ...Outfit.details(id) };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateOutfit: async (bodyData: BodyData, id: number): Promise<any> => {
    try {
      const payload = { ...Outfit.update(id), bodyData };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  deleteOutfit: async (id: number): Promise<any> => {
    try {
      const payload = { ...Outfit.delete(id) };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
};
