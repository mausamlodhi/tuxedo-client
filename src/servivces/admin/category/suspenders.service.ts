import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import SuspendersCategory from "@/apiEndPoints/admin/suspenders.category";

interface BodyData {
  [key: string]: any;
}

export const SuspendersCategoryServices = {
  getSuspendersList: async (queryParams: BodyData): Promise<any> => {
    try {
      const payload = {
        ...SuspendersCategory.list,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error as any, "");
      throw error;
    }
  },

  createSuspenders: async (bodyData: BodyData): Promise<any> => {
    try {
      const payload = {
        ...SuspendersCategory.create,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  suspendersDetails: async (id: number): Promise<any> => {
    try {
      const payload = {
        ...SuspendersCategory.details(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  deleteSuspenders: async (id: number): Promise<any> => {
    try {
      const payload = {
        ...SuspendersCategory.delete(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  updateSuspenders: async (bodyData: BodyData, id: number): Promise<any> => {
    try {
      const payload = {
        ...SuspendersCategory.update(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
};
