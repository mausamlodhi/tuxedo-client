import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import PantCategory from "@/apiEndPoints/admin/pant.category";

interface BodyData {
    [key: string]: any;
}

export const PantCategoryServices = {
    getPantList: async (queryParams: BodyData): Promise<any> => {
        try {
            const payload = {
                ...PantCategory.list,
                queryParams,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error as any, "");
            throw error;
        }
    },

    createPant: async (bodyData: BodyData): Promise<any> => {
        try {
            const payload = {
                ...PantCategory.create,
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    pantDetails: async (id:number): Promise<any> => {
        try {
            const payload = {
                ...PantCategory.details(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deletePant: async (id:number): Promise<any> => {
        try {
            const payload = {
                ...PantCategory.delete(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    updatePant: async (bodyData:BodyData,id:number): Promise<any> => {
        try {
            const payload = {
                ...PantCategory.update(id),
                bodyData
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
};
