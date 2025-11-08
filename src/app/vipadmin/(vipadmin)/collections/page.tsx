"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { selectAuthData } from "@/app/redux/slice/auth.slice";
import AddProductButton from "@/components/admin/addProducts";
import CommonTable from "@/components/common/commonTable";
import Pagination from "@/components/common/pagination";
import SearchBar from "@/components/common/searchBar";
import DeleteConfirmationModal from "@/components/modal/delete.modal";
import logger from "@/utils/logger";
import modalNotification from "@/utils/notification";
import { PER_PAGE_LIMIT } from "@/utils/env";
import { CollectionServices } from "@/servivces/admin/collection/collection.service";
import { ColorServices } from "@/servivces/admin/color/color.services";
import AddCollectionForm from "@/components/forms/addCollectionForm";
import { InventoryServices } from "@/servivces/admin/inventory/inventory.services";
import { ImageServices } from "@/servivces/image/image.service";
import ImageModal from "@/components/modal/image.modal";
import { generateGeminiImages, removeSolidBackground } from "@/utils/googleAi";
import { fileToBase64, getColorCode, getCommonQuery, getDynamicQuery } from "@/utils";
import { X } from 'lucide-react';
import useDebounce from "@/utils/debounce";

interface TableHeader {
    key: string;
    label: string;
    type: string;
}
const CollectionsPage: React.FC = () => {
    const authData = useSelector(selectAuthData);
    const router = useRouter();
    const theme = authData?.admin?.theme;
    const [collectionType, setCollectionType] = useState("Shirt");
    const [color, setColor] = useState('');
    const [texture, setTexture] = useState("Plain");
    const [textureColors, setTextureColors] = useState([]);
    const [tableHeaders] = useState<TableHeader[]>([
        { key: "name", label: "Name", type: "string" },
        { key: "email", label: "Email", type: "string" },
        { key: "phone", label: "Phone", type: "string" },
        { key: "homeAddress", label: "Address", type: "string" },
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<string[] | null>([]);
    const [colors, setColors] = useState<ColorInterface[]>([])
    const [inventory, setInventory] = useState<InventoryInterface[]>([]);
    const [collectionData, setCollectionData] = useState<any>([]);
    const [generated, setGenerated] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const collectionSearch = useDebounce((val: string) => getAllCollections(val), 800);

    const columns = useMemo(() => {
        let mappedCols = [
            {
                key: "name",
                header: "Name",
                render: (value: string) => <span className="text-md">{value || "N/A"}</span>,
            },
            {
                key: "details",
                header: "Image",
                render: (value: any, row: any) => (
                    <>
                        <Image
                            src={value?.[0]?.image || ""}
                            alt={"Category Image"}
                            height={40}
                            width={40}
                            onClick={() => {
                                const images = value?.map((item) => {
                                    return item?.image
                                });
                                setSelectedImage(images)
                            }}
                            className="h-10 w-10 object-cover cursor-pointer rounded-md"
                        />
                    </>
                ),
            },
            {
                key: "category",
                header: "Category",
                render: (value: any) => <span className="text-md">{value?.name || 'N/A'}</span>,
            },
            {
                key: "actions",
                header: "Actions",
                render: (_: any, row?: any) => (
                    <div className="flex items-center gap-3 justify-center">
                        {/* <button
                            className="p-1 hover:bg-green-100 cursor-pointer rounded-full"
                            onClick={() => handleView(row.id)}
                        >
                            <Eye className="h-4 w-4 text-green-600" />
                        </button> */}

                        <button
                            className="p-1 hover:bg-red-100 cursor-pointer rounded-full"
                            onClick={() => handleDelete(row.id)}
                        >
                            <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                    </div>
                ),
            }
        ]
        return mappedCols;
    }, [tableHeaders]);

    const currentItems = customers;
    const getAllColors = async () => {
        try {
            const queryParams = {};
            const response = await ColorServices.getColorList(queryParams);
            if (response?.status) {
                setColors(response?.data)
            }
        } catch (error) {
            logger("Error : ", error)
        }
    }
    const getAllInventory = async () => {
        try {
            const response = await InventoryServices.getInventoryList({})
            if (response?.status) {
                setInventory(response?.data);
            }
        } catch (error) {
            logger("Error : ", error)
        }
    }
    const getAllCollections = async (search: string = "") => {
        try {
            setIsLoading(true);
            const queryParams = {
                search: search,
                offset: (currentPage - 1) * PER_PAGE_LIMIT,
                limit: PER_PAGE_LIMIT,
                ...(selectedCategory && { categoryId: selectedCategory }),
            };
            // if (selectedCategory) {
            //     queryParams.categoryId = selectedCategory;
            // }

            const response = await CollectionServices.getCollectionsList(queryParams);
            if (response?.status) {
                setCustomers(response?.results || []);
                setTotalPages(response?.totalPages || 1);
            }
        } catch (error) {
            logger("Error : ", error);
        }
        setIsLoading(false);
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
                return files;
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

            return files;
        } catch (error) {
            logger("Upload error:", error);
            return files;
        }
    };

    const handleAddCollection = async (data: any) => {
        try {
            let details = [];
            let textureColors = [];
            if (data?.texture !== "Plain") {
                textureColors = [data?.texturecolor1, data?.texturecolor2];
            }
            setIsSubmitting(true);
            const images = await uploadMedia([collectionData?.[0]?.image, collectionData?.[1]?.image]);
            if (collectionData?.length == 2) {
                details = [{
                    type: collectionData?.[0]?.type,
                    image: images?.[0]
                }, {
                    type: collectionData?.[1]?.type,
                    image: images?.[1]
                }]
            } else {
                details = [
                    {
                        type: collectionData?.[0]?.type,
                        image: images?.[0]
                    }
                ]
            }

            const payload = {
                details,
                ...data,
                // name: data?.name,
                categoryId: "" + data?.categoryId,
                // colorId:data?.colorId,
                color: data?.colorHex,
                texture: data?.texture,
                textureColors: textureColors

            }
            logger(images, payload)
            const response = await CollectionServices.createCollection(payload);
            if (response?.status) {
                modalNotification({
                    message: response?.message || "New Collection is added successfully",
                    type: "success",
                });
                getAllCollections(searchQuery);
            }
        } catch (error) {
            logger("Error : ", error);
        }
        setIsCustomerFormOpen(false);
        setIsSubmitting(false);
        setGenerated(false)
        setGenerating(false);
        setCollectionData([]);
    };

    const handleGenerateImages = async (values: any) => {
        try {
            setGenerated(false);
            setGenerating(true);

            const isPlain = values?.texture === "plain";
            const textureColors1 = isPlain ? "" : values?.texturecolor1 || "";
            const textureColors2 = isPlain ? "" : values?.texturecolor2 || "";

            const selectedCategory = inventory.find(item => item?.id === values?.categoryId);
            if (!selectedCategory) throw new Error("Invalid category selected");

            const { name, referenceImages } = selectedCategory;
            const hasReferenceImage = values?.hasReferenceImage === "yes";
            const bgColor = values?.bgColor || "black";
            const setImages = (images: string[], types: string[] = ["full", "front"]) => {
                setCollectionData(images.map((img, idx) => ({ type: types[idx] || "full", image: img })));
            };
            const gen = (query: string, refImg: string, bg: string, inputImg?: File | null) =>
                generateGeminiImages(query, refImg, bg, inputImg || null);
            const uploadQuery =
                "Take the color and texture from the second image and apply them on the first image. Generate a realistic result keeping the first image same with solid black background make sure the first image remains completely unchanged .";
            switch (name) {
                case "Shirt":
                case "Pant":
                case "Tie": {
                    const refImg =
                        name === "Tie" && values?.tie_type === "bow-tie"
                            ? referenceImages?.[1]
                            : referenceImages?.[0];

                    if (hasReferenceImage) {
                        const image = await gen(uploadQuery, refImg, "black", values?.images?.[0]);
                        setImages([image], ["full"]);
                        break;
                    }
                    const query = getDynamicQuery(name, values?.colorHex, values?.texture, textureColors1, textureColors2, bgColor);
                    const image = await gen(query, refImg, bgColor);
                    setImages([image], ["full"]);
                    break;
                }
                case "Coat": {
                    const [ref1, ref2] = referenceImages || [];
                    if (hasReferenceImage) {
                        const [img1, img2] = await Promise.all([
                            gen(uploadQuery, ref1, "black", values?.images?.[0]),
                            gen(uploadQuery, ref2, "black", values?.images?.[0]),
                        ]);
                        setImages([img1, img2]);
                        break;
                    }

                    const query = `Apply the color ${values.colorHex} on the provided image and texture should be ${values?.texture} add solid ${bgColor} background and image completely remians unchanged.`
                    const [img1, img2] = await Promise.all([
                        gen(query, ref1, bgColor),
                        gen(query, ref2, bgColor),
                    ]);
                    setImages([img1, img2]);
                    break;
                }
                case "Vest": {
                    const [ref1, ref2] = referenceImages || [];

                    if (hasReferenceImage) {
                        const [img1, img2] = await Promise.all([
                            gen(uploadQuery, ref1, "black", values?.images?.[0]),
                            gen(uploadQuery, ref2, "black", values?.images?.[0]),
                        ]);
                        setImages([img1, img2]);
                        break;
                    }

                    const query = getDynamicQuery(name, values?.colorHex, values?.texture, textureColors1, textureColors2, bgColor);
                    const [img1, img2] = await Promise.all([
                        gen(query, ref1, bgColor),
                        gen(query, ref2, bgColor),
                    ]);
                    setImages([img1, img2]);
                    break;
                }

                default: {
                    const query = getCommonQuery(name, values?.colorHex, bgColor);
                    const image = await gen(query, referenceImages?.[0], bgColor);
                    setImages([image], ["full"]);
                }
            }
            setCollectionType(name);
        } catch (err) {
            console.error("Error generating images:", err);
        } finally {
            setGenerated(true);
            setGenerating(false);
        }
    };


    const handleView = (id: number) => {
        router.push(`/vipadmin/customer-management/${id}`);
    };

    const handleDeleteCollection = async () => {
        try {
            const response = await CollectionServices.deleteCollection(selectedCustomer);
            if (response?.status) {
                getAllCollections();
                modalNotification({
                    message: response?.message || "Customer deleted successfully",
                    type: "success",
                });

            }
            setIsDeleteModalOpen(false);
            setDeleteMessage('');
            setConfirmMessage('');
            setSelectedCustomer(0);
        } catch (error) {
            logger("Error : ", error);
        }
    };

    const handleDelete = (id: number) => {
        setSelectedCustomer(id);
        setIsDeleteModalOpen(true);
    };

    useEffect(() => {
        logger("Current page or search term changed:", currentPage, searchTerm);
        getAllCollections(searchQuery);
    }, [currentPage, selectedCategory]);

    useEffect(() => {
        logger("Search term changed:", searchTerm);
        getAllColors();
        getAllInventory();
    }, []);
    return (
        <>
            <div className="flex flex-col lg:flex-row px-8">
                <h1
                    className={`${theme ? "text-[#313A46]" : "text-[#C1C1C1]"
                        } text-xl sm:text-2xl md:mt-14 font-semibold hidden sm:block`}
                >
                    Category Collections
                </h1>

                <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 flex ml-auto">
                    <AddProductButton label="Add Collection" onClick={() => setIsCustomerFormOpen(true)} theme className="h-10" />
                </div>
            </div>

            <main className="p-4 sm:p-6 lg:p-8">
                <div
                    className={`rounded-sm px-2 ${theme
                        ? "bg-[#FFFFFF] text-[#2D333C]"
                        : "bg-gray-700 text-[#C1C1C1] border border-[#0000000F]"
                        }`}
                >

               <div className="flex items-center gap-3 ml-4 my-2 flex-wrap">
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
            placeholder="Search Collection.."
            className={`pl-9 pr-3 py-2 rounded-md text-sm outline-none w-full transition-colors
                ${theme
                    ? "bg-gray-100 text-gray-800 border border-gray-300 focus:border-blue-500"
                    : "bg-gray-700 text-gray-200 border border-gray-500 focus:border-blue-400"
                }`}
            onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                collectionSearch(value);
                setCurrentPage(1);
            }}
        />
    </div>

    {/* Filter Dropdown - Updated to match search input styling */}
    <div className="relative inline-flex items-center mt-2">
        <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`flex items-center justify-between gap-2 h-10 px-4 rounded-md text-sm outline-none w-52 transition-colors
                ${theme
                    ? "bg-gray-100 text-gray-800 border border-gray-300 focus:border-blue-500 hover:bg-gray-200"
                    : "bg-gray-700 text-gray-200 border border-gray-500 focus:border-blue-400 hover:bg-gray-600"
                }`}
        >
            <div className="flex items-center gap-2 truncate">
                <Image
                    src="/assets/SVG/icons/filter.svg"
                    alt="Filter"
                    width={16}
                    height={16}
                    className="text-gray-400"
                />
                <span className="font-medium truncate">
                    {selectedCategory
                        ? inventory.find((cat) => cat.id === selectedCategory)?.name
                        : "Filter by Category"}
                </span>
            </div>

            {selectedCategory && (
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(null);
                        setCurrentPage(1);
                        setIsOpen(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer ml-1"
                >
                    <X size={16} />
                </span>
            )}
        </button>

        {isOpen && (
            <div
                className={`absolute z-10 top-12 left-0 w-52 rounded-md shadow-lg overflow-hidden transform transition-all duration-200 border
                    ${theme
                        ? "bg-white border-gray-300"
                        : "bg-gray-700 border-gray-500"
                    }`}
            >
                <ul className="max-h-64 overflow-y-auto">
                    <li
                        onClick={() => {
                            setSelectedCategory(null);
                            setCurrentPage(1);
                            setIsOpen(false);
                        }}
                        className={`px-4 py-2 text-sm cursor-pointer transition-colors
                            ${theme
                                ? "hover:bg-gray-100 text-gray-800"
                                : "hover:bg-gray-600 text-gray-200"
                            }`}
                    >
                        All Categories
                    </li>
                    
                    {inventory.map((cat) => (
                        <li
                            key={cat.id}
                            onClick={() => {
                                setSelectedCategory(cat.id);
                                setCurrentPage(1);
                                setIsOpen(false);
                            }}
                            className={`px-4 py-2 text-sm cursor-pointer transition-colors flex justify-between items-center
                                ${selectedCategory === cat.id
                                    ? theme
                                        ? "bg-blue-50 text-blue-600 font-medium"
                                        : "bg-blue-900/30 text-blue-400 font-medium"
                                    : theme
                                    ? "hover:bg-gray-100 text-gray-800"
                                    : "hover:bg-gray-600 text-gray-200"
                                }`}
                        >
                            {cat.name}
                        </li>
                    ))}
                </ul>
            </div>
        )}
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
                        onConfirm={handleDeleteCollection}
                        theme={theme}
                    />
                    <AddCollectionForm
                        isOpen={isCustomerFormOpen}
                        onClose={() => setIsCustomerFormOpen(false)}
                        onSubmit={handleAddCollection}
                        theme={theme}
                        colors={colors}
                        inventory={inventory}
                        collectionData={collectionData}
                        handleGenerateImages={handleGenerateImages}
                        generated={generated}
                        generating={generating}
                    />
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                    {selectedImage && (
                        <ImageModal
                            theme={theme}
                            images={selectedImage}
                            alt="Preview"
                            onClose={() => setSelectedImage(null)}
                        />
                    )}
                </div>
            </main>
        </>
    );
};

export default CollectionsPage;



