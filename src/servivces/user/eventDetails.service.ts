import logger from "@/utils/logger";
import APIrequest from "../axios";
import EventDetails from "@/apiEndPoints/eventDetails";
import { get } from "http";

interface BodyData {
  [key: string]: any;
}

export const EventDetailsServices = {
  createEvent: async (bodyData: BodyData): Promise<any> => {
    try {
      const payload = {
        ...EventDetails.create,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error as any, "Create Event Error");
      throw error;
    }
  },

  getEventById: async (id: number): Promise<any> => {
    try {
      const payload = {
        ...EventDetails.getEventById,
        url: EventDetails.getEventById.url.replace(":id", id.toString()),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error as any, "Get Event By ID Error");
      throw error;
    }
  },

  getOutfits: async (): Promise<any> => {
    try{
      const payload = {
        ...EventDetails.getOutfits,
      };
      const res = await APIrequest(payload);
      return res;
    }catch(error){
      logger(error as any, "Get Outfits Error");
      throw error;
    }
  },

    getEvents: async (): Promise<any> => {
    try{
      const payload = {
        ...EventDetails.getEvents,
      };
      const res = await APIrequest(payload);
      return res;
    }catch(error){
      logger(error as any, "Get Events Error");
      throw error;
    }
  },

  saveCustomerMeasurement: async(bodyData:BodyData): Promise<any> =>{
    try{
      const payload = {
        ...EventDetails.saveMeasurement,
        bodyData
      };
      const response = await APIrequest(payload);
      return response;
    }catch(error){
      logger("Error while creating customer's measurement : ",error);
      throw error;
    }
  }

};

