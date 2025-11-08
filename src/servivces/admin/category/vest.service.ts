import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import VestCategory from "@/apiEndPoints/admin/vest.category";

interface BodyData {
  [key: string]: any;
}

export const VestCategoryServices = {
  getVestList: async (queryParams: BodyData): Promise<any> => {
    try {
      const payload = {
        ...VestCategory.list,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error as any, "");
      throw error;
    }
  },

  createVest: async (bodyData: BodyData): Promise<any> => {
    try {
      const payload = {
        ...VestCategory.create,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  vestDetails: async (id: number): Promise<any> => {
    try {
      const payload = {
        ...VestCategory.details(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  deleteVest: async (id: number): Promise<any> => {
    try {
      const payload = {
        ...VestCategory.delete(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  updateVest: async (bodyData: BodyData, id: number): Promise<any> => {
    try {
      const payload = {
        ...VestCategory.update(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  "getVest&CummerbundList": async (queryParams: BodyData): Promise<any> => {
    try {
      const payload = {
        ...VestCategory.list,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error as any, "");
      throw error;
    }
  },
};
