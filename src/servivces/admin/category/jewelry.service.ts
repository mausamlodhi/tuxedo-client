import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import StudsCufflinksCategory from "@/apiEndPoints/admin/studsCufflinks.category";

interface BodyData {
  [key: string]: any;
}

export const StudsCufflinksCategoryServices = {
  getStudsCufflinksList: async (queryParams: BodyData): Promise<any> => {
    try {
      const payload = {
        ...StudsCufflinksCategory.list,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error as any, "");
      throw error;
    }
  },
  "getStuds&CufflinksList": async (queryParams: BodyData): Promise<any> => {
    try {
      const payload = {
        ...StudsCufflinksCategory.list,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error as any, "");
      throw error;
    }
  },

  createstudsCufflinks: async (bodyData: BodyData): Promise<any> => {
    try {
      const payload = {
        ...StudsCufflinksCategory.create,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  studsCufflinksDetails: async (id: number): Promise<any> => {
    try {
      const payload = {
        ...StudsCufflinksCategory.details(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  deleteStudsCufflinks: async (id: number): Promise<any> => {
    try {
      const payload = {
        ...StudsCufflinksCategory.delete(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  updateStudsCufflinks: async (
    bodyData: BodyData,
    id: number
  ): Promise<any> => {
    try {
      const payload = {
        ...StudsCufflinksCategory.update(id),
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
