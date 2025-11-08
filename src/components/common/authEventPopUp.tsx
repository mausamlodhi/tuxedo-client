
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { updateEventData } from "@/app/redux/slice/auth.slice";
import { EventDetailsServices } from "@/servivces/user/eventDetails.service";
import modalNotification from "@/utils/notification";
import { occasionRoles, occasions } from '@/utils/constant';
import { CustomerManagementServices } from "@/servivces/admin/customer/customer.service";
import { RootState } from "@/app/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface PopupProps {
  type: "auth" | "event";
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
  eventData?: {
    firstName: string;
    lastName: string;
    eventName: string;
    eventDate: string;
    ownerRole: string;
    occasion?: string;
    totalPrice?: number;
  };
  onEventDataChange?: (data: any) => void;
}

const AuthEventPopUp: React.FC<PopupProps> = ({
  type,
  isOpen,
  onClose,
  eventData = {
    firstName: "",
    lastName: "",
    eventName: "",
    eventDate: "",
    ownerRole: "",
    occasion: "Wedding",
    totalPrice: 0
  },
  onEventDataChange
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  const present = useSelector((state: RootState) => state.lookBuilder.present) as any;
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && auth?.user) {
      onEventDataChange?.({
        ...eventData,
        firstName: eventData.firstName || auth.user.firstName || "",
        lastName: eventData.lastName || auth.user.lastName || "",
      });
    }
  }, [isOpen, auth?.user]);



  const priceType = searchParams.get("price_type");
  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    if (!eventData.eventName?.trim())
      newErrors.eventName = "Event name is required.";
    if (!eventData.firstName?.trim())
      newErrors.firstName = "First name is required.";
    if (!eventData.lastName?.trim())
      newErrors.lastName = "Last name is required.";
    if (!eventData.eventDate)
      newErrors.eventDate = "Event date is required.";
    if (!eventData.occasion)
      newErrors.occasion = "Please select an occasion.";
    if (!eventData.firstName)
      newErrors.customer = "Please select a customer for this outfit.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateEvent = async () => {
    if (!validateFields()) return;
    try {
      const userId = auth?.user?.id;
      const outfitData = {
        coatId: present?.Coat?.[0]?.id || null,
        pantId: present?.Pant?.[0]?.id || null,
        shirtId: present?.Shirt?.[0]?.id || null,
        tieId: present?.Tie?.[0]?.id || null,
        vestId: present?.Vest?.[0]?.id || null,
        shoeId: present?.Shoe?.[0]?.id || null,
        socksId: present?.Socks?.[0]?.id || null,
        jewelId: present?.StudsCufflinks?.[0]?.id || null,
        suspendersId: present?.Suspenders?.[0]?.id || null,
        pocket_squareId: present?.PocketSquare?.[0]?.id || null,
        totalAmount: eventData?.totalPrice || 0,
        firstName: eventData.firstName,
        lastName: eventData.lastName,
      };
      const bodyData = {
        eventName: eventData.eventName,
        firstName: eventData.firstName,
        lastName: eventData.lastName,
        eventDate: new Date(eventData.eventDate).toISOString(),
        userId: userId,
        role: eventData.ownerRole?.toLowerCase() || "groom",
        event_type: eventData.occasion || "Wedding",
        outfitData: outfitData,
      };
      const res = await EventDetailsServices.createEvent(bodyData);
      if (res.status) {
        modalNotification({
          message: res?.message || "Event Created Successfully",
          type: "success",
        });
        onClose();
        dispatch(updateEventData(res.results));
        router.push(`/event-details?price_type=${priceType}`);
      }
      else {
        modalNotification({
          message: "Event Creation Failed",
          type: "error",
        });

        onClose();
      }

    } catch (error) {
      modalNotification({
        message: "Event Creation Failed",
        type: "error",
      });
    }
  };

  const renderEventPopup = () => (
    
    <div className="bg-white w-full sm:w-[400px] lg:w-[500px] rounded-lg shadow-2xl relative max-h-[100vh] flex flex-col ">
       <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Event Details</h2>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>
          </div>

      <div className="overflow-y-auto p-8 sm:p-10">

       

        <div className=" space-y-4 mb-6">


          <div>
            <label className="block text-xs text-gray-500 mb-2">Event Name</label>
            <div className="flex items-center justify-between border-b border-gray-300 pb-2">
              <input
                type="text"
                value={eventData.eventName}
                onChange={(e) => {
                  const value = e.target.value;
                  onEventDataChange?.({ ...eventData, eventName: value });

                  if (errors.eventName && value.trim() !== "") {
                    setErrors((prev) => {
                      const updated = { ...prev };
                      delete updated.eventName;
                      return updated;
                    });
                  }
                }}

                placeholder="Enter Event Name"
                className={`flex-1 text-sm text-gray-800 outline-none  ${errors.eventName ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.eventName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.eventName}
                </p>
              )}
              <button className="text-gray-400 hover:text-gray-600">✎</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 w-full">
            {/* First Name */}
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-2">First Name</label>
              <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                <input
                  type="text"
                  value={eventData.firstName}
                  onChange={(e) => {
                    const value = e.target.value;
                    onEventDataChange?.({ ...eventData, firstName: value });

                    if (errors.firstName && value.trim() !== "") {
                      setErrors((prev) => {
                        const updated = { ...prev };
                        delete updated.firstName;
                        return updated;
                      });
                    }
                  }}

                  placeholder="Enter First Name"
                  className={`flex-1 text-sm text-gray-800 outline-none ${errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-2">Last Name</label>
              <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                <input
                  type="text"
                  value={eventData.lastName}
                  onChange={(e) => {
                    const value = e.target.value;
                    onEventDataChange?.({ ...eventData, lastName: value });

                    if (errors.lastName && value.trim() !== "") {
                      setErrors((prev) => {
                        const updated = { ...prev };
                        delete updated.lastName;
                        return updated;
                      });
                    }
                  }}

                  placeholder="Enter Last Name"
                  className={`flex-1 text-sm text-gray-800 outline-none ${errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                />
              </div>
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2">Event Date</label>
            <div className="flex items-center justify-between border-b border-gray-300 pb-2">
              <input
                type="date"
                value={eventData.eventDate}
                onChange={(e) => {
                  const value = e.target.value;
                  onEventDataChange?.({ ...eventData, eventDate: value });

                  if (errors.eventDate && value) {
                    setErrors((prev) => {
                      const updated = { ...prev };
                      delete updated.eventDate;
                      return updated;
                    });
                  }
                }}

                min={new Date(Date.now() + 60 * 60 * 1000).toISOString().split("T")[0]}
                className={`flex-1 text-sm text-gray-800 outline-none ${errors.eventDate ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.eventDate && (
                <p className="text-xs text-red-500 mt-1">{errors.eventDate}</p>
              )}
            </div>
          </div>

        </div>

        <div className="mb-6">
          <label className="block text-xs text-gray-500 mb-2">Occasion</label>
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            <Select
              className="flex-1 text-sm text-gray-800 outline-none bg-white"
              placeholder="Select an occasion..."
              value={
                eventData.occasion
                  ? { value: eventData.occasion, label: eventData.occasion }
                  : null
              }
              onChange={(selected) => {
                const selectedOccasion = selected?.value || "";
                const defaultRole = occasionRoles[selectedOccasion]?.[0] || "";

                onEventDataChange?.({
                  ...eventData,
                  occasion: selectedOccasion,
                  ownerRole: defaultRole,
                });

                if (errors.occasion && selectedOccasion) {
                  setErrors((prev) => {
                    const updated = { ...prev };
                    delete updated.occasion;
                    return updated;
                  });
                }
              }}

              options={occasions.map((oc) => ({
                value: oc,
                label: oc,
              }))}
              styles={{
                control: (base) => ({
                  ...base,
                  border: "none",
                  boxShadow: "none",
                  minHeight: "unset",
                  fontSize: "0.875rem",
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
              }}
            />
            {errors.occasion && (
              <p className="text-xs text-red-500 mt-1">{errors.occasion}</p>
            )}
          </div>
        </div>
        <div className="mb-6 font-advent">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Owners</h3>
          <p className="text-xs text-gray-500 mb-4">
            Owners can help manage the event by adding event details, building looks and assigning members.
            If an owner doesn't show on the Members Page, change their role to a non-owner below.
          </p>
          {/* <p className="text-xs text-gray-400 mb-4">
            If an owner doesn't show on the Members Page, change their role to a non-owner below.
          </p> */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Name</p>
              <p className="text-sm text-gray-800 font-medium">
                {eventData.firstName || eventData.lastName
                  ? `${eventData.firstName || ""} ${eventData.lastName || ""}`.trim()
                  : auth?.user
                    ? `${auth.user.firstName || ""} ${auth.user.lastName || ""}`.trim()
                    : "Guest User"}
              </p>
              <p className="text-xs text-gray-400">
                {eventData.firstName || eventData.lastName ? "Selected Customer" : "This is You"}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-xs text-gray-500 mb-2">Owner Role</label>
              <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                <Select
                  className="flex-1 text-sm text-gray-800 outline-none bg-white"
                  placeholder="Select a role..."

                  value={
                    eventData.ownerRole
                      ? { value: eventData.ownerRole, label: eventData.ownerRole }
                      : null
                  }
                  onChange={(selected) =>
                    onEventDataChange?.({
                      ...eventData,
                      ownerRole: selected?.value || "",
                    })
                  }
                  options={
                    (occasionRoles[eventData?.occasion] || []).map((r) => ({
                      value: r,
                      label: r,
                    }))
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "none",
                      boxShadow: "none",
                      minHeight: "unset",
                      fontSize: "0.875rem",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      <motion.button
        className=" w-auto py-3 mx-5 bg-[#D6A680] text-white text-sm font-medium rounded hover:bg-[#ca8f5f] cursor-pointer"
         whileTap={{ scale: 0.97 }}
        onClick={handleCreateEvent}
      >
        + Save Event
       </motion.button>
      
    </div>
  );


  return (
    <AnimatePresence mode="wait">
    { isOpen && (
    <motion.div
      key="popup"
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 flex justify-end z-[9999]"
    >
        {renderEventPopup()}
      </motion.div>
    )}
  </AnimatePresence>
  );
};

export default AuthEventPopUp;