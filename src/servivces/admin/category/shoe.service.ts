import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import ShoeCategory from "@/apiEndPoints/admin/shoe.category";

interface BodyData {
    [key: string]: any;
}

export const ShoeCategoryServices = {
    getShoeList: async (queryParams: BodyData): Promise<any> => {
        try {
            const payload = {
                ...ShoeCategory.list,
                queryParams,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error as any, "");
            throw error;
        }
    },

    createShoe: async (bodyData: BodyData): Promise<any> => {
        try {
            const payload = {
                ...ShoeCategory.create,
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    shoeDetails: async (id:number): Promise<any> => {
        try {
            const payload = {
                ...ShoeCategory.details(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteshoe: async (id:number): Promise<any> => {
        try {
            const payload = {
                ...ShoeCategory.delete(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    updateShoe: async (bodyData:BodyData,id:number): Promise<any> => {
        try {
            const payload = {
                ...ShoeCategory.update(id),
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
