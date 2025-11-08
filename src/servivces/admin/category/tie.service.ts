import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import TieCategory from "@/apiEndPoints/admin/tie.category";

interface BodyData {
    [key: string]: any;
}

export const TieCategoryServices = {
    getTieList: async (queryParams: BodyData): Promise<any> => {
        try {
            const payload = {
                ...TieCategory.list,
                queryParams,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error as any, "");
            throw error;
        }
    },

    createTie: async (bodyData: BodyData): Promise<any> => {
        try {
            const payload = {
                ...TieCategory.create,
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    tieDetails: async (id:number): Promise<any> => {
        try {
            const payload = {
                ...TieCategory.details(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteTie: async (id:number): Promise<any> => {
        try {
            const payload = {
                ...TieCategory.delete(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    updateTie: async (bodyData:BodyData,id:number): Promise<any> => {
        try {
            const payload = {
                ...TieCategory.update(id),
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
