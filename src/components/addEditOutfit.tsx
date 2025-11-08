"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectEventData, updateEventData } from "@/app/redux/slice/auth.slice";
import { RootState } from "@/app/redux/store";
import logger from "@/utils/logger";
import { outfitServices } from "@/servivces/user/outfit.service";
import { useRouter } from "next/navigation";
import { occasionRoles } from "@/utils/constant";
import { Select } from "antd";

interface SidebarFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  getTotalPrice?: () => number;
  priceType: string;
}

const SidebarForm: React.FC<SidebarFormProps> = ({ isOpen, onClose, onSubmit, getTotalPrice, priceType }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const eventData = useSelector(selectEventData);
  const present = useSelector((state: RootState) => state.lookBuilder.present) as any;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventName: eventData?.eventName || "",
    role: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const clearError = (field: string, value: string) => {
    switch (field) {
      case "firstName":
      case "lastName":
        if (value.trim() !== "") setErrors((prev) => ({ ...prev, [field]: "" }));
        break;
      case "email":
        if (/\S+@\S+\.\S+/.test(value)) setErrors((prev) => ({ ...prev, email: "" }));
        break;
      case "phone":
        if (/^\(\d{3}\)\s\d{3}-\d{4}$/.test(value))
          setErrors((prev) => ({ ...prev, phone: "" }));
        break;
    }
  };





  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearError(e.target.name, e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors = { firstName: "", lastName: "", email: "", phone: "" };

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      newErrors.firstName = "First name is required!";
      newErrors.lastName = "Last name is required!";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (
      formData.phone &&
      !/^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/.test(formData.phone)
    ) {
      newErrors.phone = "Please enter a valid US phone number (e.g., 123-456-7890).";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    if (
      formData.phone &&
      !/^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/.test(formData.phone)
    ) {
      alert("Please enter a valid US phone number (e.g., 123-456-7890).");
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
      return;
    }
    const outfitData = {
      eventId: eventData?.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
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
      totalAmount: getTotalPrice ? getTotalPrice().toFixed(4) : 0
    };
    const response = await outfitServices.createOutfit(outfitData);
    if (response.status) {
      const updatedEventData = {
        ...eventData,
        outfits: [
          ...eventData?.outfits,
          response.result
        ]
      };
      dispatch(updateEventData(updatedEventData))
      router.push(`/event-details?price_type=${eventData?.priceType || ''}`);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="sidebar"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Add Outfit Details</h2>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
            {/* Event Name */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Event Name</label>
              <input
                name="eventName"
                type="text"
                disabled={true}
                value={formData.eventName}
                onChange={handleChange}
                placeholder="Enter event name"
                className="w-full disabled:cursor-not-allowed border-b border-gray-300 text-sm py-2 focus:border-[#e7c0a1] outline-none"
              />
            </div>
            {/* First & Last Name */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="w-full border-b border-gray-300 text-sm py-2 focus:border-[#e7c0a1] outline-none"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="w-full border-b border-gray-300 text-sm py-2 focus:border-[#e7c0a1] outline-none"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full border-b border-gray-300 text-sm py-2 focus:border-[#e7c0a1] outline-none"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Phone</label>
              <input
                name="phone"
                type="text"
                value={formData.phone}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 10) value = value.slice(0, 10);

                  let formatted = value;
                  if (value.length > 6) {
                    formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
                  } else if (value.length > 3) {
                    formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                  } else if (value.length > 0) {
                    formatted = `(${value}`;
                  }

                  setFormData({ ...formData, phone: formatted });
                }}
                placeholder="(123) 456-7890"
                className={`w-full border-b text-sm py-2 outline-none ${errors.phone ? "border-red-500" : "border-gray-300 focus:border-[#e7c0a1]"
                  }`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>


            {/* Role (Dynamic based on Redux eventData.occasion) */}
           <div>
  <label className="block text-xs text-gray-500 mb-1">Role</label>
  <Select
    showSearch
    placeholder={
      eventData?.event_type
        ? "Select a role..."
        : "No occasion selected"
    }
    value={formData.role || undefined} // ✅ FIXED
    onChange={(selectedValue) => // ✅ FIXED
      setFormData({ ...formData, role: selectedValue })
    }
    options={
      eventData?.event_type
        ? (occasionRoles[eventData.event_type] || []).map((r) => ({
            value: r,
            label: r,
          }))
        : []
    }
    disabled={!eventData?.event_type}
    popupMatchSelectWidth={false}
    style={{
      width: "100%",
      backgroundColor: "#f3f4f6",
      borderRadius: "6px",
    }}
    styles={{
      popup: {
        root: {
          zIndex: 9999,
        },
      },
    }}
  />
</div>






            {/* Submit Button */}
            <motion.button
              type="submit"
              // whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-6 bg-[#e7c0a1] cursor-pointer text-white py-2 h-10 font-advent font-semibold tracking-wide shadow hover:shadow-md transition"
            >
              Save Details
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidebarForm;
