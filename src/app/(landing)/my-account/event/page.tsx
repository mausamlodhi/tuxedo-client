"use client";
import React, { useEffect, useState } from "react";
import SelectField from "@/components/common/selectField";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { EventDetailsServices } from "@/servivces/user/eventDetails.service";
import modalNotification from "@/utils/notification";
import Builder from "@/components/common/builderComponent";
import logger from "@/utils/logger";
import { Layers } from "lucide-react";
import { updateAllLayers } from "@/hooks/useLayers";
import BuilderListComponent from "@/components/common/builderListComponent";
import { form } from "framer-motion/m";
import { formatDate, getLayerData } from "@/utils";

type EventCardProps = {
  image: string;
  date: string;
};

const EventPage: React.FC = () => {
  const userName = useSelector((state: any) => state.auth?.user?.name);
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [eventOutfitLayers, setEventOutfitLayers] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  const eventOptions = [
    { value: "owned", label: "Owned Events" },
    { value: "shared", label: "Shared Events" },
    { value: "all", label: "All Events" },
  ];

  const handleChange = (value: string) => {
    console.log("Selected value:", value);
  };

  const initialValues = { eventType: "owned" };
  const validationSchema = Yup.object({
    eventType: Yup.string().required("Please select an event"),
  });

  const getAllEvents = async () => {
    setLoading(true);
    try {
      const res = await EventDetailsServices.getEvents();
      if (res?.results?.length) {
        setEvents(res.results);
        for (const event of res.results) {
          const layerData = await getLayerData(event.outfits?.[0]);
          let singleLyerData = Object.values(layerData).flat();
          setEventOutfitLayers((prev) => [...prev, singleLyerData]);
        }
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.log("Error fetching events", error);
      modalNotification({
        type: "error",
        message: "Failed to load events.",
      });
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      getAllEvents();
    }, []);

    return (
      <div className="w-full max-w-4xl mx-auto gap-3">
        {/* Header */}
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-advent mb-2 whitespace-nowrap">
            Events
          </h2>
        </div>

        {/* Select section */}
        <div className="max-w-3xl mb-8">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={() => { }}
          >
            {({ values }) => {
              useEffect(() => {
                handleChange(values.eventType);
              }, [values.eventType]);

              return (
                <Form>
                  <div className="w-full sm:w-80">
                    <SelectField
                      name="eventType"
                      options={eventOptions}
                      placeholder="Select an event"
                      bgColor="#ffffff"
                      textColor="#000000"
                      borderColor="#CBD5E1"
                      menuBgColor="#ffffff"
                      optionSelectedBg="#E2E8F0"
                      optionHoverBg="#F1F5F9"
                      disabled={false}
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>

        {/* Main Content: Loading / Empty / Events */}
        <div className="flex flex-wrap justify-between gap-y-6 w-full max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center justify-center py-20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-10 h-10 border-4 border-[#D6A680] border-t-transparent rounded-full mb-4"
                />
                <p className="text-gray-500 font-advent text-sm">Loading events...</p>
              </motion.div>
            ) : events.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex flex-col items-center justify-center py-20"
              >
                {/* <Image
                src="/assets/SVG/icons/empty.svg"
                alt="No events"
                width={100}
                height={100}
                className="opacity-80 mb-4"
              /> */}
                <h3 className="text-lg font-semibold font-advent text-gray-700">
                  No Events Found
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  Try creating or joining an event to see it listed here.
                </p>
              </motion.div>
            ) : (
              events.map((event: any, index) => {
                return <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-4 w-full sm:w-[48%] bg-white gap-4 shadow-sm rounded hover:shadow-md transition"
                >
                  <BuilderListComponent
                    layers={eventOutfitLayers[index] || []}
                    setShowCustomizer={(flag: boolean) => logger("Show customizer", flag)}
                  />

                  <div className="flex flex-col justify-between flex-1">
                    <h3 className="text-lg font-semibold">
                      {event?.eventName}
                    </h3>

                    <div className="flex items-center text-gray-600 mt-1">
                      <Image
                        src="/assets/SVG/icons/calendar.svg"
                        alt="Date"
                        width={16}
                        height={16}
                        className="mr-2"
                      />
                      <span>{formatDate(event?.eventDate)}</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-3 border-2 border-[#D6A680] text-[#D6A680] px-3 py-1 w-fit hover:bg-[#d4a373] hover:text-white transition"
                    >
                      VIEW EVENT
                    </motion.button>
                  </div>
                </motion.div>
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  export default EventPage;
