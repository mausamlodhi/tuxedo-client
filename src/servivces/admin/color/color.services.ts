import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import Color from "@/apiEndPoints/admin/color";

interface QueryParams {
    [key: string]: any;
}

export const ColorServices = {
    getColorList: async (queryParams: QueryParams): Promise<any> => {
        try {
            const payload = {
                ...Color.list,
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
