"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Edit3, Eye, Trash2 } from "lucide-react";
import { selectAuthData } from "@/app/redux/slice/auth.slice";
import AddProductButton from "@/components/admin/addProducts";
import CommonTable from "@/components/common/commonTable";
import Pagination from "@/components/common/pagination";
import SearchBar from "@/components/common/searchBar";

import DeleteConfirmationModal from "@/components/modal/delete.modal";
import DetailsCard from "@/components/admin/detailsCard";
import logger from "@/utils/logger";
import modalNotification from "@/utils/notification";
import AddFormalWearForm from "@/components/forms/addFormalWearForm";
import Auth from "@/apiEndPoints/auth";
import { AdminAuthServices } from "@/servivces/admin/auth/auth.service";
import { CUSTOMER_ROLE, PER_PAGE_LIMIT } from "@/utils/env";
import { ShoeCategoryServices } from "@/servivces/admin/category/shoe.service";
import { PocketSquareCategoryServices } from "@/servivces/admin/category/pocketSquare.service";
import { TieCategoryServices } from "@/servivces/admin/category/tie.service";
import { VestCategoryServices } from "@/servivces/admin/category/vest.service";
import { ShirtCategoryServices } from "@/servivces/admin/category/shirt.service";
import { PantCategoryServices } from "@/servivces/admin/category/pant.service";
import { StudsCufflinksCategoryServices } from "@/servivces/admin/category/jewelry.service";
import { SuspendersCategoryServices } from "@/servivces/admin/category/suspenders.service";
import { SocksCategoryServices } from "@/servivces/admin/category/socks.service";
import { CoatCategoryServices } from "@/servivces/admin/category/coat.service";
import { ColorServices } from "@/servivces/admin/color/color.services";
import { FormalwearServices } from "@/servivces/admin/formalwear/formalwear.service";
import { ImageServices } from "@/servivces/image/image.service";
import Image from "next/image";
import useDebounce from "@/utils/debounce";
import ImageModal from "@/components/modal/image.modal";
import { bestSellingImage } from '@/utils/icons';


interface TableHeader {
  key: string;
  label: string;
  type: string;
}

const BestSelling: React.FC = () => {
  const authData = useSelector(selectAuthData);
  const router = useRouter();
  const theme = authData?.admin?.theme;
  const [selectedImage, setSelectedImage] = useState<string[] | null>([]);
  const iconColor = theme ? "#AC845D" : "#000"; 



  const [tableHeaders] = useState<TableHeader[]>([
    { key: "images", label: "Image", type: "image" },
    { key: "product_name", label: "Wear Name", type: "string" },

    { key: "buy_price", label: "Buy Price", type: "number" },
    { key: "rental_price", label: "Rental Price", type: "number" },
  ]);

  const columns = useMemo(() => {
    const mappedCols = tableHeaders.map((header) => ({
      key: header.key,
      header: header.label,
      render: (value: any, row: any) => {
        if (header.key === "images") {
         
          if ( row?.coat?.images?.length) {
            return (
              <div className="flex items-center justify-center">
                <Image
                  width={40}
                  height={40}
                  src={row?.coat?.images?.[0]} 
                  alt={row?.title || "image"}
                  onClick={() => {
                    setSelectedImage(row?.coat?.images);
                   
                    
                  }}
                  className="h-10 w-10 object-cover cursor-pointer rounded-md"
                />
              </div>
            );
          } else {
  return (
    <div className="flex items-center justify-center">
      {bestSellingImage(iconColor)}
    </div>
  );
}

        }


        if (header.key === "product_name") {
          return <span className="text-md">{row.title || "N/A"}</span>;
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
          <button
            className="p-1 hover:bg-blue-100 cursor-pointer rounded-full"
            onClick={() => handleEdit(row)}
          >
            <Edit3 className="h-4 w-4 text-blue-600" />
          </button>


          {/* View */}
          <button
            className="p-1 hover:bg-green-100 cursor-pointer rounded-full"
            onClick={() => handleView(row)}
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
  const [formalwear, setFormalwear] = useState<any[]>([]);
  const [selectedFormalwear, setSelectedFormalwear] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormalWearFormOpen, setIsFormalWearFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>("");
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [type, setType] = useState("add");
  const [currentCategory, setCurrentCategory] = useState([]);
  const [shoes, setShoes] = useState([]);
  const [shocks, setShocks] = useState([]);
  const [pocketSquares, setPocketSquares] = useState([]);
  const [ties, setTies] = useState([]);
  const [vest, setVest] = useState([]);
  const [shirts, setShirts] = useState([]);
  const [pants, setPants] = useState([]);
  const [suspenders, setSuspenders] = useState([]);
  const [coats, setCoats] = useState([]);
  const [studsCufflinks, setStudsCufflinks] = useState([]);
  const [colors, setColors] = useState<ColorInterface[]>([]);
  const [selectedData, setSelectedData] = useState<{ id?: number } | null>(
    null
  );
  const [areCategoriesLoaded, setAreCategoriesLoaded] = useState(false);
  const bestFormalwaerSearch = useDebounce((val: string) => getAllFormalwear(val), 800);

  const itemsPerPage = 10;
  const currentItems = formalwear;

  const notApplicable = {
    id: "#",
    description: "Not applicable",
    style: "",
  };





  const uploadMedia = async (
    files: (File | string)[],
    otherData?: Record<string, any>
  ) => {
    try {
      const actualFiles: File[] = [];
      const fileIndexes: number[] = [];

      files.forEach((file, index) => {
        if (file instanceof File) {
          actualFiles.push(file);
          fileIndexes.push(index);
        }
      });

      if (actualFiles.length === 0) {
        return files; // all are already URLs
      }

      const formData = new FormData();
      actualFiles.forEach((file) => {
        formData.append("image", file);
      });
      if (otherData) {
        Object.entries(otherData).forEach(([key, value]) => {
          formData.append(key, value as any);
        });
      }
      const response = await ImageServices.uploadImage(formData);
      if (response?.status) {
        const uploadedUrls: string[] =
          response?.data?.map((item: any) => item.url) || [];
        const result = [...files];
        fileIndexes.forEach((idx, i) => {
          result[idx] = uploadedUrls[i];
        });
        return result;
      }

      else {

        modalNotification({
          message: response?.message || "Failed to image upload",
          type: "error",
        });
      }

      const onlyUrls = files.filter((f) => typeof f === "string") as string[];
      return onlyUrls.length > 0 ? onlyUrls : [];
    } catch (error) {
      modalNotification({
        message: error?.message || "Failed to upload image",
        type: "error",
      });
      logger("Upload error:", error);
      return files;
    }
  };

  const getAllFormalwear = async (search: string = "") => {
    try {
      setIsLoading(true);
      const queryParams = {
        search: search,
        offset: (currentPage - 1) * itemsPerPage,
        limit: PER_PAGE_LIMIT,
      };
      const response = await FormalwearServices.getFormalwearList(queryParams);
      if (response?.status) {



        setFormalwear(response?.results || []);
        setTotalPages(response?.totalPages || 1);
      }

      else {
        modalNotification({
          message: response?.message || "Failed to get Product details",
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


  const getAllShoes = async (isData: boolean = false, search: string = "") => {
    try {
      setIsLoading(true);
      const queryParams = {
        search,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };
      const response = await ShoeCategoryServices.getShoeList(queryParams);
      if (response?.status) {
        setTotalPages(response?.totalPages as number);
        if (!isData) {
          setShoes([notApplicable, ...response?.results]);
          setCurrentCategory(response?.results);
        } else {
          setShoes([notApplicable, ...response?.results]);
        }
      }
      else {

        modalNotification({
          message: response?.message || "Failed to get shoes",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message: error?.message || "Failed to get shoe",
        type: "error",
      });

      logger("Error : ", error);
    }
    setIsLoading(false);
  };

  const getAllPcketSquare = async (isData = false, search: string = "") => {
    try {
      setIsLoading(true);
      const queryParams = {
        search,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };
      const response = await PocketSquareCategoryServices.getPocketSquareList(
        queryParams
      );
      if (response?.status) {
        setTotalPages(response?.totalPages as number);
        if (!isData) {
          setPocketSquares([notApplicable, ...response?.results]);
          setCurrentCategory(response?.results);
        } else {
          setPocketSquares([notApplicable, ...response?.results]);
        }
      }
      else {
        // ✅ Handle API failure response
        modalNotification({
          message: response?.message || "Failed to get pocket square",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message: error?.message || "Failed to get pocket square",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsLoading(false);
  };

  const getAllTies = async (isData: boolean = false, search: string = "") => {
    setIsLoading(true);
    try {
      const queryParams = {
        search,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };
      const response = await TieCategoryServices.getTieList(queryParams);
      if (response?.status) {
        setTotalPages(response?.totalPages as number);
        if (!isData) {
          setTies([notApplicable, ...response?.results]);
          setCurrentCategory(response?.results);
        } else {
          setTies([notApplicable, ...response?.results]);
        }
      }
      else {
        // ✅ Handle API failure response
        modalNotification({
          message: response?.message || "Failed to get Ties",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message: error?.message || "Failed to get tie",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsLoading(false);
  };

  const getAllVest = async (isData: boolean = false, search: string = "") => {
    setIsLoading(true);
    try {
      const queryParams = {
        search,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };
      const response = await VestCategoryServices.getVestList(queryParams);
      if (response?.status) {
        setTotalPages(response?.totalPages as number);
        if (!isData) {
          setVest([notApplicable, ...response?.results]);
          setCurrentCategory(response?.results);
        } else {
          setVest([notApplicable, ...response?.results]);
        }
      }
      else {
        // ✅ Handle API failure response
        modalNotification({
          message: response?.message || "Failed to get vest",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message: error?.message || "Failed to get vest",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsLoading(false);
  };

  const getAllShirts = async (isData: boolean = false, search: string = "") => {
    setIsLoading(true);
    try {
      const queryParams = {
        search,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };
      const response = await ShirtCategoryServices.getShirtList(queryParams);
      if (response?.status) {
        setTotalPages(response?.totalPages as number);
        if (!isData) {
          setShirts([notApplicable, ...response?.results]);
          setCurrentCategory(response?.results);
        } else {
          setShirts([notApplicable, ...response?.results]);
        }
      }
      else {
        // ✅ Handle API failure response
        modalNotification({
          message: response?.message || "Failed to get Shirts",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message: error?.message || "Failed to get shirt",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsLoading(false);
  };

  const getAllPants = async (search: string = "") => {
    setIsLoading(true);
    try {
      const queryParams = {
        search,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };
      const response = await PantCategoryServices.getPantList(queryParams);
      if (response?.status) {
        setPants([notApplicable, ...response?.results]);
        setTotalPages(response?.totalPages as number);
        setCurrentCategory(response?.results);
      }
      else {
        // ✅ Handle API failure response
        modalNotification({
          message: response?.message || "Failed to get Pants",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message: error?.message || "Failed to get pant",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsLoading(false);
  };

  const getAllStudsCufflinks = async (
    isData: boolean = false,
    search: string = ""
  ) => {
    try {
      setIsLoading(true);
      const queryParams = {
        search,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };

      const response = await StudsCufflinksCategoryServices.getStudsCufflinksList(queryParams);

      if (response?.status) {
        // const newData = isData ? [notApplicable, ...response?.results] : response?.results;

        setStudsCufflinks([notApplicable, ...response?.results]);
        setCurrentCategory(response?.results);
        setTotalPages(response?.totalPages as number);


      } else {
        modalNotification({
          message: response?.message || "Failed to get studs & cufflinks",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message: error?.message || "Failed to get studs & cufflinks",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsLoading(false);
  };



  const getAllSuspenders = async (
    isData: boolean = false,
    search: string = ""
  ) => {
    try {
      setIsLoading(true);
      const queryParams = {
        search,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };
      const response = await SuspendersCategoryServices.getSuspendersList(
        queryParams
      );
      if (response?.status) {
        setSuspenders([notApplicable, ...response?.results]);
        if (!isData) {
          setSuspenders([notApplicable, ...response?.results]);
          setCurrentCategory(response?.results);
        } else {
          setSuspenders([notApplicable, ...response?.results]);
        }
        setTotalPages(response?.totalPages as number);
      }
      else {
        // ✅ Handle API failure response
        modalNotification({
          message: response?.message || "Failed to get suspenders",
          type: "error",
        });
      }

    } catch (error) {
      modalNotification({
        message: error?.message || "Failed to get Suspenders",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsLoading(false);
  };

  const getAllShocks = async (isData: boolean = false, search: string = "") => {
    try {
      setIsLoading(true);
      const queryParams = {
        search,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };
      const response = await SocksCategoryServices.getSocksList(queryParams);
      if (response?.status) {
        response?.results;
        if (!isData) {
          setShocks([notApplicable, ...response?.results]);
          setCurrentCategory(response?.results);
        } else {
          setShocks([notApplicable, ...response?.results]);
        }
        setTotalPages(response?.totalPages as number);
      }

      else {
        // ✅ Handle API failure response
        modalNotification({
          message: response?.message || "Failed to get Shocks",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message: error?.message || "Failed to get shocks",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsLoading(false);
  };


  const getAllCoats = async (search: string = "") => {
    try {
      setIsLoading(true);
      const queryParams = {
        search,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };
      const response = await CoatCategoryServices.getCoatList(queryParams);
      if (response?.status) {
        setCoats([notApplicable, ...response?.results]);
        setTotalPages(response?.totalPages as number);
        setCurrentCategory(response?.results);
      }
      else {
        // ✅ Handle API failure response
        modalNotification({
          message: response?.message || "Failed to get Coats",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message: error?.message || "Failed to get coat ",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsLoading(false);
  };

  const getAllColors = async () => {
    try {
      const queryParams = {};
      const response = await ColorServices.getColorList(queryParams);
      if (response?.status) {
        setColors(response?.data);
      }

      else {
        // ✅ Handle API failure response
        modalNotification({
          message: response?.message || "Failed to get colors",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message: error?.message || "Failed to get colors",
        type: "error",
      });
      logger("Error : ", error);
    }
  };


  const handleView = (data: any) => {
    if (data) {
      setSelectedItem(data);
      setIsDetailPopupOpen(true);
    }
  };

  const handleEdit = async (data: any) => {
    setSelectedData(data); // keep current row data
    setType("edit");
    setIsFormalWearFormOpen(true); // open form modal
    await fetchAllCategories();
  };

  const handleFormalWearFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {

      const fileName = await uploadMedia(values.images);


      const idFields = [
        "coatId",
        "shirtId",
        "vestId",
        "pantId",
        "shoeId",
        "tieId",
        "pocket_squareId",
        "jewelId",
        "socksId",
        "suspendersId",
      ];

      const formattedValues = { ...values };

      idFields.forEach((field) => {
        if (formattedValues[field] === "#") {
          formattedValues[field] = null;
        }
      });

      // Prepare final payload
      const payload = {
        ...formattedValues,
        images: fileName,
      };

      // Call API
      let response;
      if (type === "edit") {
        response = await FormalwearServices.updateFormalwear(
          payload,
          selectedData?.id as number
        );
      } else {
        response = await FormalwearServices.createFormalwear(payload);
      }

      // Handle response
      if (response?.status) {
        modalNotification({
          message:
            response?.message ||
            (type === "edit"
              ? "Formal Wear updated successfully"
              : "Formal Wear added successfully"),
          type: "success",
        });
        getAllFormalwear();
        setIsFormalWearFormOpen(false);
      } else {
        modalNotification({
          message: response?.message || "Failed to save Formal Wear",
          type: "error",
        });
      }
    } catch (error: any) {
      modalNotification({
        message:
          error?.message || "Something went wrong. Please try again later.",
        type: "error",
      });
      logger("Error : ", error);
    }

    setIsSubmitting(false);
  };






  const handleDeleteFormalwear = async () => {
    try {
      const response = await FormalwearServices.deleteFormalwear(selectedFormalwear);
      if (response?.status) {
        modalNotification({
          message: response?.message || "Formalwear deleted successfully",
          type: "success",
        });
        getAllFormalwear(searchTerm); // refresh list
      } else {
        modalNotification({
          message: response?.message || "Failed to delete formalwear",
          type: "error",
        });
      }
      setIsDeleteModalOpen(false);
      setDeleteMessage('');
      setConfirmMessage('');
      setSelectedFormalwear(0);
    } catch (error: any) {
      modalNotification({
        message: error.message || "Something went wrong. Please try again later.",
        type: "error",
      });
      logger("Error : ", error);
    }
  };


  const handleDelete = (id: number) => {
    setSelectedFormalwear(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseFormalWearForm = () => {
    setIsFormalWearFormOpen(false);
    // setSelectedData(null);
  };



  useEffect(() => {
    getAllFormalwear(searchTerm);
  }, [currentPage, searchTerm]);

  const fetchAllCategories = async (forceRefresh = false) => {
    if (areCategoriesLoaded && !forceRefresh) {
      return;
    }

    try {
      setIsLoading(true);
      await Promise.all([
        getAllShoes(),
        getAllPcketSquare(),
        getAllTies(),
        getAllVest(),
        getAllShirts(),
        getAllPants(),
        getAllStudsCufflinks(),
        getAllSuspenders(),
        getAllShocks(),
        getAllCoats(),
        getAllColors(),
      ]);
      setAreCategoriesLoaded(true);
    } catch (error) {
      logger("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchAllCategories();
  // }, [])

  const handleAddButtonClick = async () => {
    await fetchAllCategories();
    setType("add");
    setSelectedData(null);
    setIsFormalWearFormOpen(true);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row px-8">
        <h1
          className={`${theme ? "text-[#313A46]" : "text-[#C1C1C1]"
            } text-xl sm:text-2xl md:mt-14 font-semibold hidden sm:block`}
        >
          Best Selling Formal Wear
        </h1>

        <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 flex ml-auto">
          <AddProductButton
            theme={theme}
            label="Add Best Selling Formal Wear"
            onClick={async () => {
              await handleAddButtonClick();
              setType("add");
              setSelectedData(null);
              setIsFormalWearFormOpen(true);
            }}
          />
        </div>
      </div>

      <main className="p-4 sm:p-6 lg:p-8">
        <div className={`rounded-sm px-2 ${theme ? "bg-[#FFFFFF] text-[#2D333C]" : "bg-gray-700 text-[#C1C1C1] border border-[#0000000F]"}`}>
          <div className="flex items-center gap-3 flex-wrap ml-4 my-2">
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
                placeholder={"Search Best Formal wear.."}

                className={`pl-9 pr-3 py-2 rounded-md text-sm outline-none w-full transition-colors
                ${theme
                    ? "bg-gray-100 text-gray-800 border border-gray-300 focus:border-blue-500"
                    : "bg-gray-700 text-gray-200 border border-gray-500 focus:border-blue-400"
                  }`}
                onChange={(e) => {
                  bestFormalwaerSearch(e.target.value);
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Filter Dropdown */}
            {/* <select
                            className={`px-3 py-2 rounded-md text-sm cursor-pointer outline-none
                  ${theme
                                ? "bg-gray-100 text-gray-800 border border-gray-300 focus:border-blue-500"
                                : "bg-gray-600 text-gray-200 border border-gray-500 focus:border-blue-400"}
                `}
                            onChange={(e) => setFilter(e.target.value)} // 🔹 define state outside
                          >
                            <option value="">All</option>
                            <option value="new">New</option>
                            <option value="popular">Popular</option>
                            <option value="outOfStock">Out of Stock</option>
                          </select> */}

            {/* Add Button */}

          </div>


         

          <CommonTable
            columns={columns}
            data={currentItems}
            theme={theme}
            onView={handleView}
            onDelete={handleDelete}
            onEdit={handleEdit}
            loading={isLoading}
          />

          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            isLoading={isLoading}
            onClose={() => setIsDeleteModalOpen(false)}
            deleteMessage={deleteMessage}
            confirmMessage={confirmMessage}
            onConfirm={handleDeleteFormalwear}
            theme={theme}
          />

           {selectedImage && (
            <ImageModal
              theme={theme}
              images={selectedImage}
              alt="Preview"
              onClose={() => setSelectedImage(null)}
            />
          )}

          <AddFormalWearForm
            isOpen={isFormalWearFormOpen}
            type={type}
            onClose={handleCloseFormalWearForm}
            onSubmit={handleFormalWearFormSubmit}
            coats={coats}

            colors={colors}
            theme={authData?.admin?.theme}
            selectedData={selectedData}
            isSubmitting={isSubmitting}
          />


          <DetailsCard
            isOpen={isDetailPopupOpen}
            onClose={() => setIsDetailPopupOpen(false)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            data={selectedItem}
            category={"Best Selling Product"}
            displayTitle={"Best Selling Product"}
            theme={authData?.admin?.theme}
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

export default BestSelling;
