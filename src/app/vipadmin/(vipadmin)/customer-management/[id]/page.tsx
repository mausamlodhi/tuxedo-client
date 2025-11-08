"use client";

import React, { useState, useEffect } from "react";
import modalNotification from "@/utils/notification";
import { selectAuthData } from "@/app/redux/slice/auth.slice";
import AddProductButton from "@/components/admin/addProducts";
import DataTable from "@/components/admin/dataTable";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { CustomerManagementServices } from "@/servivces/admin/customer/customer.service";
import logger from "@/utils/logger";
import DeleteConfirmationModal from "@/components/modal/delete.modal";
import AddCustomerForm from "@/components/forms/addNewCustomerForm";

interface TableHeader {
    key: string;
    label: string;
    type?: "text" | "image" | "badge" | string;
}

interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    recentOrder: { label: string; type: "wedding" | "single" | "promo" };
}

interface Order {
    id: string;
    itemPhoto: string;
    productName: string;
    orderDate: string;
    eventDate: string;
    buyOrRent: string;
    orderStatus: { label: string; type: "completed" | "pending" | "confirmed" | "delivered" | "cancelled" };
}

const CustomerManagement: React.FC = () => {
    const authData = useSelector(selectAuthData);
    const { id } = useParams();
    const router = useRouter();
    const theme = authData?.admin?.theme;



    const [customerDetails, setCustomerDetails] = useState<Customer | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(0);

    const customerDetailFetch = async (id: number) => {
        try {
            const response = await CustomerManagementServices.CustomerDetails(id);
            if (response?.status) {
             
        modalNotification({
          message: response?.message || "Failed to fetch customer details",
          type: "success",
        });
      

                setCustomerDetails(response?.data);
            }

            else {
     
      modalNotification({
        message: response?.message || "Failed to fetch customer details ",
        type: "error",
      });
    }
        } catch (error) {
             modalNotification({
      message: error.message || "Something went wrong. Please try again later.",
      type: "error",
    });
            logger("Error : ", error);
        }
    };

    useEffect(() => {
        if (id) {
            customerDetailFetch(Number(id));
        }
    }, [id]);



    const handleAddCustomer = async (customerData: any) => {
        try {
            setIsSubmitting(true);
            const response = await CustomerManagementServices.createCustomer(customerData);
            if (response?.status) {
                modalNotification({
                    message: response?.message || "Customer added successfully",
                    type: "success",
                });
                router.back();
            }
            else{
        modalNotification({
          message: response?.message || "Failed to add customer",
          type: "error",
        });
      }
        } catch (error) {
             modalNotification({
      message: error.message || "Something went wrong. Please try again later.",
      type: "error",
    });
            logger("Error : ", error);
        }
        setIsCustomerFormOpen(false);
        setIsSubmitting(false);
    };


    const handleDeleteCustomer = async () => {
        try {
            const response = await CustomerManagementServices.deleteCustomer(selectedCustomer);
            if (response?.status) {
                // getAllCustomer();
                modalNotification({
                    message: response?.message || "Customer deleted successfully",
                    type: "success",
                });
                router.back();
            }

            else{
        modalNotification({
          message: response?.message || "Failed to delete Customers",
          type: "error",
        });
      }
            setIsDeleteModalOpen(false);
            setDeleteMessage('');
            setConfirmMessage('');
            setSelectedCustomer(0);
        } catch (error) {

             modalNotification({
      message: error.message || "Something went wrong. Please try again later.",
      type: "error",
    });
            logger("Error : ", error);
        }
    };

    const handleDelete = (id: number) => {
        setSelectedCustomer(id);
        setIsDeleteModalOpen(true);
    };


    const sampleOrders: Order[] = [
        {
            id: "524562",
            itemPhoto: "/api/placeholder/60/60",
            productName: "Contrast Shawl Jacket Tuxedo",
            orderDate: "08 Aug, 2025",
            eventDate: "13 Sep, 2025",
            buyOrRent: "Buy",
            orderStatus: { label: "cancelled", type: "cancelled" },
        },
        {
            id: "524563",
            itemPhoto: "/api/placeholder/60/60",
            productName: "Contrast Shawl Jacket Tuxedo",
            orderDate: "08 Aug, 2025",
            eventDate: "13 Sep, 2025",
            buyOrRent: "Rent",
            orderStatus: { label: "pending", type: "pending" },
        },
    ];

    const orderHeaders: TableHeader[] = [
        { key: "id", label: "Order ID", type: "text" },
        { key: "itemPhoto", label: "Item Photo", type: "image" },
        { key: "productName", label: "Product Name", type: "text" },
        { key: "orderDate", label: "Order Date", type: "text" },
        { key: "eventDate", label: "Event Date", type: "text" },
        { key: "buyOrRent", label: "Buy or Rent", type: "text" },
        { key: "orderStatus", label: "Order Status", type: "badge" },
    ];

    const handleView = (id: number) => console.log("View order:", id);
    const handleEdit = (id: string) => console.log("Edit order:", id);


    

    return (
        <>
            <div className="flex flex-col lg:flex-row px-8">
                <h1
                    className={`${theme ? "text-[#313A46]" : "text-[#C1C1C1]"
                        } text-xl sm:text-2xl md:mt-14 font-semibold hidden sm:block`}
                >
                    Customer Management
                </h1>

                <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 flex ml-auto">
                    <AddProductButton
                        label="Add Customer"
                        className="h-10"
                        onClick={() => setIsCustomerFormOpen(true)}
                        theme
                    />
                </div>
            </div>

            <main className="p-4 sm:p-6 lg:p-8">
                {/* Customer Detail */}
                <div className={`${theme ? "bg-white" : "bg-gray-700"} rounded-lg p-6 mb-6  `}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">
                            Customer Detail
                        </h2>
                        <button className={`px-4 py-2 rounded-lg  ${theme ? "bg-white text-red-700 border border-red-600 hover:text-white hover:bg-red-700" : "bg-slate-700 text-slate-300 hover:bg-slate-600"} text-sm border border-slate-600 cursor-pointer`}
                            onClick={() => handleDelete(customerDetails?.id ? Number(customerDetails?.id) : 0)}
                        >
                            Delete Customer
                        </button>
                    </div>
                    <div className={`${theme ? "bg-white" : "bg-gray-700"} rounded-lg p-2 mb-6 border border-slate-400 w-full md:w-118 md:h-33 `}>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">

                            <div className="w-26 h-26 bg-slate-600 rounded-lg overflow-hidden">
                                <img
                                    src="/assets/images/user.png"
                                    alt="Customer"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Details */}
                            <div className="space-y-2 text-center sm:text-left">
                                <h3 className="text-lg font-semibold text-gray-400">{[customerDetails?.firstName, customerDetails?.lastName].filter(Boolean).join(" ")}</h3>
                                <p className="text-gray-400 text-sm">ID: {customerDetails?.id}</p>

                                {/* Email */}
                                <p className="text-gray-400 text-sm flex items-center justify-center sm:justify-start gap-2">
                                    <img
                                        src="/assets/SVG/icons/email.svg"
                                        alt="Email Icon"
                                         className={`w-4 h-4 ${theme ? "filter invert" : "filter invert-0"}`}
                                    />
                                    {customerDetails?.email}
                                </p>

                                {/* Phone */}
                                <p className="text-gray-400 text-sm flex items-center justify-center sm:justify-start gap-2">
                                    <img
                                        src="/assets/SVG/icons/phone.svg"
                                        alt="Phone Icon"
                                         className={`w-4 h-4 ${theme ? "filter invert" : "filter invert-0"}`}
                                    />
                                    {customerDetails?.phone}
                                </p>
                            </div>

                        </div>
                    </div>



                    <div className={`${theme ? "bg-white text-black" : "bg-gray-700 text-white"} rounded-lg p-0 w-full`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold ">Active Orders</h2>
                            <button className="px-4 py-2 rounded-lg border border-slate-600 text-sm">
                                View All
                            </button>
                        </div>

                        <DeleteConfirmationModal
                            isOpen={isDeleteModalOpen}
                            isLoading={isLoading}
                            onClose={() => setIsDeleteModalOpen(false)}
                            deleteMessage={deleteMessage}
                            confirmMessage={confirmMessage}
                            onConfirm={handleDeleteCustomer}
                            theme={theme}
                        />

                        <AddCustomerForm
                            isOpen={isCustomerFormOpen}
                            onClose={() => setIsCustomerFormOpen(false)}
                            onSubmit={handleAddCustomer}
                            theme={theme}
                        />

                        <DataTable
                            items={sampleOrders}
                            headers={orderHeaders}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            showEdit={false} // hide edit if not needed
                        />
                    </div>

                </div>


            </main>
        </>
    );
};

export default CustomerManagement;
