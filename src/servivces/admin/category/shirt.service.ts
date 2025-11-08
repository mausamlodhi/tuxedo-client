import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import ShirtCategory from "@/apiEndPoints/admin/shirt.category";

interface BodyData {
    [key: string]: any;
}

export const ShirtCategoryServices = {
    getShirtList: async (queryParams: BodyData): Promise<any> => {
        try {
            const payload = {
                ...ShirtCategory.list,
                queryParams,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error as any, "");
            throw error;
        }
    },

    createShirt: async (bodyData: BodyData): Promise<any> => {
        try {
            const payload = {
                ...ShirtCategory.create,
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    shirtDetails: async (id:number): Promise<any> => {
        try {
            const payload = {
                ...ShirtCategory.details(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteShirt: async (id:number): Promise<any> => {
        try {
            const payload = {
                ...ShirtCategory.delete(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    updateShirt: async (bodyData:BodyData,id:number): Promise<any> => {
        try {
            const payload = {
                ...ShirtCategory.update(id),
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
