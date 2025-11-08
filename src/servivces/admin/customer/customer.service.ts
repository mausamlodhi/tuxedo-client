import logger from "@/utils/logger";
import APIrequest from "@/servivces/axios";
import CustomerManagement from "@/apiEndPoints/admin/customer.management";

interface BodyData {
    [key: string]: any;
}

export const CustomerManagementServices = {
    getCustomerList: async (queryParams: BodyData): Promise<any> => {
        try {
            const payload = {
                ... CustomerManagement.list,
                queryParams,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error as any, "");
            throw error;
        }
    },

    createCustomer: async (bodyData: BodyData): Promise<any> => {
        try {
            const payload = {
                ... CustomerManagement.create,
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    CustomerDetails: async (id:number): Promise<any> => {
        try {
            const payload = {
                ... CustomerManagement.details(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteCustomer: async (id:number): Promise<any> => {
        try {
            const payload = {
                ... CustomerManagement.delete(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    updateCustomer: async (bodyData:BodyData,id:number): Promise<any> => {
        try {
            const payload = {
                ... CustomerManagement.update(id),
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
