import React, { useRef, useState } from 'react';
import { Formik, Field, ErrorMessage, FormikHelpers, Form } from 'formik';
import { X } from 'lucide-react';

// Types
interface AddCustomerFormValues {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    homeAddress: string;
    password: string;
    confirmPassword: string;
}

interface AddCustomerFormProps {
    isOpen?: boolean;
    type?: string;
    onClose?: () => void;
    onSubmit?: (values: AddCustomerFormValues) => void;
    onDelete?: () => void;
    theme?: boolean;
    selectedData?: any;
    isSubmitting?: boolean;
}

// Validation Schema
const addCustomerValidationSchema = {
    firstName: (value: string): string | undefined => {
        if (!value) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        if (value.length > 50) return 'First name must not exceed 50 characters';
        return undefined;
    },
    lastName: (value: string): string | undefined => {
        if (!value) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        if (value.length > 50) return 'Last name must not exceed 50 characters';
        return undefined;
    },
    phone: (value: string): string | undefined => {
        if (!value) return 'Phone number is required';
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
        return undefined;
    },
    email: (value: string): string | undefined => {
        if (!value) return 'Email address is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return undefined;
    },
    homeAddress: (value: string): string | undefined => {
        if (!value) return 'Home address is required';
        if (value.length < 10) return 'Address must be at least 10 characters';
        if (value.length > 200) return 'Address must not exceed 200 characters';
        return undefined;
    },
    password: (value: string): string | undefined => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value))
            return 'Password must contain both letters and numbers';
        return undefined;
    },
    confirmPassword: (value: string, values: AddCustomerFormValues): string | undefined => {
        if (!value) return 'Please confirm your password';
        if (value !== values.password) return 'Passwords do not match';
        return undefined;
    },
};

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({
    isOpen = true,
    type = 'add',
    onClose,
    onSubmit,
    onDelete,
    theme,
    selectedData,
    isSubmitting
}) => {
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
    const initialValues: AddCustomerFormValues = {
        firstName: selectedData?.firstName || '',
        lastName: selectedData?.lastName || '',
        phone: selectedData?.phone || '',
        email: selectedData?.email || '',
        homeAddress: selectedData?.homeAddress || '',
        password: selectedData?.password || '',
        confirmPassword: selectedData?.password || '',
    };

    const validate = (values: AddCustomerFormValues): Partial<AddCustomerFormValues> => {
        const errors: Partial<AddCustomerFormValues> = {};

        (Object.keys(addCustomerValidationSchema) as (keyof typeof addCustomerValidationSchema)[]).forEach((field) => {
            const validator = addCustomerValidationSchema[field];
            if (field === 'confirmPassword') {
                const error = validator(values[field], values);
                if (error) errors[field] = error;
            } else {
                const error = validator(values[field] as any, null);
                if (error) errors[field] = error;
            }
        });
        setErrors(errors);
        return errors;
    };

    const handleSubmit = (
        values: AddCustomerFormValues,
        { setSubmitting, resetForm }: FormikHelpers<AddCustomerFormValues>
    ): void => {
        if (onSubmit) {
            onSubmit(values);
        }
        setSubmitting(false);
        if (type === 'add') {
            resetForm();
        }
    };

    const handleDelete = (): void => {
        if (onDelete) {
            onDelete();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className={`rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col
                ${theme
                        ? "bg-[#FFFFFF] text-[#2D333C]"
                        : "bg-[#2D333C] text-[#FFFFFF]"}`
                }
            >
                {/* Header - Fixed */}
                <div className={`flex items-center justify-between p-6 border-b flex-shrink-0 ${theme ? "border-blue-700 " : "border-gray-500"}`}>
                   <h2
            className={`text-xl font-semibold ${
              theme ? "text-[#2D333C]" : "text-[#FFFFFF]"
            }`}
          >
            {type === "edit" ? "Edit Customer " : "Add new Customer"}
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
                <Formik
                    initialValues={initialValues}
                    validate={validate}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({ values, setFieldValue, errors, touched, handleSubmit, isSubmitting: formIsSubmitting }) => (
                        <>
                            {/* Scrollable Content */}
                            <div className={`flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:w-2 ${theme
                                ? "[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-gray-200"
                                : "[&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-track]:bg-slate-800"}
                        [&::-webkit-scrollbar-thumb]:rounded-full`}>

                                <div className="space-y-6 pb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"}`}>
                                                First name
                                            </label>
                                            <Field
                                                as="input"
                                                name="firstName"
                                                placeholder="Enter name"
                                                disabled={isSubmitting}
                                                innerRef={(el: any) => (fieldRefs.current.firstName = el)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.firstName && touched.firstName
                                                    ? 'border-red-500'
                                                    : 'border-slate-600'
                                                    } ${theme ? "bg-white text-black" : "bg-[#313A46] text-white"}`}
                                            />
                                            <ErrorMessage
                                                name="firstName"
                                                component="div"
                                                className="text-red-400 text-sm mt-1"
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"}`}>
                                                Last name
                                            </label>
                                            <Field
                                                as="input"
                                                name="lastName"
                                                placeholder="Enter last name"
                                                disabled={isSubmitting}
                                                innerRef={(el: any) => (fieldRefs.current.lastName = el)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.lastName && touched.lastName
                                                    ? 'border-red-500'
                                                    : 'border-slate-600'
                                                    } ${theme ? "bg-white text-black" : "bg-[#313A46] text-white"}`}
                                            />
                                            <ErrorMessage
                                                name="lastName"
                                                component="div"
                                                className="text-red-400 text-sm mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number and Email Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"}`}>
                                                Phone number
                                            </label>
                                            <Field
                                                as="input"
                                                name="phone"
                                                type="tel"
                                                placeholder="Enter number"
                                                disabled={isSubmitting}
                                                innerRef={(el: any) => (fieldRefs.current.phone = el)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.phone && touched.phone
                                                    ? 'border-red-500'
                                                    : 'border-slate-600'
                                                    } ${theme ? "bg-white text-black" : "bg-[#313A46] text-white"}`}
                                            />
                                            <ErrorMessage
                                                name="phone"
                                                component="div"
                                                className="text-red-400 text-sm mt-1"
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"}`}>
                                                E-mail address
                                            </label>
                                            <Field
                                                as="input"
                                                name="email"
                                                type="email"
                                                placeholder="Enter email"
                                                disabled={isSubmitting || type === "edit"}
                                                innerRef={(el: any) => (fieldRefs.current.email = el)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.email && touched.email
                                                    ? 'border-red-500'
                                                    : 'border-slate-600'
                                                    } ${theme ? "bg-white text-black" : "bg-[#313A46] text-white"}
                                                     ${type === "edit" ? "cursor-not-allowed opacity-75" : ""}`}
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="div"
                                                className="text-red-400 text-sm mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Home Address */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme ? "text-[#2D333C]" : "text-[#FFFFFF]"}`}>
                                            Home address
                                        </label>
                                        <Field
                                            as="textarea"
                                            name="homeAddress"
                                            placeholder="Enter address"
                                            rows={3}
                                            disabled={isSubmitting}
                                            innerRef={(el: any) => (fieldRefs.current.homeAddress = el)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.homeAddress && touched.homeAddress
                                                ? 'border-red-500'
                                                : 'border-slate-600'
                                                } ${theme ? "bg-white text-black" : "bg-[#313A46] text-white"}`}
                                        />
                                        <ErrorMessage
                                            name="homeAddress"
                                            component="div"
                                            className="text-red-400 text-sm mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Password</label>
                                        <Field
                                            as="input"
                                            type="password"
                                            name="password"
                                            placeholder="Enter password"
                                            disabled={isSubmitting}
                                            innerRef={(el: any) => (fieldRefs.current.password = el)}
                                            className={`w-full px-3 py-2 border rounded-lg ${errors.password && touched.password ? 'border-red-500' : 'border-slate-600'} ${theme ? "bg-white text-black" : "bg-[#313A46] text-white"}`}
                                        />
                                        <ErrorMessage name="password" component="div" className="text-red-400 text-sm mt-1" />
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                                        <Field
                                            as="input"
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Re-enter password"
                                            disabled={isSubmitting}
                                            innerRef={(el: any) => (fieldRefs.current.confirmPassword = el)}
                                            className={`w-full px-3 py-2 border rounded-lg ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-slate-600'} ${theme ? "bg-white text-black" : "bg-[#313A46] text-white"}`}
                                        />
                                        <ErrorMessage name="confirmPassword" component="div" className="text-red-400 text-sm mt-1" />
                                    </div>

                                </div>
                            </div>

                            {/* Fixed Save Button */}
                            <div className={`flex-shrink-0 p-6 ${theme ? "bg-[#FFFFFF] border-gray-300" : "bg-[#2D333C] border-slate-700"}`}>
                                <div className="flex justify-start">
                                    {formIsSubmitting || isSubmitting ? <button
                                        type="submit"

                                        disabled={isSubmitting}
                                        className={` px-6 py-2 w-35 rounded-sm h-10 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${theme ? "bg-slate-300" : "bg-white"}
                                                    ${isSubmitting ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "text-gray-900 hover:bg-gray-300"}`}
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
                                        </svg> {type === "edit" ? "Updating..." : "Adding..."}
                                    </button> : <button
                                        type="button"
                                        onClick={() => {
                                            handleSubmit();
                                            scrollToError(errors);
                                        }}
                                        disabled={formIsSubmitting || isSubmitting}
                                        className={`px-6 py-2 w-40 rounded-sm h-10 font-medium transition-colors cursor-pointer shadow ${theme ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-white"}
                                                ${formIsSubmitting || isSubmitting ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "text-gray-900"}`}
                                    >
                                        {type === "edit" ? "Edit Customer" : "Add Customer"}
                                    </button>}
                                </div>
                            </div>
                        </>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddCustomerForm;