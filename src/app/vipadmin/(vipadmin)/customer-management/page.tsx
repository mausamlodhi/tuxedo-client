"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Edit3, Eye, Trash2 } from "lucide-react";
import * as crypto from 'crypto';
import { selectAuthData } from "@/app/redux/slice/auth.slice";
import AddProductButton from "@/components/admin/addProducts";
import CommonTable from "@/components/common/commonTable";
import Pagination from "@/components/common/pagination";
import SearchBar from "@/components/common/searchBar";
import DeleteConfirmationModal from "@/components/modal/delete.modal";
import logger from "@/utils/logger";
import { CustomerManagementServices } from "@/servivces/admin/customer/customer.service";
import modalNotification from "@/utils/notification";
import AddCustomerForm from "@/components/forms/addNewCustomerForm";
import Auth from "@/apiEndPoints/auth";
import { AdminAuthServices } from "@/servivces/admin/auth/auth.service";
import { CUSTOMER_ROLE, PER_PAGE_LIMIT } from "@/utils/env";
import useDebounce from "@/utils/debounce";
import Image from "next/image";

interface TableHeader {
  key: string;
  label: string;
  type: string;
}

const CustomerManagement: React.FC = () => {
  const authData = useSelector(selectAuthData);
  const router = useRouter();
  const theme = authData?.admin?.theme;

  const [tableHeaders] = useState<TableHeader[]>([
    { key: "firstName", label: "Name", type: "string" },
    { key: "email", label: "Email", type: "string" },
    { key: "phone", label: "Phone", type: "string" },
    { key: "homeAddress", label: "Address", type: "string" },
  ]);

  const columns = useMemo(() => {
    const mappedCols = tableHeaders.map((header) => ({
      key: header.key,
      header: header.label,
      render: (value: any, row: any) => {

        if (header.key === "firstName") {
          const fullName = `${row.firstName || ""} ${row.lastName || ""}`.trim();
          return <span className="text-md">{fullName || "N/A"}</span>;
        }


        return <span className="text-md">{value || "N/A"}</span>;
      },
    }));


    // Add Actions column
    mappedCols.push({
      key: "actions",
      header: "Actions",
      render: (_: any, row?: any) => (
        <div className="flex items-center gap-3 justify-center">
          {/* <button
            className="p-1 hover:bg-blue-100 cursor-pointer rounded-full"
            onClick={() => handleEdit(row)}
          >
            <Edit3 className="h-4 w-4 text-blue-600" />
          </button> */}


          {/* View */}
          <button
            className="p-1 hover:bg-green-100 cursor-pointer rounded-full"
            onClick={() => handleView(row.id)}
          >
            <Eye className="h-4 w-4 text-green-600" />
          </button>

          {/* Delete */}
          <button
            className="p-1 hover:bg-red-100 cursor-pointer rounded-full"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      ),
    });

    return mappedCols;
  }, [tableHeaders]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [roleList, setRoleList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedData, setSelectedData] = useState<{ id?: number } | null>(
    null
  );
  const [type, setType] = useState("add");


  const customerSearch = useDebounce((val: string) => getAllCustomer(val), 800);

  const itemsPerPage = 10;
  const currentItems = customers;
  const getAllCustomer = async (search: string = "") => {
    try {
      setIsLoading(true);
      const queryParams = {
        search: search,
        limit: PER_PAGE_LIMIT,
        offset: (currentPage - 1) * itemsPerPage,
      };
      const response = await CustomerManagementServices.getCustomerList(queryParams);
      if (response?.status) {



        setCustomers(response?.results || []);
        setTotalPages(response?.totalPages || 1);
      }

      else {
        modalNotification({
          message: response?.message || "Failed to get customer details",
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
    setIsLoading(false);
  };

  const getAllRoles = async (search: string = "") => {
    try {
      const queryParams = {
        search: search,
        page: 1,
        limit: PER_PAGE_LIMIT,
      };
      const response = await AdminAuthServices.getRoles(queryParams);
      if (response?.status) {
        setRoleList(response?.data?.rows || []);
      }
      else {

        modalNotification({
          message: response?.message || "Failed to get colors",
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

  const handleAddCustomer = async (customerData: any) => {
    try {
      setIsSubmitting(true);
      const hashedPassword = crypto
        .createHash("sha256")
        .update(customerData?.password || "")
        .digest("hex");

      const customerRole = roleList.find((role) => role.name === CUSTOMER_ROLE);

      const payload = {
        ...customerData,
        roleId: customerRole?.id || "2",
        password: hashedPassword,
        confirmPassword: hashedPassword,
      };

      let response;

      if (type === "edit" && selectedData?.id) {

        response = await CustomerManagementServices.updateCustomer(
          payload,
          selectedData?.id as number
        );
      } else {

        response = await CustomerManagementServices.createCustomer(payload);
      }

      if (response?.status) {
        modalNotification({
          message:
            response?.message ||
            (type === "edit"
              ? "Customer updated successfully"
              : "Customer added successfully"),
          type: "success",
        });
        getAllCustomer();
      } else {
        modalNotification({
          message:
            response?.message ||
            (type === "edit"
              ? "Failed to update customer"
              : "Failed to add customer"),
          type: "error",
        });
      }
    } catch (error: any) {
      modalNotification({
        message: error?.message || "Something went wrong.",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsCustomerFormOpen(false);
    setIsSubmitting(false);
  };


  const handleView = (id: number) => {
    router.push(`/vipadmin/customer-management/${id}`);
  };

  const handleDeleteCustomer = async () => {
    try {
      const response = await CustomerManagementServices.deleteCustomer(selectedCustomer);
      if (response?.status) {
        getAllCustomer();
        modalNotification({
          message: response?.message || "Customer deleted successfully",
          type: "success",
        });

      }
      else {
        // ✅ Handle API failure response
        modalNotification({
          message: response?.message || "Failed to delete customers",
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

  const handleEdit = async (data: any) => {
    setSelectedData(data);
    setType("edit");
    setIsCustomerFormOpen(true); // open form modal
    // await fetchAllCategories();
  };

  useEffect(() => {
    getAllCustomer(searchTerm);
  }, [currentPage, searchTerm]);

  useEffect(() => {
    getAllRoles();
  }, []);

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
            onClick={() => {
              setType("add");
              setSelectedData(null);
              setIsCustomerFormOpen(true);
            }}
            theme
            className="h-10"
          />

        </div>
      </div>

      <main className="p-4 sm:p-6 lg:p-8">
        <div
          className={`rounded-sm px-2 ${theme
            ? "bg-[#FFFFFF] text-[#2D333C]"
            : "bg-gray-700 text-[#C1C1C1] border border-[#0000000F]"
            }`}
         >
          <div className="flex items-center gap-4 flex-wrap ml-4 my-2">
            {/* Search Input */}

            <div className="relative w-72 mt-2">
              <Image
                src="/assets/SVG/icons/search.svg"
                alt="Search"
                width={30}
                height={30}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
              />

              <input
                type="text"
                value={searchQuery}
                placeholder={"Search Customer.."}

                className={`pl-9 pr-3 py-2 rounded-md text-sm outline-none w-full transition-colors
                          ${theme
                    ? "bg-gray-100 text-gray-800 border border-gray-300 focus:border-blue-500"
                    : "bg-gray-700 text-gray-200 border border-gray-500 focus:border-blue-400"
                  }`}
                onChange={(e) => {
                  customerSearch(e.target.value);
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>



          </div>

          <CommonTable
            columns={columns}
            data={currentItems}
            theme={theme}
            onView={handleView}
            onDelete={handleDelete}

            loading={isLoading}
          />

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
            type={type}
            selectedData={selectedData}
            onClose={() => setIsCustomerFormOpen(false)}
            onSubmit={handleAddCustomer}
            theme={theme}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

        </div>
      </main>
    </>
  );
};

export default CustomerManagement;
