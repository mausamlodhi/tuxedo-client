import React, { useRef, useState } from "react";
import { Formik, Field, ErrorMessage, FormikHelpers } from "formik";
import { X, Upload, Trash2 } from "lucide-react";
import Select from "react-select";
import SelectField from "../common/selectField";
import { getColorCode } from "@/utils";
import { tieTypes } from "@/utils/constant";
import ImageUpload from "../common/imageUploadField";
import modalNotification from "@/utils/notification";
import QuillEditor from "../common/quillEditor";
// Types
interface AddTieFormValues {
  tieStyle: string;
  color: string;
  matching_pocket_square: number;
  tie_type: string;
  description: string;
  images: File[];
  buy_price?: number;
  rental_price?: number;
  collection: string;
  detail: string;
}

interface AddTieFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (values: AddTieFormValues) => void;
  type?: string;
  colors: ColorInterface[];
  pocketSquares: PocketSquareInterface[];
  theme?: boolean | object;
  selectedData: any;
  isSubmitting?: boolean;
  collections: CollectionInterface[];
}

interface PocketSquareInterface {
  id: string;
  style: string;
  description: string;
}

// Validation Schema
const addTieValidationSchema = {
  tieStyle: (value: string): string | undefined => {
    if (!value) return "Tie style is required";

    if (value.length < 3) return "Tie Style must be at least 3 characters";
    if (value.length > 16) return "Tie Style must not exceed 16 characters";
    return undefined;
  },
  color: (value: string): string | undefined => {
    if (!value) return "Color is required";
    return undefined;
  },
  matching_pocket_square: (value: string): string | undefined => {
    if (!value) return "Matching pocket square selection is required";
    return undefined;
  },
  tie_type: (value: string): string | undefined => {
    if (!value) return "Tie type selection is required";
    return undefined;
  },
  buy_price: (value: string): string | undefined => {
    if (value && Number(value) <= 0) {
      return "Buy price must be positive";
    }
    return undefined; // valid if empty
  },
  rental_price: (value: number | undefined): string | undefined => {
    if (value === undefined) return "Rental price is required";
    if (value <= 0) return "Rental price must be positive";
    return undefined;
  },
  description: (value: string): string | undefined => {
    if (!value) return "Description is required";
    if (value.length < 10) return "Description must be at least 10 characters";
    if (value.length > 500) return "Description must not exceed 500 characters";
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
};

const AddTieForm: React.FC<AddTieFormProps> = ({
  isOpen = true,
  onClose,
  onSubmit,
  type,
  colors,
  pocketSquares,
  theme,
  selectedData,
  isSubmitting,
  collections,
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
    tieStyle: selectedData?.style || "",
    color: selectedData?.colors?.id || "",
    matching_pocket_square: selectedData?.id ? selectedData?.pocketsquare?.id || "#" : 0,
    tie_type: selectedData?.tie_type || "",
    description: selectedData?.description || "",
    images: selectedData?.images || [],
    buy_price: selectedData?.buy_price,
    rental_price: selectedData?.rental_price,
    // collection: selectedData?.categoryId || undefined,
    collection: selectedData?.collection,
    detail: selectedData?.detail || "",
  };
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
    values: AddTieFormValues
  ): void => {
    const newImages: File[] = values.images.filter((_, i) => i !== index);
    setFieldValue("images", newImages);
  };

  const validate = (values: AddTieFormValues): Partial<AddTieFormValues> => {
    const errors: Partial<AddTieFormValues> = {};

    (
      Object.keys(addTieValidationSchema) as Array<keyof AddTieFormValues>
    ).forEach((field) => {
      const validator = addTieValidationSchema[
        field as keyof typeof addTieValidationSchema
      ] as (value: any) => string | undefined;
      const error = validator(values[field]);
      if (error) {
        (errors as any)[field] = error;
      }
    });
    setErrors(errors);
    return errors;
  };

  const handleSubmit = (
    values: AddTieFormValues,
    { setSubmitting, resetForm }: FormikHelpers<AddTieFormValues>
  ): void => {
    const normalizedValues = {
      ...values,
      buy_price:
        values.buy_price === undefined ||
        (typeof values.buy_price === "string" && values.buy_price === "")
          ? null
          : values.buy_price,
    };

    if (onSubmit) {
      onSubmit(normalizedValues);
    } else {
      alert("Tie added successfully!");
    }
    setSubmitting(false);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto
    [&::-webkit-scrollbar]:w-2
    ${
      theme
        ? "[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-gray-200"
        : "[&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-track]:bg-slate-800"
    }
    [&::-webkit-scrollbar-thumb]:rounded-full
    ${theme ? "bg-[#FFFFFF] text-[#2D333C]" : "bg-[#2D333C] text-[#FFFFFF]"}`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b flex-shrink-0 ${
            theme ? "border-blue-700 " : "border-gray-500"
          }`}
        >
          <h2
            className={`text-xl font-semibold  ${
              theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
            }`}
          >
            {type === "add" ? "Add Tie" : "Update Tie"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400  transition-colors cursor-pointer"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <Formik<AddTieFormValues>
            initialValues={initialValues}
            validate={validate}
            onSubmit={(values, helpers) => {
              console.log("Helpers : ", errors);

              if (Object.keys(helpers.validateForm(values)).length > 0) {
                // form invalid → scroll
                helpers.validateForm(values).then((errors) => {
                  scrollToError(errors);
                });
              } else {
                handleSubmit(values, helpers);
              }
            }}
          >
            {({ values, setFieldValue, errors, touched, handleSubmit }) => (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tie Style */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                      }`}
                    >
                      Tie style
                    </label>
                    <Field
                      as="input"
                      name="tieStyle"
                      placeholder="Enter tie style"
                      rows={4}
                      ref={(el: any) => (fieldRefs.current.tieStyle = el)}
                      className={`w-full px-3 py-2 bg-[#313A46] border rounded-lg  focus:outline-none ${
                        errors.tieStyle && touched.tieStyle
                          ? "border-red-500"
                          : "border-slate-600"
                      } ${
                        theme
                          ? "bg-white text-black-700"
                          : "bg-[#313A46] text-white"
                      } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                    <ErrorMessage
                      name="tieStyle"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  {/* Color */}
                  <div
                    ref={(el: any) => (fieldRefs.current.color = el)}
                    style={{ zIndex: 6 }}
                  >
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                      }`}
                    >
                      Tie Color
                    </label>
                    <SelectField
                      name="color"
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

                  {/* Matching Pocket Square */}
                  <div
                    ref={(el: any) =>
                      (fieldRefs.current.matching_pocket_square = el)
                    }
                    style={{ zIndex: 6 }}
                  >
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                      }`}
                    >
                      Matching Pocket Square
                    </label>
                    <SelectField
                      name="matching_pocket_square"
                      options={pocketSquares.map(
                        (square: PocketSquareInterface) => ({
                          value: square?.id,
                          label: `${square?.style} - ${square?.description} `,
                        })
                      )}
                      placeholder="Select Matching Pocket Square"
                      bgColor={theme ? "#ffffff" : "#313A46"}
                      textColor={theme ? "#2D333C" : "#ffffff"}
                      borderColor={theme ? "#CBD5E1" : "#475569"}
                      menuBgColor={theme ? "#ffffff" : "#313A46"}
                      optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                      optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div
                    ref={(el: any) => (fieldRefs.current.tie_type = el)}
                    style={{ zIndex: 5 }}
                  >
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                      }`}
                    >
                      Tie Type
                    </label>
                    <SelectField
                      name="tie_type"
                      options={tieTypes}
                      placeholder="Select Tie Type"
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
                      className={`block text-sm font-medium mb-2 ${
                        theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                      }`}
                    >
                      Buy Price
                    </label>
                    <Field
                      name="buy_price"
                      type="number"
                      placeholder="Enter buy price"
                      innerRef={(el: any) => (fieldRefs.current.buy_price = el)}
                      className={`w-full no-arrows px-3 py-2 border rounded-lg focus:outline-none ${
                        errors.buy_price && touched.buy_price
                          ? "border-red-500"
                          : "border-slate-600"
                      } ${
                        theme
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
                      className={`block text-sm font-medium mb-2 ${
                        theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
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
                      className={`w-full no-arrows px-3 py-2 border rounded-lg focus:outline-none ${
                        errors.rental_price && touched.rental_price
                          ? "border-red-500"
                          : "border-slate-600"
                      } ${
                        theme
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
                    style={{ zIndex: 4 }}
                  >
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                      }`}
                    >
                      Tie Collection
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
                </div>

                {/* Description */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                    }`}
                  >
                    Tie Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Enter your message"
                    rows={4}
                    innerRef={(el: any) => (fieldRefs.current.description = el)}
                    className={`w-full px-3 py-2 bg-[#313A46] border rounded-lg  placeholder-gray-400 focus:outline-none ${
                      errors.description && touched.description
                        ? "border-red-500"
                        : "border-slate-600"
                    } ${
                      theme
                        ? "bg-white text-black-700"
                        : "bg-[#313A46] text-white"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                    }`}
                  >
                    Details
                  </label>
                  <QuillEditor value={values.detail} setValue={setFieldValue} />
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

                <div
                style={{ zIndex: 5 }}
                  className={`sticky bottom-0 w-full px-6 py-4 ${
                    theme
                      ? "bg-white border-gray-200"
                      : "bg-[#2D333C] border-slate-700"
                  } flex justify-start`}
                >
                  {/* Cancel */}
                  {/* <button
                     type="button"
                     onClick={() => handleSubmit()}
                     disabled={isSubmitting}
                     className="bg-white text-gray-800 cursor-pointer px-6 py-2 rounded-sm h-10 font-medium transition-colors hover:bg-gray-700"
                     >
                     Cancel
                     </button> */}

                  {/* Save */}
                  {isSubmitting ? (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={` px-6 py-2 w-35 rounded-sm h-10 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                        theme ? "bg-slate-300" : "bg-white"
                      }
                        ${
                          isSubmitting
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "text-gray-900 hover:bg-gray-300"
                        }`}
                    >
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
                      </svg>{" "}
                      Saving...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      onClick={() => {
                        scrollToError(errors);
                        handleSubmit();
                      }}
                      disabled={isSubmitting}
                      className={` px-6 py-2 w-35 rounded-sm h-10 font-medium transition-colors cursor-pointer  ${
                        theme
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-white"
                      }
      ${
        isSubmitting
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "text-gray-900"
      }`}
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddTieForm;
