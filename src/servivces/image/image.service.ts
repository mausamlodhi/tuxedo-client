import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import Color from "@/apiEndPoints/admin/color";
import Image from "@/apiEndPoints/image";

interface BodyData {
    [key: string]: any;
}

export const ImageServices = {
    uploadImage: async (bodyData: BodyData): Promise<any> => {
        try {
            const payload = {
                ...Image.add,
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error as any, "");
            throw error;
        }
    }
};
