import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import SocksCategory from "@/apiEndPoints/admin/socks.category";

interface BodyData {
  [key: string]: any;
}

export const SocksCategoryServices = {
  getSocksList: async (queryParams: BodyData): Promise<any> => {
    try {
      const payload = {
        ...SocksCategory.list,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error as any, "");
      throw error;
    }
  },

  createSocks: async (bodyData: BodyData): Promise<any> => {
    try {
      const payload = {
        ...SocksCategory.create,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  shocksDetails: async (id: number): Promise<any> => {
    try {
      const payload = {
        ...SocksCategory.details(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  deleteSocks: async (id: number): Promise<any> => {
    try {
      const payload = {
        ...SocksCategory.delete(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  updateSocks: async (bodyData: BodyData, id: number): Promise<any> => {
    try {
      const payload = {
        ...SocksCategory.update(id),
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
