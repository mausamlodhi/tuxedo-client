'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import VipLogoSection from '@/components/common/vipLogo';
import AuthLeftSection from '@/components/common/leftSection';
import { useRouter } from "next/navigation";
import { EventDetailsServices } from '@/servivces/user/eventDetails.service';
import logger from '@/utils/logger';
import { useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { occasionRoles } from '@/utils/constant';
import { Select } from 'antd';

const validationSchema = Yup.object({
  occasion: Yup.string().required('Please select an occasion'),
  role: Yup.string().required('Please select your role'),
  eventDate: Yup.date()
    .nullable()
    .required('Please select a valid event date'),
  fullName: Yup.string().required('Full name is required'),
  phone: Yup.string().required('Phone number is required'),
});

const CompleteProfile = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);

  const initialValues = {
    occasion: '',
    role: '',
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    phone: user?.phone || '',
    eventDate: null,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const payload = {
        eventName: values.occasion,
        role: values.role,
        owners: values.fullName,
        eventDate: values.eventDate ? values.eventDate.toISOString().split("T")[0] : "",
      };

      logger('Submitting profile:', payload);

      const response = await EventDetailsServices.createEvent(payload);

      if (response?.status) {
        router.push('/');
      } else {
        logger('Profile creation failed:', response?.message);
      }
    } catch (error) {
      logger('Error completing profile:', error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Left Section */}
      <div className="w-full lg:w-2/3 h-[40vh] lg:h-full">
        <AuthLeftSection imageSrc="/assets/images/completeProfile.png" />
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/3 h-[60vh] lg:h-full flex flex-col justify-start md:justify-center bg-white relative overflow-y-auto xs:overflow-visible">
        <div className="hidden lg:block absolute top-4 left-4 lg:top-6 lg:left-6">
          <VipLogoSection />
        </div>

        <div className="flex-1 px-6 mt-10 md:mt-30 md:px-8 space-y-6">
          {/* Title */}
          <h2 className="font-advent text-black text-lg font-semibold text-center">
            Welcome to VIP Formal Wear
          </h2>

          {/* Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-5">
                {/* Occasion */}
                <div>
                  <label className="font-advent block text-sm font-medium text-gray-700 mb-1">
                    What is the occasion?
                  </label>

                  <Select
                    showSearch
                    placeholder="Select an occasion..."
                    value={values.occasion || undefined}
                    onChange={(value) => {
                      setFieldValue("occasion", value);
                      setFieldValue("role", ""); 
                    }}
                    options={Object.keys(occasionRoles).map((occasion) => ({
                      value: occasion,
                      label: occasion,
                    }))}
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
                    className="font-advent w-full px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-[#BB9D7B]"
                  />

                  <ErrorMessage
                    name="occasion"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                   {/* Role */}
                <div>
                  <label className="font-advent block text-sm font-medium text-gray-700 mb-1">
                    What is your role?
                  </label>
                  <Select
                    showSearch
                    placeholder={
                      values.occasion
                        ? "Select your role..."
                        : "Please select an occasion first"
                    }
                    disabled={!values.occasion}
                    value={values.role || undefined}
                    onChange={(value) => setFieldValue("role", value)}
                    options={(occasionRoles[values.occasion] || []).map((r) => ({
                      value: r,
                      label: r,
                    }))}
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
                    className="font-advent w-full px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-[#BB9D7B]"
                  />
                 <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label className="font-advent block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Field
                    name="fullName"
                    type="text"
                    placeholder="What is your full name"
                    className="font-advent w-full px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-[#BB9D7B]"
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="font-advent block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <Field
                    name="phone"
                    type="text"
                    placeholder="What is your phone?"
                    className="font-advent w-full px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-[#BB9D7B]"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label className="font-advent block text-sm font-medium text-gray-700 mb-1">
                    Event date
                  </label>
                  <Field name="eventDate">
                    {({ field, form }: any) => (
                      <DatePicker
                        id="eventDate"
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date: Date | null) =>
                          form.setFieldValue(field.name, date)
                        }
                        dateFormat="MMMM d, yyyy"
                        minDate={new Date()}
                        placeholderText="Select event date"
                        className="font-advent w-full px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-[#BB9D7B] z-50 relative"
                        popperClassName="z-50"
                        popperPlacement="bottom-start"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="eventDate"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="font-advent w-full bg-[#BB9D7B] hover:bg-[#a68b6b] text-white font-medium py-2 px-4 rounded-md transition duration-200 text-sm"
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#000000]">
              vipformalwear ©2025 | All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
