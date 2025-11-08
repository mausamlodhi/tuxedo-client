import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import PocketSquareCategory from "@/apiEndPoints/admin/pocketSquare.category";

interface BodyData {
  [key: string]: any;
}

export const PocketSquareCategoryServices = {
  getPocketSquareList: async (queryParams: BodyData): Promise<any> => {
    try {
      const payload = {
        ...PocketSquareCategory.list,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error as any, "");
      throw error;
    }
  },

  createPocketSquare: async (bodyData: BodyData): Promise<any> => {
    try {
      const payload = {
        ...PocketSquareCategory.create,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  pocketSquareDetails: async (id: number): Promise<any> => {
    try {
      const payload = {
        ...PocketSquareCategory.details(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  deletePocketSquare: async (id: number): Promise<any> => {
    try {
      const payload = {
        ...PocketSquareCategory.delete(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  updatePocketSquare: async (bodyData: BodyData, id: number): Promise<any> => {
    try {
      const payload = {
        ...PocketSquareCategory.update(id),
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
