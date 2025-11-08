import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import Formalwear from "@/apiEndPoints/admin/formalwear";

interface BodyData {
    [key: string]: any;
}

export const FormalwearServices = {
    getFormalwearList: async (queryParams: BodyData): Promise<any> => {
        try {
            const payload = {
                ... Formalwear.list,
                queryParams,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error as any, "");
            throw error;
        }
    },

    createFormalwear: async (bodyData: BodyData): Promise<any> => {
        try {
            const payload = {
                ... Formalwear.create,
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    FornalwearDetails: async (id:number): Promise<any> => {
        try {
            const payload = {
                ... Formalwear.details(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteFormalwear: async (id:number): Promise<any> => {
        try {
            const payload = {
                ... Formalwear.delete(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    updateFormalwear: async (bodyData:BodyData,id:number): Promise<any> => {
        try {
            const payload = {
                ... Formalwear.update(id),
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
