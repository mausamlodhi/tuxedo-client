"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { UserAuthServices } from "@/servivces/user/auth.service";
import logger from "@/utils/logger";
import { useDispatch } from "react-redux";
import { addInvitedEventDetails } from "@/app/redux/slice/invited-event.slice";
import { formatDate } from "@/utils";

interface EventDetails {
  eventName?: string;
  eventDate?: string | null;
  [key: string]: any;
}

export default function InvitePage(){
  const router = useRouter();
  const params = useParams();
  const refrenceId = params.id;
  const dispatch = useDispatch();
  const [eventDetails,setEventDetails] = useState<EventDetails>({});
  const getEventDetails = async()=>{
    const response = await UserAuthServices.getInvitedEventDetails(refrenceId as string);
    if(response?.status){
      setEventDetails(response?.data);
      dispatch(addInvitedEventDetails(response?.data));
    }
  };

  useEffect(()=>{
    if(refrenceId){
      getEventDetails();
    }
  },[refrenceId])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="min-h-screen flex flex-col md:flex-row bg-white">
        {/* Left Section (Image) */}
        <div className="md:w-1/2 w-full relative h-[60vh] md:h-screen flex items-center justify-center">
          <Image
            src="/assets/images/vip-banner.jpg"
            alt="Wedding Invite Image"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right Section (Invite Content) */}
        <div className="md:w-1/2 w-full flex items-center justify-center p-8">
          <div className="bg-white border border-gray-200 shadow-md rounded-xl p-8 w-full max-w-md">
            <p className="text-gray-600 text-sm mb-2">
              You’ve been invited to the
            </p>
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
              {eventDetails?.eventName}
            </h1>

            <div className="flex items-center text-gray-700 mb-6">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="text-sm">Date: {formatDate(eventDetails?.eventDate)}</span>
            </div>

            <button className="bg-gray-900 text-white py-3 cursor-pointer rounded-md w-full font-medium hover:bg-gray-800 transition-all"
              onClick={()=>{
                router.push('/participant/claim-participant')
              }}
            >
              Get Started
            </button>

            <div className="flex items-center mt-4 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
              This should only take about 2 min.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

