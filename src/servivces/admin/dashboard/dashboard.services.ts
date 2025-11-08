
import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import Dashboard  from "@/apiEndPoints/admin/dashboard"

interface BodyData {
    [key: string]: any;
}

export const DashboardServices = {
    getTotalCustomers: async (queryParams: BodyData): Promise<any> => {
        try {
            const payload = {
                ... Dashboard.totalCustomers,
                queryParams,
        }

            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error as any, "");
            throw error;
        }
    }
}
