import React, { useRef, useState } from 'react';
import { Formik, Field, ErrorMessage, FormikHelpers, Form } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import modalNotification from '@/utils/notification';
import SelectField from '../common/selectField';
import { getColorCode } from '@/utils';
import ImageModal from '../modal/image.modal';
import { FormikColorPicker } from './formikColorPicker';
import logger from '@/utils/logger';
import ImageUpload from '../common/imageUploadField';
interface AddCollectionFormValues {
    name: string;
    categoryId?: number;
    colorId?: number;
    texture?: string;
    textureColors?: number[];
    texturecolor1: string;
    texturecolor2: string;
    bgColor: string;
    tie_type?: string;
    hasReferenceImage: boolean | string;
    images:File[]
}

interface AddCollectionFormProps {
    isOpen?: boolean;
    onClose?: () => void;
    colors: ColorInterface[];
    onSubmit?: (values: AddCollectionFormValues) => void;
    type?: string;
    theme?: boolean | object;
    selectedData?: any;
    isSubmitting?: boolean;
    inventory: InventoryInterface[]
    collectionData: { image: File }[]
    handleGenerateImages: (data: any) => void
    generated: boolean;
    generating: boolean;
}

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required("Collection name is required")
        .max(50, "Collection name be at most 25 characters"),
    // bgColor: Yup.string().required("Background color is required"),
    // colorId: Yup.number().required("Color is required"),
    // texture: Yup.string().required("Texture is required"),
    // textureColors: Yup.array().when("texture", {
    //     is: (val: string) => val === "checks" || val === "stripes",
    //     then: (schema) =>
    //         schema.min(1, "At least one texture color is required"),
    //     otherwise: (schema) => schema.notRequired(),
    // }),
    texturecolor1: Yup.string().when("textureColors", {
        is: (val: string) => val === "checks",
        then: (schema) =>
            schema.min(1, "Texture color is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    texturecolor2: Yup.string().when("textureColors", {
        is: (val: string) => val === "checks",
        then: (schema) =>
            schema.min(1, "Texture color is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
});

const AddCollectionForm: React.FC<AddCollectionFormProps> = ({
    isOpen = true,
    onClose,
    onSubmit,
    type,
    theme,
    selectedData,
    isSubmitting,
    colors,
    inventory,
    collectionData,
    handleGenerateImages,
    generated,
    generating
}) => {
    const [dragActive, setDragActive] = useState<boolean>(false);
    const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
    const [errors, setErrors] = useState<any>({});
    const [selectedImage, setSelectedImage] = useState([]);
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
    const removeImage = (
        index: number,
        setFieldValue: (field: string, value: any) => void,
        values: AddCollectionFormValues
    ): void => {
        const newImages: File[] = values.images.filter((_, i) => i !== index);
        setFieldValue("images", newImages);
    };
    const initialValues: AddCollectionFormValues = {
        name: selectedData?.name || "",
        categoryId: selectedData?.categoryId,
        colorId: selectedData?.colorId || undefined,
        texture: selectedData?.texture || "",
        textureColors: selectedData?.textureColors || [],
        texturecolor1: selectedData?.texturecolor1 || "#000000",
        texturecolor2: selectedData?.texturecolor2 || "#000000",
        bgColor: "",
        tie_type: selectedData?.tie_type || undefined,
        hasReferenceImage: "no",
        images:[]
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
                type: 'error',
                message: 'Only image files are allowed.',
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
                type: 'error',
                message: 'Only image files are allowed.',
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

    // const validate = (values: AddCollectionFormValues): Partial<AddCollectionFormValues> => {
    //   const errors: Partial<AddCollectionFormValues> = {};

    //   (Object.keys(validationSchema) as Array<keyof AddCollectionFormValues>).forEach((field) => {
    //     const validator = validationSchema[field as keyof typeof validationSchema] as (value: any) => string | undefined;
    //     const error = validator(values[field]);
    //     if (error) {
    //       (errors as any)[field] = error;
    //     }
    //   });
    //   setErrors(errors);
    //   return errors;
    // };

    const validate = (values: AddCollectionFormValues): Partial<AddCollectionFormValues> => {
        const errors: Partial<AddCollectionFormValues> = {};

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
        values: AddCollectionFormValues,
        { setSubmitting, resetForm }: FormikHelpers<AddCollectionFormValues>
    ): void => {
        const finalValues = {
            ...values,
            // categoryId: 8, // force categoryId for jewelry
        };
        if (onSubmit) {
            onSubmit(finalValues);
        }

        setSubmitting(false);
        resetForm();
    };

    if (!isOpen) return null;
    logger(errors, "errorsrere")
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className={`rounded-lg w-full max-w-5xl max-h-[95vh] flex flex-col
        ${theme ? "bg-[#FFFFFF] text-[#2D333C]" : "bg-[#2D333C] text-[#FFFFFF]"}`}
            >
                {/* Header */}
                <div
                    className={`flex items-center justify-between p-6 border-b flex-shrink-0 ${theme ? "border-blue-700 " : "border-gray-500"}`}
                >
                    <h2 className={`text-xl font-semibold ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"}`}>
                        Add Collection
                    </h2>
                    <button onClick={onClose} className="text-gray-400 cursor-pointer" type="button">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6">
                    <Formik<AddCollectionFormValues>
                        initialValues={initialValues}
                        validate={validate}
                        onSubmit={handleSubmit}
                    >
                        {({ values, setFieldValue, errors, touched, handleSubmit }) => (
                            <Form className="flex flex-col max-h-[75vh]">
                                <div className={`flex-1 p-6 ${values?.hasReferenceImage==='yes'?"overflow-y-auto":''} [&::-webkit-scrollbar]:w-2 ${theme
                                    ? "[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-gray-200"
                                    : "[&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-track]:bg-slate-800"}
                [&::-webkit-scrollbar-thumb]:rounded-full`}>
                                    {/* Prices */}
                                    <div className="grid grid-cols-2 gap-6 mt-4">
                                        <div ref={(el: any) => (fieldRefs.current.categoryId = el)}>
                                            <label className="block text-sm font-medium mb-2">Select Category</label>
                                            <SelectField
                                                name="categoryId"
                                                options={inventory.map((color) => ({
                                                    value: color.id,
                                                    label: color.name,
                                                }))}
                                                placeholder="Select Category"
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
                                            <label className="block text-sm font-medium mb-2">Collection name</label>
                                            <Field
                                                as="input"
                                                name="name"
                                                placeholder="Enter collection name"
                                                innerRef={(el: any) => (fieldRefs.current.style = el)}
                                                className={`w-full px-3 py-2 bg-[#313A46] border rounded-lg focus:outline-none ${errors.name && touched.name
                                                    ? 'border-red-500'
                                                    : 'border-slate-600'
                                                    } ${theme ? "bg-white text-black-700" : "bg-[#313A46] text-white"} ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                            />
                                            <ErrorMessage name="name" component="div" className="text-red-400 text-sm mt-1" />
                                        </div>
                                        {![6,8,11].includes(values?.categoryId)?
                                        <div className="mt-1">
                                            <label className="block text-sm font-medium mb-3">
                                                Do you have a reference image?
                                            </label>

                                            <div className="flex items-center gap-6">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <Field
                                                        type="radio"
                                                        name="hasReferenceImage"
                                                        value="yes"
                                                        className="text-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span>Yes</span>
                                                </label>

                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <Field
                                                        type="radio"
                                                        name="hasReferenceImage"
                                                        value="no"
                                                        className="text-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span>No</span>
                                                </label>
                                            </div>

                                            <ErrorMessage
                                                name="hasReferenceImage"
                                                component="div"
                                                className="text-red-400 text-sm mt-1"
                                            />
                                        </div>:null}
                                        
                                        {
                                            values?.categoryId === 7 ?
                                                <div ref={(el: any) => (fieldRefs.current.categoryId = el)}>
                                                    <label className="block text-sm font-medium mb-2">Select Tie Type</label>
                                                    <SelectField
                                                        name="tie_type"
                                                        options={[{
                                                            id: "bow-tie", name: "Bow Tie"
                                                        }, {
                                                            id: "neck-tie", name: "Neck Tie"
                                                        }].map((color) => ({
                                                            value: color.id,
                                                            label: color.name,
                                                        }))}
                                                        placeholder="Selecte tie type"
                                                        bgColor={theme ? "#ffffff" : "#313A46"}
                                                        textColor={theme ? "#2D333C" : "#ffffff"}
                                                        borderColor={theme ? "#CBD5E1" : "#475569"}
                                                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                                                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                                                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                                                        disabled={isSubmitting}
                                                    />
                                                </div> : null
                                        }

                                    </div>
                                    <div className="grid grid-cols-2 gap-6 mt-4">
                                        {values?.hasReferenceImage === 'no' ? <>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Texture</label>
                                                <SelectField
                                                    name="texture"
                                                    options={[
                                                        { value: "plain", label: "Plain" },
                                                        { value: "checks", label: "Checks" },
                                                        { value: "stripes", label: "Stripes" },
                                                    ]}
                                                    placeholder="Select Texture"
                                                    bgColor={theme ? "#ffffff" : "#313A46"}
                                                    textColor={theme ? "#2D333C" : "#ffffff"}
                                                    borderColor={theme ? "#CBD5E1" : "#475569"}
                                                    menuBgColor={theme ? "#ffffff" : "#313A46"}
                                                    optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                                                    optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                                                    disabled={isSubmitting}
                                                />

                                                {(values.texture === "checks" || values.texture === "stripes") && (
                                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                                        <FormikColorPicker
                                                            name="texturecolor1"
                                                            label="Texture Color 1"
                                                            presets={["#fff", "#000", "#D6A680"]}
                                                        />
                                                        <FormikColorPicker
                                                            name="texturecolor2"
                                                            label="Texture Color 2"
                                                            presets={["#fff", "#000", "#D6A680"]}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div ref={(el: any) => (fieldRefs.current.categoryId = el)}>
                                                    <label className="block text-sm font-medium mb-2">Background Color</label>
                                                    <SelectField
                                                        name="bgColor"
                                                        options={[{ id: "black", name: "Black" }, { id: "white", name: "White" }].map((color) => ({
                                                            value: color.id,
                                                            label: color.name,
                                                        }))}
                                                        placeholder="Select Category"
                                                        bgColor={theme ? "#ffffff" : "#313A46"}
                                                        textColor={theme ? "#2D333C" : "#ffffff"}
                                                        borderColor={theme ? "#CBD5E1" : "#475569"}
                                                        menuBgColor={theme ? "#ffffff" : "#313A46"}
                                                        optionSelectedBg={theme ? "#E2E8F0" : "#475569"}
                                                        optionHoverBg={theme ? "#F1F5F9" : "#3B4756"}
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                                <div ref={(el: any) => (fieldRefs.current.colorId = el)} className='mt-1'>
                                                    <Field name="colorHex" >
                                                        {() => (
                                                            <FormikColorPicker name="colorHex" label="Color" presets={["#ffffff", "#000000", "#D6A680"]} />
                                                        )}
                                                    </Field>
                                                    <ErrorMessage name="colorHex" component="div" className="text-red-400 text-sm mt-1" />
                                                </div>
                                            </div>
                                        </> : null}
                                    </div>
                                    {values?.hasReferenceImage==="yes"?<div ref={(el: any) => (fieldRefs.current.images = el)}>
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
                                        </div>:null}
                                    {collectionData?.length > 0 && (
                                        <div className="p-4 grid grid-cols-3 gap-4">
                                            {collectionData.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="w-full h-40 cursor-pointer bg-gray-200 rounded-md overflow-hidden flex items-center justify-center"
                                                >
                                                    <img
                                                        src={URL.createObjectURL(item?.image)}
                                                        alt={`preview-${idx}`}
                                                        onClick={() => setSelectedImage([URL.createObjectURL(item?.image)])}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* Footer */}
                                <div
                                    className={`sticky bottom-0 w-full px-6 py-4 ${theme ? "bg-white border-gray-200" : "bg-[#2D333C] border-slate-700"
                                        } flex justify-start gap-4`}
                                >
                                    {/* Generate Images */}
                                    <button
                                        type="submit"
                                        onClick={async () => {
                                            const formErrors = validate(values);
                                            if (Object.keys(formErrors).length > 0) {
                                                scrollToError(formErrors);
                                                return;
                                            }
                                            try {
                                                logger(values, "valuesssss");
                                                handleGenerateImages(values);
                                            } catch (err) {
                                                modalNotification({
                                                    type: "error",
                                                    message: "Failed to generate images.",
                                                });
                                            }
                                        }}
                                        disabled={generating || isSubmitting}
                                        className={`px-6 py-2 disabled:cursor-not-allowed rounded-sm h-10 font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${generating
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : theme
                                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                                : "bg-white text-gray-900 hover:bg-gray-300"
                                            }`}
                                    >
                                        {generating ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5 text-current"
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
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                    ></path>
                                                </svg>
                                                <span>Generating...</span>
                                            </>
                                        ) : (
                                            "Generate Images"
                                        )}
                                    </button>


                                    {/* Save */}
                                    <button
                                        type="submit"
                                        onClick={() => {
                                            handleSubmit();
                                            scrollToError(errors);
                                        }}
                                        disabled={!generated || isSubmitting}
                                        className={`px-6 py-2 rounded-sm h-10 font-medium transition-colors cursor-pointer ${!generated || isSubmitting
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : theme
                                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                                : "bg-white text-gray-900 hover:bg-gray-300"
                                            }`}
                                    >
                                        {isSubmitting ? "Saving..." : "Save"}
                                    </button>
                                </div>

                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            {selectedImage?.length ?
                <ImageModal
                    theme={theme}
                    images={selectedImage}
                    alt="Preview"
                    onClose={() => setSelectedImage(null)}
                /> : null}
        </div>
    );
};

export default AddCollectionForm;
