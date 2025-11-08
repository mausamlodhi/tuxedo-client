import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { X } from "lucide-react";
import SelectField from "../common/selectField";
import { getColorCode } from "@/utils";
import { pantTypes } from "@/utils/constant";
import ImageUpload from "../common/imageUploadField";
import modalNotification from "@/utils/notification";
import QuillEditor from "../common/quillEditor";

// Types and Interfaces
interface AddPantFormValues {
  style: string;
  colorId: string;
  pant_type: string;
  description: string;
  images: File[];
  buy_price?: number;
  rental_price?: number;
  collection: string;
  detail: string;
  matching_suspenders: number;
}
interface ValidationSchema {
  [key: string]: (value: any) => string | undefined;
}

interface AddPantFormProps {
  isOpen?: boolean;
  type: string;
  colors: ColorInterface[];
  onClose?: () => void;
  onSubmit?: (values: AddPantFormValues) => void;
  theme: boolean | object;
  selectedData?: any;
  isSubmitting: boolean;
  collections: CollectionInterface[];
  matching_suspenders?: SuspendersInterface[];
}

// Validation Schema (normally imported from separate file)
const addPantValidationSchema: ValidationSchema = {
  style: (value: string): string | undefined => {
    if (!value) return "Pant style is required";
    if (value.length < 3) return "Pant style must be at least 3 characters";
    if (value.length > 16) return "Pant style must not exceed 16 characters";
    return undefined;
  },
  colorId: (value: string): string | undefined => {
    if (!value) return "Pant Color is required";
    return undefined;
  },
  buy_price: (
    value: number | string | undefined | null
  ): string | undefined => {
    if (value == null || value === "") return undefined; // optional
    const num = typeof value === "string" ? Number(value) : value;
    if (Number.isNaN(num as number)) return "Buy price must be a number";
    if ((num as number) <= 0) return "Buy price must be positive";
    return undefined;
  },

  rental_price: (value: number | undefined): string | undefined => {
    if (value === undefined) return "Rental price is required";
    if (value <= 0) return "Rental price must be positive";
    return undefined;
  },

  pant_type: (value: string): string | undefined => {
    if (!value) return "Pant type selection is required";
    return undefined;
  },
  description: (value: string): string | undefined => {
    if (!value) return "Pant Description is required";
    if (value.length < 10)
      return "Pant Description must be at least 10 characters";
    if (value.length > 500)
      return "Pant Description must not exceed 500 characters";
    return undefined;
  },
  images: (value: File[]): string | undefined => {
    if (!value || value.length === 0) return "At least one image is required";
    return undefined;
  },
  collection: (value: string): string | undefined => {
    if (!value) return "Collection is required";
    return undefined;
  },
  matching_suspenders: (value: number | string): string | undefined => {
    if (!value) return "Matching Suspenders is required";
    return undefined;
  }


};

const AddPantForm: React.FC<AddPantFormProps> = ({
  isOpen = true,
  onClose,
  onSubmit,
  type,
  colors,
  theme,
  selectedData,
  isSubmitting,
  collections,
  matching_suspenders,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
  const [errors, setErrors] = useState<any>({});
  const scrollToError = (errors: Record<string, any>) => {
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey && fieldRefs.current[firstErrorKey]) {
      const element = fieldRefs.current[firstErrorKey];
      requestAnimationFrame(() => {
        element?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        // Delay focus so it doesn't cancel smooth scroll
        setTimeout(() => element?.focus?.(), 300);
      });
    }
  };
  const initialValues = {
    style: selectedData?.style || "",
    colorId: selectedData?.colors?.id || "",
    pant_type: selectedData?.pant_type || "",
    description: selectedData?.description || "",
    images: selectedData?.images || [],
    buy_price: selectedData?.buy_price,
    rental_price: selectedData?.rental_price,
    collection: selectedData?.collection,
    matching_suspenders: selectedData?.id ? selectedData?.suspenders?.id || "#" : 0,
    detail: selectedData?.detail || "",
  };

  console.log("Selected Data in Pant Form: ", selectedData);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    setFieldValue: any,
    values: any
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files || []);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      modalNotification({
        type: "error",
        message: "Only image files are allowed.",
      });
    }

    const existingNames = values.images.map((img: any) =>
      typeof img === "string" ? img : img.name + img.size
    );

    const newFiles = validFiles.filter(
      (file) => !existingNames.includes(file.name + file.size)
    );

    setFieldValue("images", [...values.images, ...newFiles]);
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
    values: any
  ) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      modalNotification({
        type: "error",
        message: "Only image files are allowed.",
      });
      return;
    }

    const existingNames = values.images.map((img: any) =>
      typeof img === "string" ? img : img.name + img.size
    );

    const newFiles = validFiles.filter(
      (file) => !existingNames.includes(file.name + file.size)
    );

    setFieldValue("images", [...values.images, ...newFiles]);
    e.target.value = "";
  };

  const removeImage = (
    index: number,
    setFieldValue: (field: string, value: any) => void,
    values: AddPantFormValues
  ): void => {
    const newImages: File[] = values.images.filter((_, i) => i !== index);
    setFieldValue("images", newImages);
  };

  const validate = (values: AddPantFormValues): Partial<AddPantFormValues> => {
    const errors: Partial<AddPantFormValues> = {};

    Object.keys(addPantValidationSchema).forEach((field) => {
      const error = addPantValidationSchema[field]((values as any)[field]);
      if (error) {
        (errors as any)[field] = error;
      }
    });
    setErrors(errors);
    return errors;
  };

  const handleSubmit = (
    values: AddPantFormValues,
    { setSubmitting, resetForm }: FormikHelpers<AddPantFormValues>
  ): void => {
    const normalizedValues = {
      ...values,
      buy_price:
        values.buy_price === undefined ||
          (typeof values.buy_price === "string" && values.buy_price === "")
          ? null
          : values.buy_price,
    };
    console.log("Valu : ", values);

    if (onSubmit) {
      onSubmit(normalizedValues);
    }
    setSubmitting(false);
    resetForm();
  };

  const handleClose = (): void => {
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col
        ${theme ? "bg-[#FFFFFF] text-[#2D333C]" : "bg-[#2D333C] text-[#FFFFFF]"
          }`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b flex-shrink-0 ${theme ? "border-blue-700 " : "border-gray-500"
            }`}
        >
          <h2
            className={`text-xl font-semibold  ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
              }`}
          >
            {type === "add" ? "Add Pant" : "Update Pant"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400  transition-colors cursor-pointer"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched, handleSubmit }) => (
              <Form className="flex flex-col max-h-[73vh]">
                <div
                  className={`flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:w-2 ${theme
                    ? "[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-gray-200"
                    : "[&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-track]:bg-slate-800"
                    }
                [&::-webkit-scrollbar-thumb]:rounded-full`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                          }`}
                      >
                        Pant style
                      </label>
                      <Field
                        as="input"
                        name="style"
                        placeholder="Enter pant style"
                        rows={4}
                        innerRef={(el: any) => (fieldRefs.current.style = el)}
                        className={`w-full px-3 py-2 bg-[#313A46] border rounded-lg focus:outline-none ${errors.style && touched.style
                          ? "border-red-500"
                          : "border-slate-600"
                          } ${theme
                            ? "bg-white text-black-700"
                            : "bg-[#313A46] text-white"
                          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                      />
                      <ErrorMessage
                        name="style"
                        component="div"
                        className="text-red-400 text-sm mt-1"
                      />
                    </div>

                    {/* Color */}
                    <div
                      ref={(el: any) => (fieldRefs.current.colorId = el)}
                      style={{ zIndex: 6 }}
                    >
                      <label
                        className={`block text-sm font-medium mb-2 ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                          }`}
                      >
                        Pant Color
                      </label>
                      <SelectField
                        name="colorId"
                        options={colors.map((color) => ({
                          value: color.id,
                          label: color.name,
                          color: getColorCode(color.name),
                        }))}
                        placeholder="Select Color"
                        isColor={true}
                        bgColor={theme ? "#ffffff" : "#313A46"}
                        textColor={theme ? "#2D333C" : "#ffffff"}
                        borderColor={theme ? "#CBD5E1" : "#475569"}
                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                          }`}
                      >
                        Buy Price
                      </label>
                      <Field
                        name="buy_price"
                        type="number"
                        placeholder="Enter buy price"
                        innerRef={(el: any) =>
                          (fieldRefs.current.buy_price = el)
                        }
                        className={`w-full no-arrows px-3 py-2 border rounded-lg focus:outline-none ${errors.buy_price && touched.buy_price
                          ? "border-red-500"
                          : "border-slate-600"
                          } ${theme
                            ? "bg-white text-black"
                            : "bg-[#313A46] text-white"
                          }`}
                      />
                      <ErrorMessage
                        name="buy_price"
                        component="div"
                        className="text-red-400 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                          }`}
                      >
                        Rental Price
                      </label>
                      <Field
                        name="rental_price"
                        type="number"
                        placeholder="Enter rental price"
                        innerRef={(el: any) =>
                          (fieldRefs.current.rental_price = el)
                        }
                        className={`w-full no-arrows px-3 py-2 border rounded-lg focus:outline-none ${errors.rental_price && touched.rental_price
                          ? "border-red-500"
                          : "border-slate-600"
                          } ${theme
                            ? "bg-white text-black"
                            : "bg-[#313A46] text-white"
                          }`}
                      />
                      <ErrorMessage
                        name="rental_price"
                        component="div"
                        className="text-red-400 text-sm mt-1"
                      />
                    </div>
                  
                    <div
                      ref={(el: any) => (fieldRefs.current.collection = el)}
                      style={{ zIndex: 5 }}
                    >
                      <label
                        className={`block text-sm font-medium mb-2 ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                          }`}
                      >
                        Pant Collection
                      </label>
                      <SelectField
                        name="collection"
                        options={collections.map((collection) => ({
                          value: collection.id,
                          label: collection.name,
                          image: collection.details?.[0]?.image,
                          //color: getColorCode(color.name)
                        }))}
                        placeholder="Select Collection"
                        isColor={true}
                        bgColor={theme ? "#ffffff" : "#313A46"}
                        textColor={theme ? "#2D333C" : "#ffffff"}
                        borderColor={theme ? "#CBD5E1" : "#475569"}
                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                        disabled={isSubmitting}
                      />
                       {values.collection && (() => {
                        const selectedCollection = collections.find(
                          (c) => c.id === Number(values.collection)
                        );

                        const images = selectedCollection?.details?.map((d) => d.image) || [];
                        if (images.length === 0) return null;
                        return (
                          <div className="relative mt-4 border border-slate-600 rounded-md p-2">
                            <button
                              onClick={() => setFieldValue("collection", "")}
                              className="text-gray-400  transition-colors cursor-pointer absolute top-2 right-2 "
                              type="button"
                            >
                              <X size={24} />
                            </button>

                            {/* Show all collection images */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={"Collection Image"}
                                  className="w-32 h-32 object-contain "
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    {/* Slim Fit */}
                    <div ref={(el: any) => (fieldRefs.current.pant_type = el)}>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Pant Type
                      </label>
                      <SelectField
                        name="pant_type"
                        options={pantTypes.map((fit) => ({
                          value: fit.value,
                          label: fit.label,
                        }))}
                        placeholder="Select Pant Type"
                        bgColor={theme ? "#ffffff" : "#313A46"}
                        textColor={theme ? "#2D333C" : "#ffffff"}
                        borderColor={theme ? "#CBD5E1" : "#475569"}
                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <br />

                  {/* Matching Suspenders */}
                  <div
                    ref={(el: any) => (fieldRefs.current.matching_suspenders = el)}
                  >
                    <label
                      className={`block text-sm font-medium mb-2 ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                    >
                      Matching Suspenders
                    </label>
                    <SelectField
                      name="matching_suspenders"
                      options={(matching_suspenders || []).map((suspender) => ({
                        value: suspender.id,
                        label: `${suspender.style} - ${suspender.description}`,
                      }))}

                      placeholder="Select Matching Suspenders"
                      bgColor={theme ? "#ffffff" : "#313A46"}
                      textColor={theme ? "#2D333C" : "#ffffff"}
                      borderColor={theme ? "#CBD5E1" : "#475569"}
                      menuBgColor={theme ? "#ffffff" : "#313A46"}
                      optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                      optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                      disabled={isSubmitting}
                    />
                  </div>
                  <br />

                  {/* Description */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                    >
                      Pant Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      placeholder="Enter your message"
                      rows={4}
                      innerRef={(el: any) =>
                        (fieldRefs.current.description = el)
                      }
                      className={`w-full px-3 py-2  border rounded-lg  placeholder-gray-400 focus:outline-none ${errors.description && touched.description
                        ? "border-red-500"
                        : "border-slate-600"
                        } ${theme
                          ? "bg-white text-black-700"
                          : "bg-[#313A46] text-white"
                        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                    <br />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                    >
                      Details
                    </label>
                    <QuillEditor
                      value={values.detail}
                      setValue={setFieldValue}
                    />
                    <ErrorMessage
                      name="detail"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                    <br />
                  </div>
                  {/* Image Upload */}
                  <div ref={(el: any) => (fieldRefs.current.images = el)}>
                    <ImageUpload
                      values={values}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      theme={theme}
                      removeImage={removeImage}
                      handleDrag={handleDrag}
                      handleDrop={handleDrop}
                      dragActive={dragActive}
                      handleFileSelect={handleFileSelect}
                    />
                  </div>
                </div>

                {/* Fixed footer with Save button */}
                <div
                  className={`sticky bottom-0 w-full px-6 py-4 ${theme
                    ? "bg-white border-gray-200"
                    : "bg-[#2D333C] border-slate-700"
                    } flex justify-start`}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => {
                      handleSubmit();
                      scrollToError(errors);
                    }}
                    className={`px-6 py-2 w-32 rounded-sm h-10 font-medium transition-colors cursor-pointer 
            ${theme ? "bg-blue-500 text-white hover:bg-blue-600 " : "bg-white"} 
            ${isSubmitting
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "text-gray-900"
                      }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddPantForm;
