import React, { useRef, useState } from "react";
import { Formik, Field, ErrorMessage, FormikHelpers, Form } from "formik";
import * as Yup from "yup";
import { X, Upload, Trash2 } from "lucide-react";
import ImageUpload from "../common/imageUploadField";
import modalNotification from "@/utils/notification";
import SelectField from "../common/selectField";
import QuillEditor from "../common/quillEditor";

interface AddStudsCufflinksFormValues {
  style: string;
  description: string;
  images: File[];
  buy_price?: number;
  rental_price?: number;
  categoryId?: number;
  collection: string;
  detail: string;
}

interface AddStudsCufflinksFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (values: AddStudsCufflinksFormValues) => void;
  type?: string;
  theme?: boolean | object;
  selectedData?: any;
  isSubmitting?: boolean;
  collections: CollectionInterface[];
}

// ✅ Validation schema using Yup
const validationSchema = Yup.object().shape({
  style: Yup.string()
    .required("Studs & Cufflinks style is required")
    .min(3, "Studs & Cufflinks Style must be at least 3 characters")
    .max(16, "Studs & Cufflinks Style must be at most 16 characters"),
  description: Yup.string()
    .required("Description is required")
    .max(500, "Description must be at most 500 characters"),
  buy_price: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .notRequired()
    .min(0, "Buy price cannot be negative"),
  // ✅ makes it optional
  rental_price: Yup.number()
    .typeError("Rental price must be a number")
    .min(0, "Rental price cannot be negative")
    .nullable()
    .required("Rental price is required"),
  images: Yup.array().of(Yup.mixed()).min(1, "At least one image is required"),
  collection: Yup.string().required("Collection is required"),
});

const AddStudsCufflinksForm: React.FC<AddStudsCufflinksFormProps> = ({
  isOpen = true,
  onClose,
  onSubmit,
  type,
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
  const initialValues: AddStudsCufflinksFormValues = {
    style: selectedData?.style || "",
    description: selectedData?.description || "",
    images: selectedData?.images || [],
    buy_price: selectedData?.buy_price,
    // collection: selectedData?.categoryId || undefined,
    collection: selectedData?.collection,
    rental_price: selectedData?.rental_price,
    categoryId: 8, // hidden injection for Jewelry
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
    values: AddStudsCufflinksFormValues
  ): void => {
    const newImages: File[] = values.images.filter((_, i) => i !== index);
    setFieldValue("images", newImages);
  };

  // const validate = (values: AddJewelryFormValues): Partial<AddJewelryFormValues> => {
  //   const errors: Partial<AddJewelryFormValues> = {};

  //   (Object.keys(validationSchema) as Array<keyof AddJewelryFormValues>).forEach((field) => {
  //     const validator = validationSchema[field as keyof typeof validationSchema] as (value: any) => string | undefined;
  //     const error = validator(values[field]);
  //     if (error) {
  //       (errors as any)[field] = error;
  //     }
  //   });
  //   setErrors(errors);
  //   return errors;
  // };

  const validate = (
    values: AddStudsCufflinksFormValues
  ): Partial<AddStudsCufflinksFormValues> => {
    const errors: Partial<AddStudsCufflinksFormValues> = {};

    try {
      validationSchema.validateSync(values, { abortEarly: false });
    } catch (validationError: any) {
      if (validationError.inner && Array.isArray(validationError.inner)) {
        validationError.inner.forEach((err: any) => {
          if (err.path) {
            (errors as any)[err.path] = err.message;
          }
        });
      }
    }
    setErrors(errors);
    return errors;
  };

  const handleSubmit = (
    values: AddStudsCufflinksFormValues,
    { setSubmitting, resetForm }: FormikHelpers<AddStudsCufflinksFormValues>
  ): void => {
    const normalizedValues = {
      ...values,
      buy_price:
        values.buy_price === undefined ||
        (typeof values.buy_price === "string" && values.buy_price === "")
          ? null
          : values.buy_price,
    };

    const finalValues = {
      ...normalizedValues,
      categoryId: 8, // force categoryId for jewelry
    };

    if (onSubmit) {
      onSubmit(finalValues);
    } else {
      alert("Studs & Cufflinks added successfully!");
    }

    setSubmitting(false);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col
        ${
          theme ? "bg-[#FFFFFF] text-[#2D333C]" : "bg-[#2D333C] text-[#FFFFFF]"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b flex-shrink-0 ${
            theme ? "border-blue-700 " : "border-gray-500"
          }`}
        >
          <h2
            className={`text-xl font-semibold ${
              theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
            }`}
          >
            {type === "add"
              ? "Add Studs & Cufflinks"
              : "Update Studs & Cufflinks"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <Formik<AddStudsCufflinksFormValues>
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched, handleSubmit }) => (
              <Form className="flex flex-col max-h-[73vh]">
                <div
                  className={`flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:w-2 ${
                    theme
                      ? "[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-gray-200"
                      : "[&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-track]:bg-slate-800"
                  }
                [&::-webkit-scrollbar-thumb]:rounded-full`}
                >
                  {/* Style */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Studs & Cufflinks Style
                    </label>
                    <Field
                      as="input"
                      name="style"
                      placeholder="Enter Studs & Cufflinks style"
                      innerRef={(el: any) => (fieldRefs.current.style = el)}
                      className={`w-full px-3 py-2 bg-[#313A46] border rounded-lg focus:outline-none ${
                        errors.style && touched.style
                          ? "border-red-500"
                          : "border-slate-600"
                      } ${
                        theme
                          ? "bg-white text-black-700"
                          : "bg-[#313A46] text-white"
                      } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                    <ErrorMessage
                      name="style"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Buy Price
                      </label>
                      <Field
                        name="buy_price"
                        type="number"
                        placeholder="Enter buy price"
                        innerRef={(el: any) =>
                          (fieldRefs.current.buy_price = el)
                        }
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
                      <label className="block text-sm font-medium mb-2">
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
                      style={{ zIndex: 5 }}
                    >
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Studs & Cufflinks Collection
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
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      placeholder="Enter description"
                      rows={4}
                      innerRef={(el: any) =>
                        (fieldRefs.current.description = el)
                      }
                      className={`w-full no-arrows px-3 py-2 border rounded-lg focus:outline-none ${
                        errors.description && touched.description
                          ? "border-red-500"
                          : "border-slate-600"
                      } ${
                        theme
                          ? "bg-white text-black"
                          : "bg-[#313A46] text-white"
                      }`}
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
                  {/* Images */}
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

                {/* Footer */}
                <div
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
                        handleSubmit();
                        scrollToError(errors);
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
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddStudsCufflinksForm;
