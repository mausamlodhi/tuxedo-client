import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import Inventory from "@/apiEndPoints/admin/inventory";

interface QueryParams {
    [key: string]: any;
}

export const InventoryServices = {
    getInventoryList: async (queryParams: QueryParams): Promise<any> => {
        try {
            const payload = {
                ...Inventory.list,
                queryParams,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error as any, "");
            throw error;
        }
    }
};
