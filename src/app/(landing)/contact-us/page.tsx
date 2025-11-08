"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Breadcrumb from "@/components/breadcrumb";
import { locations } from "@/utils/constant";
import SelectField from "@/components/common/selectField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { contactUsServices } from "@/servivces/user/contact.service";
import modalNotification from "@/utils/notification";
import logger from "@/utils/logger";
import { useRouter } from "next/navigation"; // for app directory

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  location: string;
  message: string;
}

// Validation schema
const ContactValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  location: Yup.string().required("Location is required"),
  message: Yup.string().required("Message is required"),
});
const ContactPage: React.FC = () => {
  //   const [formData, setFormData] = useState({
  //     name: "",
  //     email: "",
  //     message: "",
  //     phone: "",
  //     location: "",
  //   });

  //   const handleChange = (
  //     e: React.ChangeEvent<
  //       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //     >
  //   ) => {
  //     setFormData({ ...formData, [e.target.name]: e.target.value });
  //   };

  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();

  //     const phoneRegex = /^[0-9]{10}$/; // only 10 digits
  //     if (!phoneRegex.test(formData.phone)) {
  //       toastr.error(
  //         "Please enter a valid 10-digit phone number",
  //         "Invalid Phone"
  //       );
  //       return;
  //     }
  //     toastr.success("Message sent successfully!", "Success");
  //     setFormData({ name: "", email: "", message: "", phone: "", location: "" });
  //   };
  // const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [defaultLocation, setDefaultLocation] = useState(locations[0]);
  console.log("defaultlocation", defaultLocation);

  const router = useRouter(); // initialize router
  const handleContactFormSubmit = async (
    values: ContactFormValues,
    { resetForm, setSubmitting }: any
  ) => {
    setSubmitting(true);
    try {
      const location = locations.filter(
        (item) => item?.id == values?.location
      )?.[0];
      const payload = {
        ...values,
        location: location?.city,
        latitude: location?.coordinates?.lat,
        longitude: location?.coordinates?.lng,
      };
      const response = await contactUsServices.createContactUs(payload);
      if (response?.status) {
        modalNotification({
          message: response?.message || "Message sent successfully!",
          type: "success",
        });
        resetForm();
        // Redirect to landing page
        router.push("/"); // "/" is landing page
      }
else{
        modalNotification({
          message: response?.message || "Failed to create contact",
          type: "error",
        });
      }

    } catch (error) {
      logger("Contact form error:", error);
      modalNotification({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    }
    setSubmitting(false);
  };
  return (
    <>
      <Header />
      <Breadcrumb />
      <div className="min-h-screen bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Left Section - Contact Info */}
          <div>
            {/* Google Map */}
            <div className="mt-8 mb-8 rounded-xl overflow-hidden shadow-lg ">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0467264838694!2d-122.40107168468173!3d37.79361787975607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064d63e9e2f%3A0x917c2c2f9f0af7f2!2sSalesforce%20Tower!5e0!3m2!1sen!2sus!4v1678650828934!5m2!1sen!2sus"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-8">
              We’d love to hear from you! Fill out the form or reach us directly
              via phone or email.
            </p>

            {/* Contact-info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600" />
                <span className="text-gray-700">
                  123 Business Street, City, Country
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-blue-600" />
                <span className="text-gray-700">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-blue-600" />
                <span className="text-gray-700">contact@example.com</span>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Send us a message
            </h3>

            <Formik
              initialValues={{
                name: "",
                email: "",
                phone: "",
                location: "",
                message: "",
              }}
              validationSchema={ContactValidationSchema}
              // onSubmit={(values, { resetForm, setSubmitting }) => {
              //   console.log("Submitted values:", values);
              //   toastr.success("Message sent successfully!", "Success");
              //   resetForm();
              //   setSubmitting(false);
              // }}
              onSubmit={handleContactFormSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#BB9D7B] outline-none"
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#BB9D7B] outline-none"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <Field
                      type="tel"
                      name="phone"
                      className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#BB9D7B] outline-none"
                    />
                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    {/* <Field name="location">
                      {({ field, form }: any) => (
                        <SelectField
                          {...field} // this will pass name, value, onChange, onBlur
                          options={locations.map((loc) => ({
                            value: loc.id,
                            label: loc.city,
                          }))}
                          placeholder="Select a location"
                          bgColor={theme ? "#ffffff" : "#313A46"}
                          textColor={theme ? "#2D333C" : "#ffffff"}
                          borderColor={theme ? "#CBD5E1" : "#475569"}
                          menuBgColor={theme ? "#ffffff" : "#313A46"}
                          optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                          optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                          disabled={isSubmitting}
                        />
                      )}
                    </Field> */}
                    <Field name="location">
                      {({ field, form }: any) => {
                        const { setFieldValue } = form;
                        return (
                          <SelectField
                            {...field} // passes name, value, onBlur
                            options={locations.map((loc) => ({
                              value: loc.id,
                              label: loc.city,
                            }))}
                            placeholder="Select a location"
                            bgColor="#ffffff"
                            textColor="#000000"
                            borderColor="#CBD5E1"
                            menuBgColor="#ffffff"
                            optionSelectedBg="#E2E8F0"
                            optionHoverBg="#F1F5F9"
                            disabled={form.isSubmitting}
                            // Intercept Formik's onChange internally
                            // onChange={(selectedId: string) => {
                            //   const loc = locations.find(
                            //     (l) => l.id === selectedId
                            //   );
                            //   if (loc) {
                            //     setFieldValue("location", {
                            //       id: loc.id,
                            //       city: loc.city,
                            //       latitude: loc.coordinates.lat,
                            //       longitude: loc.coordinates.lng,
                            //     });
                            //   }
                            // }}
                          />
                        );
                      }}
                    </Field>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <Field
                      as="textarea"
                      name="message"
                      rows={4}
                      className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#BB9D7B] outline-none"
                    />
                    <ErrorMessage
                      name="message"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-15 bg-[#d4a077] text-white py-2 rounded-md hover:bg-[#c69a5e] cursor-pointer transition"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
export default ContactPage;
