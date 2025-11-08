import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import CoatCategory from "@/apiEndPoints/admin/coat.category";

interface BodyData {
    [key: string]: any;
}

export const CoatCategoryServices = {
    getCoatList: async (queryParams: BodyData): Promise<any> => {
        try {
            const payload = {
                ...CoatCategory.list,
                queryParams,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error as any, "");
            throw error;
        }
    },

    createCoat: async (bodyData: BodyData): Promise<any> => {
        try {
            const payload = {
                ...CoatCategory.create,
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    coatDetails: async (id:number): Promise<any> => {
        try {
            const payload = {
                ...CoatCategory.details(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteCoat: async (id:number): Promise<any> => {
        try {
            const payload = {
                ...CoatCategory.delete(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    updateCoat: async (bodyData:BodyData,id:number): Promise<any> => {
        try {
            const payload = {
                ...CoatCategory.update(id),
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
