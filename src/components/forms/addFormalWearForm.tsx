import React, { useRef, useState } from "react";
import { Formik, Field, ErrorMessage, FormikHelpers } from "formik";
import { X } from "lucide-react";
import SelectField from "../common/selectField";
import { getColorCode } from "@/utils";
import QuillEditor from "../common/quillEditor";

// Add SocksInterface definition if not imported from elsewhere
interface SocksInterface {
  id: number;
  style: string;
  description: string;
}

// Add SuspendersInterface definition if not imported from elsewhere
interface SuspendersInterface {
  id: number;
  style: string;
  description: string;
}

// Types
interface AddFormalWearFormValues {
  // title: string;
  // colorId: string;
  // description: string;
  // detail: string;
  // buy_price?: number;
  // rental_price?: number;
  coatId: string;
  //images: File[];
}

interface AddFormalWearFormProps {
  isOpen?: boolean;
  type?: string;
  onClose?: () => void;
  onSubmit?: (values: AddFormalWearFormValues) => void;
  coats: CoatInterface[];
  // shirts?: ShirtInterface[];
  // vests: VestInterface[];
  // shoes: ShoesInterface[];
  // ties: TieInterface[];
  // pocketSquares: PocketSquareInterface[];
  // jewels?: JewelInterface[];
  colors: ColorInterface[];
  // pants: PantInterface[];
  // studsCufflinks: any[];
  // shocks: any[];
  // suspenders: any[];
  theme?: boolean | object;
  selectedData: any;
  isSubmitting?: boolean;
}

// Validation Schema
const addFormalWearValidationSchema = {
//   title: (value: string): string | undefined => {
//     if (!value) return "Title is required";
//     if (value.length < 3) return "Title must be at least 3 characters";
//     return undefined;
//   },
//   colorId: (value: string): string | undefined => {
//     if (!value) return "Color is required";
//     return undefined;
//   },
//   description: (value: string): string | undefined => {
//     if (!value) return "Description is required";
//     if (value.length < 10) return "Description must be at least 10 characters";
//     if (value.length > 500) return "Description must not exceed 500 characters";
//     return undefined;
//   },
//  detail: (value: string): string | undefined => {
//   if (value && value.length < 10) {
//     return "Detail must be at least 10 characters";
//   }
//   return undefined; 
// },

//  buy_price: (value: string): string | undefined => {
//     if (!value) return "Buy price is required";
//     if (Number(value) <= 0) return "Buy price must be positive";
//     return undefined;
//   },

//    rental_price: (value: string): string | undefined => {
//     if (value && Number(value) <= 0) {
//       return "Rental price must be positive";
//     }
//     return undefined;
//   },
  coatId: (value: string): string | undefined => {
    if (!value) return "Coat selection is required";
    return undefined;
  },
  // shirtId: (value: string): string | undefined => {
  //   if (!value) return "Shirt selection is required";
  //   return undefined;
  // },
  // vestId: (value: string): string | undefined => {
  //   if (!value) return "Vest selection is required";
  //   return undefined;
  // },
  // shoeId: (value: string): string | undefined => {
  //   if (!value) return "Shoe selection is required";
  //   return undefined;
  // },
  // tieId: (value: string): string | undefined => {
  //   if (!value) return "Tie selection is required";
  //   return undefined;
  // },
  // pocket_squareId: (value: string): string | undefined => {
  //   if (!value) return "Pocket square selection is required";
  //   return undefined;
  // },
  // jewelId: (value: string): string | undefined => {
  //   if (!value) return "Jewel selection is required";
  //   return undefined;
  // },
  // pantId: (value: string): string | undefined => {
  //   if (!value) return "Pant selection is required";
  //   return undefined;
  // },
  // socksId: (value: string): string | undefined => {
  //   if (!value) return "Socks selection is required";
  //   return undefined;
  // },
  // suspendersId: (value: string): string | undefined => {
  //   if (!value) return "Suspenders selection is required";
  //   return undefined;
  // },
  // images: (value: File[]): string | undefined => {
  //   if (!value || value.length === 0) return "At least one image is required";
  //   return undefined;
  // },
};

const AddFormalWearForm: React.FC<AddFormalWearFormProps> = ({
  isOpen = true,
  onClose,
  onSubmit,
  type="add",
  coats=[],
  // shirts = [],
  // vests=[],
  // shoes=[],
  // ties=[],
  // pocketSquares=[],
  // studsCufflinks=[],
  // pants=[],
  // shocks=[],
  // suspenders=[],
  colors,
  theme,
  selectedData,
  isSubmitting,
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
        setTimeout(() => element?.focus?.(), 300);
      });
    }
  };

  const initialValues = {
    // title: selectedData?.title || "",
    // colorId: selectedData?.colors?.id || "",
    // description: selectedData?.description || "",
    // detail: selectedData?.detail || "",
    // buy_price: selectedData?.buy_price || "",
    // rental_price: selectedData?.rental_price || "",
    coatId: selectedData?.coat?.id || "",
    // shirtId: selectedData?.shirt?.id || 0,
    // vestId: selectedData?.vest?.id || 0,
    // shoeId: selectedData?.shoe?.id || 0,
    // tieId: selectedData?.tie?.id || 0,
    // pocket_squareId: selectedData?.pocketSquare?.id || 0,
    // jewelId: selectedData?.jewel?.id || 0,
    // pantId: selectedData?.pant?.id || 0,
    // socksId: selectedData?.socks?.id || 0,
    // suspendersId: selectedData?.suspenders?.id || 0,
    //images: selectedData?.images || [],
  };

 

  const validate = (values: AddFormalWearFormValues): Partial<AddFormalWearFormValues> => {
    const errors: Partial<AddFormalWearFormValues> = {};

    Object.keys(addFormalWearValidationSchema).forEach((field) => {
      const error = addFormalWearValidationSchema[
        field as keyof typeof addFormalWearValidationSchema
      ]((values as any)[field]);
      if (error) {
        (errors as any)[field] = error;
      }
    });
    setErrors(errors);
    return errors;
  };

  const handleSubmit = (
    values: AddFormalWearFormValues,
    { setSubmitting, resetForm }: FormikHelpers<AddFormalWearFormValues>
  ): void => {
    const normalizedValues = {
      ...values,
      // buy_price:
      //   values.buy_price === undefined ||
      //   (typeof values.buy_price === "string" && values.buy_price === "")
      //     ? null
      //     : values.buy_price,
      // rental_price:
      //   values.rental_price === undefined ||
      //   (typeof values.rental_price === "string" && values.rental_price === "")
      //     ? null
      //     : values.rental_price,
    };

    if (onSubmit) {
      onSubmit(normalizedValues);
    }
    setSubmitting(false);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col
        ${theme ? "bg-[#FFFFFF] text-[#2D333C]" : "bg-[#2D333C] text-[#FFFFFF]"}`}
      >
        {/* Header - Fixed */}
        <div
          className={`flex items-center justify-between p-6 border-b flex-shrink-0 ${
            theme ? "border-blue-700" : "border-gray-500"
          }`}
        >
          <h2
            className={`text-xl font-semibold ${
              theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
            }`}
          >
            {type === "edit" ? "Edit Formal Wear" : "Add Formal Wear"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors cursor-pointer"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Single Formik wrapper for entire form */}
        <Formik<AddFormalWearFormValues>
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({
            values,
            setFieldValue,
            errors,
            touched,
            handleSubmit,
            isSubmitting: formIsSubmitting,
          }) => (
            <>
              {/* Scrollable Content */}
              <div
                className={`flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:w-2 ${
                  theme
                    ? "[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-gray-200"
                    : "[&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-track]:bg-slate-800"
                }
                [&::-webkit-scrollbar-thumb]:rounded-full`}
              >
                <div className="space-y-6 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    {/* <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Title
                      </label>
                      <Field
                        name="title"
                        placeholder="Enter formal wear title"
                        innerRef={(el: any) => (fieldRefs.current.title = el)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                          errors.title && touched.title
                            ? "border-red-500"
                            : "border-slate-600"
                        } ${
                          theme
                            ? "bg-white text-black"
                            : "bg-[#313A46] text-white"
                        }`}
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="text-red-400 text-sm mt-1"
                      />
                    </div> */}

                    {/* Color */}
                    {/* <div ref={(el: any) => (fieldRefs.current.colorId = el)}>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Color
                      </label>
                      <SelectField
                        name="colorId"
                        options={colors?.map((color) => ({
                          value: color.id,
                          label: color.name,
                          color: getColorCode(color.name),
                        }))}
                        isColor={true}
                        placeholder="Select Color"
                        bgColor={theme ? "#ffffff" : "#313A46"}
                        textColor={theme ? "#2D333C" : "#ffffff"}
                        borderColor={theme ? "#CBD5E1" : "#475569"}
                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                        disabled={isSubmitting}
                      />
                    </div> */}


                  </div>

                  {/* Description */}
                  {/* <div className="w-full">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                      }`}
                    >
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
                      className={`w-full px-3 py-2 border focus:outline-none rounded-lg placeholder-gray-400 
                        ${
                          theme
                            ? "bg-[#FFFFFF] text-[#2D333C]"
                            : "bg-[#313A46] text-[#FFFFFF]"
                        }
                        ${
                          errors.description && touched.description
                            ? "border-red-500"
                            : "border-slate-600"
                        }`}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div> */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Buy Price */}
                    {/* <div>
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
                    </div> */}

                    {/* Rental Price */}
                    {/* <div>
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
                    </div> */}

                    {/* Coat */}
                    <div ref={(el: any) => (fieldRefs.current.coatId = el)}>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Coat
                      </label>
                      <SelectField
                        name="coatId"
                        options={coats?.map((coat: CoatInterface) => ({
                          value: coat.id,
                          label: `${coat.style} - ${coat.description}`,
                        }))}
                        placeholder="Select Coat"
                        bgColor={theme ? "#ffffff" : "#313A46"}
                        textColor={theme ? "#2D333C" : "#ffffff"}
                        borderColor={theme ? "#CBD5E1" : "#475569"}
                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                        disabled={isSubmitting}
                      />
                      {values.coatId && (() => {
                        const selectedCoat = coats.find(
                          (coat) => coat.id === Number(values.coatId)
                        );

                        const coatImages = (selectedCoat as any)?.images || [];

                         return (
                          coatImages.length > 0 && (
                            <div className="relative mt-4 border border-slate-600 rounded-md p-3">
                              <button
                                onClick={() => setFieldValue("coatId", "")}
                                className="text-gray-400 transition-colors cursor-pointer absolute top-2 right-2"
                                type="button"
                              >
                                <X size={22} />
                              </button>

                              <div className="flex flex-wrap gap-2 mt-2">
                                  <img
                                    src={coatImages[0]}
                                    alt="Coat Preview"
                                    className="w-32 h-32 object-contain rounded-md shadow"
                                  />
                              
                              </div>
                            </div>
                          )
                        );
                      })()}
                    </div>
                  </div>

                  {/* Detail */}
                  {/* <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                      }`}
                    >
                      Details
                    </label>
                    <QuillEditor
                      setValue={setFieldValue}
                      value={values.detail}
                    />
                    <ErrorMessage
                      name="detail"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                    <br />
                  </div> */}
                </div>
              </div>

              {/* Fixed Save Button */}
              <div
                className={`flex-shrink-0 p-6 ${
                  theme
                    ? "bg-[#FFFFFF] border-gray-300"
                    : "bg-[#2D333C] border-slate-700"
                }`}
              >
                <div className="flex justify-start">
                  {formIsSubmitting || isSubmitting ? (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-2 w-35 rounded-sm h-10 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
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
                      </svg>
                      Saving...
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        handleSubmit();
                        scrollToError(errors);
                      }}
                      disabled={formIsSubmitting || isSubmitting}
                      className={`px-6 py-2 w-35 rounded-sm h-10 font-medium transition-colors cursor-pointer shadow ${
                        theme
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-white"
                      }
                    ${
                      formIsSubmitting || isSubmitting
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "text-gray-900"
                    }`}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddFormalWearForm;