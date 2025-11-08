import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import Collections from "@/apiEndPoints/admin/collections";

interface BodyData {
    [key: string]: any;
}

export const CollectionServices = {
    getCollectionsList: async (queryParams: BodyData): Promise<any> => {
        try {
            const payload = {
                ... Collections.list,
                queryParams,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error as any, "");
            throw error;
        }
    },

    createCollection: async (bodyData: BodyData): Promise<any> => {
        try {
            const payload = {
                ... Collections.create,
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    collectionDetails: async (id:number): Promise<any> => {
        try {
            const payload = {
                ... Collections.details(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteCollection: async (id:number): Promise<any> => {
        try {
            const payload = {
                ... Collections.delete(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    updateCollection: async (bodyData:BodyData,id:number): Promise<any> => {
        try {
            const payload = {
                ... Collections.update(id),
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
