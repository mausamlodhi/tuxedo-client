import React, { useRef, useState } from "react";
import { Formik, Field, ErrorMessage, FormikHelpers } from "formik";
import { X } from "lucide-react";
import SelectField from "../common/selectField";
import { getColorCode } from "@/utils";
import ImageUpload from "../common/imageUploadField";
import modalNotification from "@/utils/notification";
import QuillEditor from "../common/quillEditor";
import {tier} from "@/utils/constant";

// Types
interface AddCoatFormValues {
  style: string;
  colorId: string;
  pant_slim_fit: number;
  pant_ultra_slim_fit: number;
  matching_shirt: string;
  matching_vest: string;
  matching_shoe: string;
  matching_tie: string;
  matching_pocket_square: string;
  matching_jewel: number;
  buy_price?: number;
  rental_price?: number;
  description: string;
  images: File[];
  collection: string;
  detail: string;
}

interface AddCoatFormProps {
  isOpen?: boolean;
  type?: string;
  onClose?: () => void;
  onSubmit?: (values: AddCoatFormValues) => void;
  shirts?: ShirtInterface[];
  vests: VestInterface[];
  shoes: ShoesInterface[];
  ties: TieInterface[];
  pocketSquares: PocketSquareInterface[];
  jewels?: JewelInterface[];
  colors: ColorInterface[];
  pants: PantInterface[];
  theme?: boolean | object;
  selectedData: any;
  slimFitPants: PantInterface[];
  ultraSlimFitPants: PantInterface[];
  isSubmitting?: boolean;
  setSelectedId?: (id: number) => void;
  collections: CollectionInterface[];
}

// Validation Schema
const addCoatValidationSchema = {
  style: (value: string): string | undefined => {
    if (!value) return "Coat style is required";
    if (value.length < 3) return "Coat Style must be at least 3 characters";
    if (value.length > 16) return "Coat Style must not exceed 16 characters";
    return undefined;
  },
  buy_price: (value: string): string | undefined => {
    if (value && Number(value) <= 0) {
      return "Buy price must be positive";
    }
    return undefined; // valid if empty
  },

  rental_price: (value: string): string | undefined => {
    if (!value) return "Rental price is required";
    return undefined;
  },
  colorId: (value: string): string | undefined => {
    if (!value) return "Color is required";
    return undefined;
  },
  pant_slim_fit: (value: string): string | undefined => {
    if (!value) return "Pant Slim fit selection is required";
    return undefined;
  },
  pant_ultra_slim_fit: (value: string): string | undefined => {
    if (!value) return "Pant Ultra slim selection is required";
    return undefined;
  },
  matching_shirt: (value: string): string | undefined => {
    if (!value) return "Matching shirt selection is required";
    return undefined;
  },
  matching_vest: (value: string): string | undefined => {
    if (!value) return "Matching vest selection is required";
    return undefined;
  },
  matching_shoe: (value: string): string | undefined => {
    if (!value) return "Matching shoe selection is required";
    return undefined;
  },
  matching_tie: (value: string): string | undefined => {
    if (!value) return "Matching tie selection is required";
    return undefined;
  },
  matching_pocket_square: (value: string): string | undefined => {
    if (!value) return "Pocket square selection is required";
    return undefined;
  },
  matching_jewel: (value: string): string | undefined => {
    if (!value) return "Jewel selection is required";
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

const AddCoatForm: React.FC<AddCoatFormProps> = ({
  isOpen = true,
  onClose,
  onSubmit,
  type = "add",
  shirts = [],
  vests,
  shoes,
  ties,
  pocketSquares,
  jewels,
  pants,
  colors,
  theme,
  selectedData,
  slimFitPants,
  ultraSlimFitPants,
  isSubmitting,
  collections,
  setSelectedId,
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
    pant_slim_fit: selectedData?.id ? selectedData?.pantSlimFit?.id || "#":0,
    pant_ultra_slim_fit: selectedData?.id ? selectedData?.pantUltraSlimFit?.id || "#":0,
    matching_shirt: selectedData?.id ? selectedData?.shirt?.id || "#":0,
    matching_vest: selectedData?.id ? selectedData?.vest?.id || "#":0,
    matching_shoe: selectedData?.id ? selectedData?.shoe?.id || "#":0,
    matching_tie: selectedData?.id ? selectedData?.tie?.id || "#":0,
    matching_pocket_square: selectedData?.id ? selectedData?.pocketsquare?.id || "#":0,
    matching_jewel: selectedData?.id ? selectedData?.jewellery?.id || "#":0,
    description: selectedData?.description || "",
    images: selectedData?.images || [],
    buy_price: selectedData?.buy_price || "",
    rental_price: selectedData?.rental_price || "",
    detail: selectedData?.detail || "",
    collection: selectedData?.collection,
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
    values: AddCoatFormValues
  ): void => {
    const newImages: File[] = values.images.filter((_, i) => i !== index);
    setFieldValue("images", newImages);
  };

  const validate = (values: AddCoatFormValues): Partial<AddCoatFormValues> => {
    const errors: Partial<AddCoatFormValues> = {};

    Object.keys(addCoatValidationSchema).forEach((field) => {
      const error = addCoatValidationSchema[
        field as keyof typeof addCoatValidationSchema
      ]((values as any)[field]);
      if (error) {
        (errors as any)[field] = error;
      }
    });
    setErrors(errors);
    return errors;
  };

  const handleSubmit = (
    values: AddCoatFormValues,
    { setSubmitting, resetForm }: FormikHelpers<AddCoatFormValues>
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
    }
    setSubmitting(false);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col
        ${
          theme ? "bg-[#FFFFFF] text-[#2D333C]" : "bg-[#2D333C] text-[#FFFFFF]"
        }`}
      >
        {/* Header - Fixed */}
        <div
          className={`flex items-center justify-between p-6 border-b flex-shrink-0 ${
            theme ? "border-blue-700 " : "border-gray-500"
          }`}
        >
          <h2
            className={`text-xl font-semibold ${
              theme ? "text-[#2D333C] " : "text-[#FFFFFF]"
            }`}
          >
            {type === "edit" ? "Edit Coat" : "Add Coat"}
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
        <Formik<AddCoatFormValues>
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
                    {/* Coat Style */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Coat Style
                      </label>
                      <Field
                        name="style"
                        placeholder="Enter coat style"
                        innerRef={(el: any) => (fieldRefs.current.style = el)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                          errors.style && touched.style
                            ? "border-red-500"
                            : "border-slate-600"
                        } ${
                          theme
                            ? "bg-white text-black"
                            : "bg-[#313A46] text-white"
                        }`}
                      />
                      <ErrorMessage
                        name="style"
                        component="div"
                        className="text-red-400 text-sm mt-1"
                      />
                    </div>

                    {/* Color */}
                    <div ref={(el: any) => (fieldRefs.current.colorId = el)}>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Color
                      </label>
                      <SelectField
                        name="colorId"
                        options={colors.map((color) => ({
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
                    </div>
                  </div>
                

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    {/* Slim Fit */}
                    <div
                      ref={(el: any) => (fieldRefs.current.pant_slim_fit = el)}
                    >
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Pant Slim Fit
                      </label>
                      <SelectField
                        name="pant_slim_fit"
                        options={slimFitPants.map((pant: PantInterface) => ({
                          value: pant.id,
                          label: `${pant.style} - ${pant.description}`,
                        }))}
                        placeholder="Select Slim Fit Pant"
                        bgColor={theme ? "#ffffff" : "#313A46"}
                        textColor={theme ? "#2D333C" : "#ffffff"}
                        borderColor={theme ? "#CBD5E1" : "#475569"}
                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Ultra Slim */}
                    <div
                      ref={(el: any) =>
                        (fieldRefs.current.pant_ultra_slim_fit = el)
                      }
                    >
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Pant Ultra Slim
                      </label>
                      <SelectField
                        name="pant_ultra_slim_fit"
                        options={ultraSlimFitPants.map(
                          (pant: PantInterface) => ({
                            value: pant.id,
                            label: `${pant.style} - ${pant.description}`,
                          })
                        )}
                        placeholder="Select Ultra Slim Pant"
                        bgColor={theme ? "#ffffff" : "#313A46"}
                        textColor={theme ? "#2D333C" : "#ffffff"}
                        borderColor={theme ? "#CBD5E1" : "#475569"}
                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Matching Shirt */}
                    <div
                      ref={(el: any) => (fieldRefs.current.matching_shirt = el)}
                    >
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Matching Shirt
                      </label>
                      <SelectField
                        name="matching_shirt"
                        options={shirts.map((shirt: ShirtInterface) => ({
                          value: shirt.id,
                          label: `${shirt.style} - ${shirt.description}`,
                        }))}
                        placeholder="Select Matching Shirt"
                        bgColor={theme ? "#ffffff" : "#313A46"}
                        textColor={theme ? "#2D333C" : "#ffffff"}
                        borderColor={theme ? "#CBD5E1" : "#475569"}
                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                        disabled={isSubmitting}
                        setSelectedId={setSelectedId}
                      />
                    </div>

                    {/* Matching Vest */}
                    <div
                      ref={(el: any) => (fieldRefs.current.matching_vest = el)}
                    >
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Matching Vest
                      </label>
                      <SelectField
                        name="matching_vest"
                        options={vests.map((vest: VestInterface) => ({
                          value: vest.id,
                          label: `${vest.style} - ${vest.description}`,
                        }))}
                        placeholder="Select Matching Vest"
                        bgColor={theme ? "#ffffff" : "#313A46"}
                        textColor={theme ? "#2D333C" : "#ffffff"}
                        borderColor={theme ? "#CBD5E1" : "#475569"}
                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Matching Shoe */}
                    <div
                      ref={(el: any) => (fieldRefs.current.matching_shoe = el)}
                    >
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Matching Shoe
                      </label>
                      <SelectField
                        name="matching_shoe"
                        options={shoes.map((shoe: ShoesInterface) => ({
                          value: shoe.id,
                          label: `${shoe.style} - ${shoe.description}`,
                        }))}
                        placeholder="Select Matching Shoe"
                        bgColor={theme ? "#ffffff" : "#313A46"}
                        textColor={theme ? "#2D333C" : "#ffffff"}
                        borderColor={theme ? "#CBD5E1" : "#475569"}
                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Matching Tie */}
                    <div
                      ref={(el: any) => (fieldRefs.current.matching_tie = el)}
                    >
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Matching Tie
                      </label>
                      <SelectField
                        name="matching_tie"
                        options={ties.map((tie: TieInterface) => ({
                          value: tie.id,
                          label: `${tie.style} - ${tie.description}`,
                        }))}
                        placeholder="Select Matching Tie"
                        bgColor={theme ? "#ffffff" : "#313A46"}
                        textColor={theme ? "#2D333C" : "#ffffff"}
                        borderColor={theme ? "#CBD5E1" : "#475569"}
                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                        disabled={isSubmitting}
                      />
                    </div>
                    {/* Pocket Square */}
                    <div
                      ref={(el: any) =>
                        (fieldRefs.current.matching_pocket_square = el)
                      }
                    >
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Pocket Square
                      </label>
                      <SelectField
                        name="matching_pocket_square"
                        options={pocketSquares.map(
                          (fit: PocketSquareInterface) => ({
                            value: fit.id,
                            label: `${fit.style} - ${fit.description}`,
                          })
                        )}
                        placeholder="Select Pocket Square"
                        bgColor={theme ? "#ffffff" : "#313A46"}
                        textColor={theme ? "#2D333C" : "#ffffff"}
                        borderColor={theme ? "#CBD5E1" : "#475569"}
                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Jewel */}
                    <div
                      ref={(el: any) => (fieldRefs.current.matching_jewel = el)}
                    >
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Studs & Cufflinks
                      </label>
                      <SelectField
                        name="matching_jewel"
                        options={jewels.map((fit: JewelInterface) => ({
                          value: fit.id,
                          label: `${fit.style} - ${fit.description}`,
                        }))}
                        placeholder="Select Jewel"
                        bgColor={theme ? "#ffffff" : "#313A46"}
                        textColor={theme ? "#2D333C" : "#ffffff"}
                        borderColor={theme ? "#CBD5E1" : "#475569"}
                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                        disabled={isSubmitting}
                      />
                    </div>
                    {/* Coat Collection */}
                    <div ref={(el: any) => (fieldRefs.current.collection = el)}>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Coat Collection
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
                   <div
                      ref={(el: any) => (fieldRefs.current.tier = el)}
                    >
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
                        }`}
                      >
                        Select Tier
                      </label>
                      <SelectField
                        name="tier"
                        options={tier.map((tier) => ({
                          value: tier.value,
                          label: tier.label,
                        }))}
                        placeholder="Select Tier"
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
  {/* Description */}
                  <div className="w-full">
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
                      setValue={setFieldValue}
                      value={values.detail}
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

export default AddCoatForm;
