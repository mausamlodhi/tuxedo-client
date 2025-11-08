"use client";

import { useSelector } from "react-redux";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  Search,
  Trash2,
  X,
} from "lucide-react";
import DataTable from "@/components/admin/dataTable";
import Pagination from "@/components/common/pagination";
import AddPantForm from "@/components/forms/addPantForm";
import AddCoatForm from "@/components/forms/addCoatForm";
import AddTieForm from "@/components/forms/addTieForm";
import AddShirtForm from "@/components/forms/addShirtForm";
import AddShoesForm from "@/components/forms/addShoeForm";
import DetailsCard from "@/components/admin/detailsCard";
import AddPocketSquareForm from "@/components/forms/addPocketForm";
import AddVestForm from "@/components/forms/addVestForm";
// import AdForm from "@/components/forms/addJewellaryForm";
import logger from "@/utils/logger";
import { selectAuthData } from "@/app/redux/slice/auth.slice";
import { ShoeCategoryServices } from "@/servivces/admin/category/shoe.service";
import { PocketSquareCategoryServices } from "@/servivces/admin/category/pocketSquare.service";
import { TieCategoryServices } from "@/servivces/admin/category/tie.service";
import { ShirtCategoryServices } from "@/servivces/admin/category/shirt.service";
import { PantCategoryServices } from "@/servivces/admin/category/pant.service";
import { CoatCategoryServices } from "@/servivces/admin/category/coat.service";
import { VestCategoryServices } from "@/servivces/admin/category/vest.service";
import { StudsCufflinksCategoryServices } from "@/servivces/admin/category/jewelry.service";
import modalNotification from "@/utils/notification";
import DeleteConfirmationModal from "@/components/modal/delete.modal";
import { ColorServices } from "@/servivces/admin/color/color.services";
import { ImageServices } from "@/servivces/image/image.service";
import CommonTable from "@/components/common/commonTable";
import Image from "next/image";
import CoatDetailModal from "@/components/common/categoryDetails.modal";
import useDebounce from "@/utils/debounce";
import { get } from "node:http";
import { getColorCode } from "@/utils";
import { CURRENCY, PER_PAGE_LIMIT } from "@/utils/env";
import ImageModal from "@/components/modal/image.modal";
import { CollectionServices } from "@/servivces/admin/collection/collection.service";
import AddStudsCufflinksForm from "@/components/forms/addStudsCufflinksForm";
import { SocksCategoryServices } from "@/servivces/admin/category/socks.service";
import AddShocksForm from "@/components/forms/addShocks";
import { SuspendersCategoryServices } from "@/servivces/admin/category/suspenders.service";
import AddSuspendersForm from "@/components/forms/addSuspendersForm";

interface TableHeader {
  key: string;
  label: string;
  type: string;
}

interface CategoryItem {
  id: string;
  image: string;
  style: string;
  description: string;
  color: string;
  matchingPant: string;
}

interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string, headers: TableHeader[]) => void;
  theme: boolean | object; // now also sends headers
}

const tabHeaders: Record<string, TableHeader[]> = {
  coat: [
    { key: "images", label: "Image", type: "image" },
    { key: "style", label: "Style", type: "string" },
    { key: "description", label: "Description", type: "string" },
    { key: "color", label: "Color", type: "string" },
    { key: "matchingPant", label: "Matching Pant", type: "string" },
  ],
  pant: [
    { key: "images", label: "Image", type: "image" },
    { key: "style", label: "Style", type: "string" },
    { key: "description", label: "Description", type: "string" },
    { key: "color", label: "Color", type: "color" },
    { key: "pantTyep", label: "Pant-Type", type: "string" },
  ],
  shirt: [
    { key: "images", label: "Image", type: "image" },
    { key: "style", label: "Style", type: "string" },
    { key: "description", label: "Description", type: "string" },
    { key: "color", label: "Color", type: "string" },
    { key: "matchingvest", label: "Matching Vest", type: "string" },
  ],
  vest: [
    { key: "images", label: "Image", type: "image" },
    { key: "style", label: "Style", type: "string" },
    { key: "description", label: "Description", type: "string" },
    { key: "color", label: "Color", type: "string" },
    { key: "BowTie", label: "Bow Tie", type: "string" },
    { key: "NeckTie", label: "Neck Tie", type: "string" },
  ],
  tie: [
    { key: "images", label: "Image", type: "image" },
    { key: "style", label: "Style", type: "string" },
    { key: "description", label: "Description", type: "string" },
    { key: "colors.id", label: "Color", type: "color" },
    {
      key: "matchingpocket-square",
      label: "Matching Pocket-Square",
      type: "string",
    },
  ],
  "pocket-square": [
    { key: "images", label: "Image", type: "image" },
    { key: "style", label: "Style", type: "string" },
    { key: "description", label: "Description", type: "color" },
  ],
  shoe: [
    { key: "images", label: "Image", type: "image" },
    { key: "style", label: "style", type: "string" },
    { key: "description", label: "Description", type: "color" },
    { key: "colors", label: "Color", type: "color" },
  ],

  studsCufflinks: [
    { key: "images", label: "Image", type: "image" },
    { key: "style", label: "Style", type: "string" },
    { key: "description", label: "Description", type: "color" },
    { key: "colors", label: "Color", type: "color" },
  ],
};

const tabs = [
  { id: "coat", label: "Coat" },
  { id: "pant", label: "Pant" },
  { id: "shirt", label: "Shirt" },
  { id: "vest", label: "Vest" },
  { id: "tie", label: "Tie" },
  { id: "pocket-square", label: "Pocket Square" },
  { id: "suspenders", label: "Suspenders" },
  { id: "shoe", label: "Shoe" },
  { id: "shocks", label: "Socks" },
  { id: "studsCufflinks", label: "Studs & Cufflinks" },
];

// const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeTab, onTabChange, theme }) => {
//   const tabs = [
//     { id: 'coat', label: 'Coat' },
//     { id: 'pant', label: 'Pant' },
//     { id: 'shirt', label: 'Shirt' },
//     { id: 'vest', label: 'Vest' },
//     { id: 'tie', label: 'Tie' },
//     { id: 'pocket-square', label: 'Pocket Square' },
//     { id: 'shoe', label: 'Shoe' },
//   ];

//   return (

//       <div
//           className={`flex justify-between gap-4 sm:gap-8 md:gap-12 overflow-x-auto no-scrollbar
//     ${theme ? "bg-[#FFFFFF] hover:text-[#313A46]" : "bg-[#313A46]"}
//     transition-colors items-center`}
//     >
//       {tabs.map((tab) => (
//         <button
//           key={tab.id}
//           onClick={() => onTabChange(tab.id, tabHeaders[tab.id])}
//           className={`px-5 sm:px-6 py-2 transition-colors text-sm sm:text-base shrink-0
//         ${activeTab === tab.id
//               ? "bg-blue-600 text-white"
//               : `${theme ? "text-[#313A46] hover:text-[#4d627f]" : "text-[#C1C1C1] hover:text-white"}`
//             }`}
//         >
//           {tab.label}
//         </button>
//       ))}
//     </div>

//   );
// };

const categoryMap: Record<string, number> = {
  coat: 2,
  pant: 3,
  shirt: 4,
  vest: 5,
  shoe: 6,
  tie: 7,
  studsCufflinks: 8,
  "pocket-square": 9,
    shocks: 10,
  suspenders: 11,

  
};


const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeTab,
  onTabChange,
  theme,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex items-center relative w-full">
      {/* Left Controller */}
      <button
        onClick={() => scroll("left")}
        className={`p-2 rounded-full shadow-md cursor-pointer transition-colors ${theme
          ? "bg-gray-200 hover:bg-gray-300"
          : "bg-gray-700 hover:bg-gray-600"
          }`}
      >
        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 block" />
      </button>

      {/* Tabs Container */}
      <div
        ref={scrollRef}
        className={`flex justify-between gap-4 sm:gap-8 md:gap-12 overflow-x-auto no-scrollbar relative items-center px-2 py-2 w-full rounded-sm shadow-sm
          ${theme ? "bg-[#FFFFFF]" : "bg-[#2D333C66]"}
        `}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id, tabHeaders[tab.id])}
            className={`relative px-5 cursor-pointer sm:px-6 py-2 text-sm sm:text-base shrink-0 font-medium transition-all duration-300
              ${activeTab === tab.id
                ? "text-blue-600"
                : theme
                  ? "text-[#313A46] hover:text-blue-500"
                  : "text-[#C1C1C1] hover:text-white"
              }
            `}
          >
            {/* Tab label */}
            <motion.span
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {tab.label}
            </motion.span>

            {/* Active indicator (underline bar) */}
            <AnimatePresence>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-blue-600"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      {/* Right Controller */}
      <button
        onClick={() => scroll("right")}
        className={`p-2 rounded-full shadow-md cursor-pointer transition-colors ${theme
          ? "bg-gray-200 hover:bg-gray-300"
          : "bg-gray-700 hover:bg-gray-600"
          }`}
      >
        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300 block" />
      </button>
    </div>
  );
};

const CategoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("coat");
  const authData = useSelector(selectAuthData);
  const theme = authData?.admin?.theme;
  const [tableHeaders, setTableHeaders] = useState<TableHeader[]>(
    tabHeaders.coat
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isPantFormOpen, setIsPantFormOpen] = useState(false);
  const [isCoatFormOpen, setIsCoatFormOpen] = useState(false);
  const [isShirtFormOpen, setIsShirtFormOpen] = useState(false);
  const [isTieFormOpen, setIsTieFormOpen] = useState(false);
  const [isVestFormOpen, setIsVestFormOpen] = useState(false);
  const [isPocketFormOpen, setIsPocketFormOpen] = useState(false);
  const [isShoeFormOpen, setIsShoeFormOpen] = useState(false);
  const [isSuspendersFormOpen, setIsSuspendersFormOpen] = useState(false);
  const [isSocksFormOpen, setIsShocksFormOpen] = useState(false);
  const [isStudsCufflinksFormOpen, setIsStudsCufflinksFormOpen] =
    useState(false);
  // const [isJewelryFormOpen, setIsJewelryFormOpen] = useState(false);
  const [shoes, setShoes] = useState([]);
  const [shocks, setShocks] = useState([]);
  const [pocketSquares, setPocketSquares] = useState([]);
  const [ties, setTies] = useState([]);
  const [vest, setVest] = useState([]);
  const [shirts, setShirts] = useState([]);
  const [pants, setPants] = useState([]);
  const [suspenders, setSuspenders] = useState([]);
  const [coats, setCoats] = useState([]);
  // const [jewelry, setJewelry] = useState([]);
  const [studsCufflinks, setStudsCufflinks] = useState([]);
  const [collection, setCollection] = useState<CollectionInterface[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [currentCategory, setCurrentCategory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [selectedData, setSelectedData] = useState<{ id?: number } | null>(
    null
  );
  const [type, setType] = useState("add");
  const [colors, setColors] = useState<ColorInterface[]>([]);
  const [selectedImage, setSelectedImage] = useState<string[] | null>([]);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [isData, setIsData] = useState<boolean>(false);
  const [slimFitPants, setSlimFitPants] = useState<PantInterface[]>([]);
  const [ultraSlimFitPants, setUltraSlimFitPants] = useState<PantInterface[]>(
    []
  );
  const [neckTies, setNeckTies] = useState<TieInterface[]>([]);
  const [bowTies, setBowTies] = useState<TieInterface[]>([]);
  const itemsPerPage = PER_PAGE_LIMIT;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const coatSearch = useDebounce((val: string) => getAllCoats(val), 800);
  const pantSearch = useDebounce((val: string) => getAllPants(val), 800);
  const shirtSearch = useDebounce(
    (val: string) => getAllShirts(false, val),
    800
  );
  const vestSearch = useDebounce((val: string) => getAllVest(false, val), 800);
  const tieSearch = useDebounce((val: string) => getAllTies(false, val), 800);
  const pocketSquareSearch = useDebounce(
    (val: string) => getAllPcketSquare(false, val),
    800
  );
  const shoeSearch = useDebounce((val: string) => getAllShoes(false, val), 800);
  const suspendersSearch = useDebounce(
    (val: string) => getAllSuspenders(false, val),
    800
  );
  const shocksSearch = useDebounce(
    (val: string) => getAllShocks(false, val),
    800
  );

  const studsCufflinksSearch = useDebounce(
    (val: string) => getAllStudsCufflinks(false, val),
    800
  );

  // const jewelrySearch = useDebounce((val: string) => getAllJewelry(false, val), 800);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<number>(0);
  const notApplicable = {
    id: "#",
    description: "Not applicable",
    style: "",
  };
  const coatData = {
    id: "953 MOD",
    title: "Starlight Lame’ Royal",
    color: "Black Light Weight Wool",
    pant: "#333 French Blue - David Major",
    slimFit: "#352",
    ultraSlimFit: "#144",
    matchingShirt: "#WLF - White Laydown Collar, Fitted",
    matchingVest: "#B502 - Black Satin Bow",
    matchingShoe: "#WHMT White Matte Finish",
    matchingTie: "#F702 Black Windsor Tie",
    pocketSquare: "#H500 - White Satin",
    studsCufflinks: "Gray / Silver Basic",
    image: "/coat.jpg",
  };
  const columns = useMemo(() => {
    let mappedCols = [
      {
        key: "images",
        header: "Image",
        render: (value: any, row: any) => (
          <>
            <Image
              src={value?.[0] || ""}
              alt={"Category Image"}
              height={40}
              width={40}
              onClick={() => {
                setSelectedImage(value);
              }}
              className="h-10 w-10 object-cover cursor-pointer rounded-md"
            />
          </>
        ),
      },
      {
        key: "style",
        header: "Style",
        render: (value: string) => <span className="text-md">{value}</span>,
      },
      {
        key: "description",
        header: "Description",
        render: (value: string) => {
          const isLong = value?.length > 50;
          const displayText = isLong ? value.slice(0, 50) + "..." : value;

          return (
            <span className="relative group text-md flex items-start justify-start">
              {displayText}
              {isLong && (
                <span
                  className={`absolute left-0 top-full mt-1 hidden group-hover:block z-10 ${theme ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                    } text-xs rounded-md px-2 py-1 shadow-lg whitespace-normal max-w-xs`}
                >
                  {value}
                </span>
              )}
            </span>
          );
        },
      },
      ...(activeTab !== "pocket-square" && activeTab !== "studsCufflinks"
        ? [
          {
            key: "colors",
            header: "Color",
            render: (value: any) => (
              <div className="flex items-center gap-2">
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: getColorCode(value?.name),
                    display: "inline-block",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <span className="text-md">{value?.name}</span>
              </div>
            ),
          },
        ]
        : []),
      {
        key: "buy_price",
        header: "Buy Price",
        render: (value: string) => (
          <span className="text-md text-left block">
            {value ? `${CURRENCY} ${value}` : "N/A"}
          </span>
        ),
      },
      // {
      //   key: "rental_price",
      //   header: "Rental Price",
      //   render: (value: string) => (
      //     <span className="text-md text-left block">
      //       {value ? `${CURRENCY} ${value}` : "N/A"}
      //     </span>
      //   ),
      // },
      // Only show rental price if tab is NOT pocket-square, suspenders, socks
      ...(!["pocket-square", "suspenders", "shocks"].includes(activeTab)
        ? [
          {
            key: "rental_price",
            header: "Rental Price",
            render: (value: string) => (
              <span className="text-md text-left block">
                {value ? `${CURRENCY} ${value}` : "N/A"}
              </span>
            ),
          },
        ]
        : []),
      {
        key: "actions",
        header: "Actions",
        render: (value: any, row: any) => (
          <div className="flex items-center gap-3 justify-center">
            {/* Edit */}
            <button
              className="p-1 hover:bg-blue-100 cursor-pointer rounded-full"
              onClick={() => handleEdit(row)}
            >
              <Edit3 className="h-4 w-4 text-blue-600" />
            </button>

            <button
              className="p-1 hover:bg-green-100 cursor-pointer rounded-full"
              onClick={() => {
                handleView(row);
              }}
            >
              <Eye className="h-4 w-4 text-green-600" />
            </button>

            <button
              className="p-1 hover:bg-red-100 cursor-pointer rounded-full"
              onClick={() => {
                handleDelete(row.id);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          </div>
        ),
      },
    ];

    if (activeTab === "tie") {
      mappedCols.splice(
        mappedCols.length - 1,
        0,
        // {
        //   key: "pocketsquare",
        //   header: "Matching Pocket-Square",
        //   render: (value: any) => <span className="text-xs">{value?.style}</span>,
        // },
        {
          key: "tie_type",
          header: "Type",
          render: (value: any) => (
            <span className="text-xs">
              {value === "neck_tie"
                ? "Neck Tie"
                : value === "bow_tie"
                  ? "Bow Tie"
                  : "N/A"}
            </span>
          ),
        }
      );
    }

    // if (activeTab === 'shirt') {
    //   mappedCols.splice(mappedCols.length - 1, 0, {
    //     key: "vest",
    //     header: "Matching Vest",
    //     render: (value: any) => <span className="text-xs">{value?.style}</span>,
    //   });
    // }
    // if (activeTab === 'coat') {
    //   mappedCols.splice(mappedCols.length - 1, 0, {
    //     key: "pant",
    //     header: "Matching Pant",
    //     render: (value: any) => <span className="text-xs">{value?.style}</span>,
    //   });
    // }

    if (activeTab === "pant") {
      mappedCols.splice(mappedCols.length - 1, 0, {
        key: "pant_type",
        header: "Type",
        render: (value: any) => {
          switch (value) {
            case "slim_fit":
              return <span className="text-xs">Slim Fit</span>;
            case "ultra_slim_fit":
              return <span className="text-xs">Ultra Slim Fit</span>;
            default:
              return <span className="text-xs">N/A</span>;
          }
        },
      });
    }

    if (activeTab === "vest") {
      mappedCols.splice(
        mappedCols.length - 1,
        0
        // {
        //   key: "bowTie",
        //   header: "Bow Tie",
        //   render: (value: any) => (
        //     <span className="text-xs">
        //       {value?.id}
        //     </span>
        //   ),
        // },
        // {
        //   key: "neckTie",
        //   header: "Neck Tie",
        //   render: (value: any) => (
        //     <span className="text-xs">
        //       {
        //         value?.id
        //       }
        //     </span>
        //   ),
        // }
      );
    }

    return mappedCols;
  }, [activeTab]);

  const handleTabChange = (tab: string, headers: TableHeader[]) => {
    if (activeTab === tab) {
      return null;
    }
    setCurrentCategory(null);
    setSearchQuery("");
    setCurrentPage(1);
    setTotalPages(1); 
    setActiveTab(tab);
    setTableHeaders(headers);
    setCollection([]);
  };

  const handleSearch = (value: string) => {
     setCurrentPage(1);
    switch (activeTab) {
      case "coat":
        coatSearch(value);
        break;
      case "pant":
        pantSearch(value);
        break;
      case "shirt":
        shirtSearch(value);
        break;
      case "vest":
        vestSearch(value);
        break;
      case "tie":
        tieSearch(value);
        break;
      case "pocket-square":
        pocketSquareSearch(value);
        break;
      case "suspenders":
        suspendersSearch(value);
        break;
      case "shoe":
        shoeSearch(value);
        break;
      case "shocks":
        shocksSearch(value);
        break;
      case "studsCufflinks":
        studsCufflinksSearch(value);
        break;
    }
  };

  const handleAddShoe = async (data: any) => {
    setIsSubmitting(true);
    try {
      const fileName = await uploadMedia(data.images);
      const payload = {
        ...data,
        colorId: data?.color,
        categoryId: "6",
        style: data?.shoeStyle,
        images: fileName,
        matching_socks:
          data?.matching_socks === "#" ? null : data?.matching_socks,
      };
      let response;
      if (type === "edit") {
        response = await ShoeCategoryServices.updateShoe(
          payload,
          selectedData?.id as number
        );
      } else {
        response = await ShoeCategoryServices.createShoe(payload);
      }
      if (response?.status) {
        setShoes([]);
        setSelectedData(null);
        modalNotification({
          message: response?.message,
          type: "success",
        });
        getAllShoes();
        setIsShoeFormOpen(false);
        setCurrentPage(1);
      }
      else {
        modalNotification({
          message: "Failed to add shoe",
          type: "error",
        });

      }
    } catch (error) {
      logger("Error : ", error);
      modalNotification({
        message: "Failed to add shoe",
        type: "error",
      });
    }
    setIsShoeFormOpen(false);
    setIsSubmitting(false);
  };

  const getAllCollections = async (search: string = "",categoryId?: number) => {
    try {
      setIsLoading(true);
      const queryParams = {
        search: search,
        categoryId: categoryId,
        page: currentPage,
        // limit: PER_PAGE_LIMIT,
      };
      const response = await CollectionServices.getCollectionsList(queryParams);
      if (response?.status) {
        setCollection(response?.results || []);
        setTotalPages(response?.totalPages || 1);
      } else {
        modalNotification({
          message: response?.message || "Failed to get collections",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message: error?.message || "Failed to get collection",
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
          setShoes(response?.results);
          setCurrentCategory(response?.results);
        } else {
          setShoes([notApplicable, ...response?.results]);
        }
      } else {
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
          setPocketSquares(response?.results);
          setCurrentCategory(response?.results);
        } else {
          setPocketSquares([notApplicable, ...response?.results]);
        }
      } else {
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
          setTies(response?.results);
          setCurrentCategory(response?.results);
        } else {
          setTies([notApplicable, ...response?.results]);
        }
      } else {
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
          setVest(response?.results);
          setCurrentCategory(response?.results);
        } else {
          setVest([notApplicable, ...response?.results]);
        }
      } else {
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
          setShirts(response?.results);
          setCurrentCategory(response?.results);
        } else {
          setShirts([notApplicable, ...response?.results]);
        }
      } else {
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
    setTotalPages(0);
    try {
      const queryParams = {
        search,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };
      const response = await PantCategoryServices.getPantList(queryParams);
      if (response?.status) {
        setPants(response?.results);
        setTotalPages(response?.totalPages as number);
        setCurrentCategory(response?.results);
      } else {
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
      const response =
        await StudsCufflinksCategoryServices.getStudsCufflinksList(queryParams);
      if (response?.status) {
        setStudsCufflinks(response?.results);
        if (!isData) {
          setStudsCufflinks(response?.results);
          setCurrentCategory(response?.results);
        } else {
          setStudsCufflinks([notApplicable, ...response?.results]);
        }
        setTotalPages(response?.totalPages as number);
      } else {
        // ✅ Handle API failure response
        modalNotification({
          message: response?.message || "Failed to get studs & cufflinks ",
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
      console.log("Suspenders response:", response);
      if (response?.status) {
        setSuspenders(response?.results);
        if (!isData) {
          setSuspenders(response?.results);
          setCurrentCategory(response?.results);
        } else {
          setSuspenders([notApplicable, ...response?.results]);
        }
        setTotalPages(response?.totalPages as number);
      } else {
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
          setShocks(response?.results);
          setCurrentCategory(response?.results);
        } else {
          setShocks([notApplicable, ...response?.results]);
        }
        setTotalPages(response?.totalPages || 1);
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
        setCoats(response?.results);
        setTotalPages(response?.totalPages as number);
        setCurrentCategory(response?.results);
      } else {
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
      } else {
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
      } else {
        // ✅ Handle API failure response
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

  const handleGetAllCategories = async (tab: string = "coat") => {
    try {
      await Promise.all([
        getAllPants(),
        getAllPcketSquare(),
        getAllShirts(),
        getAllShoes(),
        getAllShocks(),
        getAllSuspenders(),
        getAllTies(),
        getAllVest(),
        getAllCoats(),
        getAllColors(),
        getAllStudsCufflinks(),
        getAllCollections(),
      ]);
      setActiveTab(tab);
    } catch (error) {
      logger("error : ", error);
    }
  };
  const resetCategories = () => {
    setCoats([]);
    setPants([]);
    setShirts([]);
    setVest([]);
    setTies([]);
    setPocketSquares([]);
    setShoes([]);
  };
  const handleDeleteCategory = async () => {
    try {
      let response = null;
      switch (activeTab) {
        case "coat":
          response = await CoatCategoryServices.deleteCoat(selectedProduct);
          if (response?.status) {
            getAllCoats();
          }
          break;
        case "pant":
          response = await PantCategoryServices.deletePant(selectedProduct);
          if (response?.status) {
            getAllPants();
          }
          break;

        case "shirt":
          response = await ShirtCategoryServices.deleteShirt(selectedProduct);
          if (response?.status) {
            getAllShirts();
          }
          break;

        case "vest":
          response = await VestCategoryServices.deleteVest(selectedProduct);
          if (response?.status) {
            getAllVest();
          }
          break;

        case "tie":
          response = await TieCategoryServices.deleteTie(selectedProduct);
          if (response?.status) {
            getAllTies();
          }
          break;
        case "pocket-square":
          response = await PocketSquareCategoryServices.deletePocketSquare(
            selectedProduct
          );
          if (response?.status) {
            getAllPcketSquare();
          } else {
            modalNotification({
              message: response?.message || "Failed to delete pocket square",
              type: "error",
            });
          }
          break;
        case "suspenders":
          response = await SuspendersCategoryServices.deleteSuspenders(
            selectedProduct
          );
          if (response.status) {
            getAllSuspenders();
          }
          break;
        case "shoe":
          response = await ShoeCategoryServices.deleteshoe(selectedProduct);
          if (response.status) {
            getAllShoes();
          }
          break;
        case "studsCufflinks":
          response = await StudsCufflinksCategoryServices.deleteStudsCufflinks(
            selectedProduct
          );
          if (response.status) {
            getAllStudsCufflinks();
          }
          break;
        case "shocks":
          response = await SocksCategoryServices.deleteSocks(selectedProduct);
          if (response.status) {
            getAllShocks();
          }
          break;

        default:
          break;
      }
      if (response?.status) {
        modalNotification({
          message: response?.message || "shocks deleted successfully",
          type: "success",
        });
         setCurrentPage(1);
        // await handleGetAllCategories(activeTab);
      } else {
        modalNotification({
          message: response?.message || `Failed to delete ${activeTab}`,
          type: "error",
        });
      }
      setIsDeleteModalOpen(false);
      setDeleteMessage("");
      setConfirmMessage("");
    } catch (error) {
      modalNotification({
        message: "Something went wrong. Please try again later.",
        type: "error",
      });
      logger("Error : ", error);
    }
  };

  // const totalPages = Math.ceil(sampleItems.length / itemsPerPage);
  // const currentItems = sampleItems.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  const handleView = (data: any) => {
    if (data) {
      setSelectedItem(data);
      setIsDetailPopupOpen(true);
    }
  };

  const handleEdit = async (data: any) => {
    setSelectedData(data);
    setType("edit");
    getAllCollections("", categoryMap[activeTab]);
    if (activeTab === "coat") {
      setIsCoatFormOpen(true);
      getAllShirts(true);
      getAllVest(true);
      getAllShoes(true);
      getAllTies(true);
      getAllPcketSquare(true);
      getAllStudsCufflinks(true);
      getAllPants;
      const [slimFit, ultraSlimFit] = await Promise.all([
        PantCategoryServices.getPantList({ slim_fit: true }),
        PantCategoryServices.getPantList({ ultra_slim_fit: true }),
      ]);
      setSlimFitPants([notApplicable, ...slimFit?.results]);
      setUltraSlimFitPants([notApplicable, ...ultraSlimFit?.results]);
    } else if (activeTab === "pant") {
      setIsPantFormOpen(true);
      getAllSuspenders(true);
    }
    else if (activeTab === "tie") {
      setIsTieFormOpen(true);
      getAllPcketSquare(true);
    } else if (activeTab === "vest") {
      setIsVestFormOpen(true);
      const [neckTieData, bowTieData] = await Promise.all([
        TieCategoryServices.getTieList({ neck_tie: true }),
        TieCategoryServices.getTieList({ bow_tie: true }),
      ]);
      setNeckTies([notApplicable, ...neckTieData?.results]);
      setBowTies([notApplicable, ...bowTieData?.results]);
    } else if (activeTab === "shirt") {
      setIsShirtFormOpen(true);
      getAllShirts(true);
    } else if (activeTab === "pocket-square") setIsPocketFormOpen(true);
    else if (activeTab === "shoe") {
      setIsShoeFormOpen(true);
      getAllShocks(true);
    }
    else if (activeTab === "studsCufflinks") setIsStudsCufflinksFormOpen(true);
    else if (activeTab === "shocks") setIsShocksFormOpen(true);
    else if (activeTab === "suspenders") setIsSuspendersFormOpen(true);
  };
  const handleDelete = (id: number) => {
    setSelectedProduct(id);
    setIsDeleteModalOpen(true);
  };

  const handleAddCoat = async (tab: string) => {
    setIsData(true);
    setSelectedData(null);
    setType("add");
    getAllCollections("", categoryMap[activeTab]);
    if (tab === "coat") {
      setIsCoatFormOpen(true);
      getAllShirts(true);
      getAllVest(true);
      getAllShoes(true);
      getAllTies(true);
      getAllPcketSquare(true);
      getAllShocks(true);
      getAllStudsCufflinks(true);
      getAllPants;
      const [slimFit, ultraSlimFit] = await Promise.all([
        PantCategoryServices.getPantList({ slim_fit: true }),
        PantCategoryServices.getPantList({ ultra_slim_fit: true }),
      ]);
      setSlimFitPants([notApplicable, ...slimFit?.results]);
      setUltraSlimFitPants([notApplicable, ...ultraSlimFit?.results]);
    } else if (tab === "pant") {
      setIsPantFormOpen(true);
      getAllSuspenders(true);
    }
    else if (tab === "tie") {
      setIsTieFormOpen(true);
      getAllPcketSquare(true);
    } else if (tab === "vest") {
      setIsVestFormOpen(true);
      const [neckTieData, bowTieData] = await Promise.all([
        TieCategoryServices.getTieList({ neck_tie: true }),
        TieCategoryServices.getTieList({ bow_tie: true }),
      ]);
      setNeckTies([notApplicable, ...neckTieData?.results]);
      setBowTies([notApplicable, ...bowTieData?.results]);
    } else if (tab === "shirt") {
      setIsShirtFormOpen(true);
      getAllShirts(true);
    } else if (tab === "pocket-square") setIsPocketFormOpen(true);
    else if (tab === "shoe") {
      setIsShoeFormOpen(true);
      getAllShocks(true);
    }
    else if (tab === "shocks") setIsShocksFormOpen(true);
    else if (tab === "suspenders") setIsSuspendersFormOpen(true);
    else if (tab === "pocket-square") setIsPocketFormOpen(true);
    else if (tab === "studsCufflinks") setIsStudsCufflinksFormOpen(true);
  };

  const handleClosePantForm = () => {
    setIsPantFormOpen(false);
    setSelectedData(null);
     setCurrentPage(1);
  };
  const handlePantFormSubmit = async (values: any) => {
    // setIsPantFormOpen(false);
    setIsSubmitting(true);
    try {
      const fileName = await uploadMedia(values.images);
      const payload = {
        ...values,
        categoryId: "3",
        slim_fit: values.slim_fit === "Yes",
        ultra_slim_fit: values.ultra_slim_fit === "Yes",
        images: fileName,
        matching_suspenders:
          values?.matching_suspenders === "#" ? null : values?.matching_suspenders,
      };
      let response;
      if (type === "edit") {
        response = await PantCategoryServices.updatePant(
          payload,
          selectedData?.id as number
        );
      } else {
        response = await PantCategoryServices.createPant(payload);
      }
      if (response?.status) {
        setPants([]);
        modalNotification({
          message: response?.message,
          type: "success",
        });
        getAllPants();
        setIsPantFormOpen(false);
         setCurrentPage(1);
      }
      else {
        modalNotification({
          message: response?.message || "Failed to create pant",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message:
          error.message || "Something went wrong. Please try again later.",
        type: "error",
      });

      logger("Error : ", error);
    }
    setIsPantFormOpen(false);
    setIsSubmitting(false);
  };

  const handleCloseCoatForm = () => {
    setIsCoatFormOpen(false);
    setSelectedData(null);
     setCurrentPage(1);
  };

  const handleCoatFormSubmit = async (values: any) => {
    // setIsCoatFormOpen(false);
    setIsSubmitting(true);
    try {
      const fileName = await uploadMedia(values.images);
      const payload = {
        ...values,
        categoryId: "2",
        slim_fit: values.slim_fit === "Yes",
        ultra_slim_fit: values.ultra_slim_fit === "Yes",
        images: fileName,
        pant_slim_fit:
          values?.pant_slim_fit === "#" ? null : values?.pant_slim_fit,
        pant_ultra_slim_fit:
          values?.pant_ultra_slim_fit === "#"
            ? null
            : values?.pant_ultra_slim_fit,
        matching_shirt:
          values?.matching_shirt === "#" ? null : values?.matching_shirt,
        matching_vest:
          values?.matching_vest === "#" ? null : values?.matching_vest,
        matching_shoe:
          values?.matching_shoe === "#" ? null : values?.matching_shoe,
        matching_tie:
          values?.matching_tie === "#" ? null : values?.matching_tie,
        matching_pocket_square:
          values?.matching_pocket_square === "#"
            ? null
            : values?.matching_pocket_square,
        matching_jewel:
          values?.matching_jewel === "#" ? null : values?.matching_jewel,
      };
      let response;
      if (type === "edit") {
        response = await CoatCategoryServices.updateCoat(
          payload,
          selectedData?.id as number
        );
      } else {
        response = await CoatCategoryServices.createCoat(payload);
      }
      if (response?.status) {
        setCoats([]);
        modalNotification({
          message: response?.message,
          type: "success",
        });
        getAllCoats();
        setIsCoatFormOpen(false);
         setCurrentPage(1);
      }
      else {
        modalNotification({
          message: response?.message || "Failed to create coat",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message:
          error.message || "Something went wrong. Please try again later.",
        type: "error",
      });
      setIsCoatFormOpen(false);
      logger("Error : ", error);
    }
    setIsSubmitting(false);
  };

  const handleCloseShirtForm = () => {
    setIsShirtFormOpen(false);
    setSelectedData(null);
     setCurrentPage(1);
  };
  const handleShirtFormSubmit = async (values: any) => {
    // setIsShirtFormOpen(false);
    setIsSubmitting(true);
    try {
      const fileName = await uploadMedia(values.images);
      const payload = {
        ...values,
        categoryId: "4",
        slim_fit: true,
        ultra_slim_fit: false,
        images: fileName,
      };
      let response;
      if (type === "edit") {
        response = await ShirtCategoryServices.updateShirt(
          payload,
          selectedData?.id as number
        );
      } else {
        response = await ShirtCategoryServices.createShirt(payload);
      }
      if (response?.status) {
        setShirts([]);
        modalNotification({
          message: response?.message,
          type: "success",
        });
        getAllShirts();
        setIsShirtFormOpen(false);
                 setCurrentPage(1);

      }
      else {
        modalNotification({
          message: response?.message || "Failed to create shirt",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message:
          error.message || "Something went wrong. Please try again later.",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsShirtFormOpen(false);
    setIsSubmitting(false);
    
  };

  const handleCloseTieForm = () => {
    setIsTieFormOpen(false);
    setSelectedData(null);
     setCurrentPage(1);
  };

  const handleCloseShocksForm = () => {
    setIsShocksFormOpen(false);
    setSelectedData(null);
     setCurrentPage(1);
  };

  const handleCloseSuspendersForm = () => {
    setIsSuspendersFormOpen(false);
    setSelectedData(null);
     setCurrentPage(1);
  };

  const handleSuspendersFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const fileName = await uploadMedia(values.images);
      const payload = {
        ...values,
        categoryId: "11",
        colorId: values?.color,
        images: fileName,
      };
      let response;
      if (type === "edit") {
        response = await SuspendersCategoryServices.updateSuspenders(
          payload,
          selectedData?.id as number
        );
      } else {
        response = await SuspendersCategoryServices.createSuspenders(payload);
      }
      if (response?.status) {
        setSuspenders([]);
        modalNotification({
          message: response?.message,
          type: "success",
        });
        getAllSuspenders();
        setIsSuspendersFormOpen(false);
                 setCurrentPage(1);

      }
      else {
        modalNotification({
          message: response?.message || "Failed to create suspenders",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message:
          error.message || "Something went wrong. Please try again later.",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsSuspendersFormOpen(false);
    setIsSubmitting(false);
  };
  const handleTieFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const fileName = await uploadMedia(values.images);
      const payload = {
        ...values,
        categoryId: "7",
        colorId: values?.color,
        style: values?.tieStyle,
        images: fileName,
        matching_pocket_square:
          values?.matching_pocket_square === "#"
            ? null
            : values?.matching_pocket_square,
      };
      let response;
      if (type === "edit") {
        response = await TieCategoryServices.updateTie(
          payload,
          selectedData?.id as number
        );
      } else {
        response = await TieCategoryServices.createTie(payload);
      }
      if (response?.status) {
        setTies([]);
        modalNotification({
          message: response?.message,
          type: "success",
        });
        getAllTies();
        setIsTieFormOpen(false);
                 setCurrentPage(1);

      }
      else {
        modalNotification({
          message: response?.message || "Failed to create tie",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message:
          error.message || "Something went wrong. Please try again later.",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsTieFormOpen(false);
    setIsSubmitting(false);
    
  };

  const handleShocksFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const fileName = await uploadMedia(values.images);
      const payload = {
        ...values,
        categoryId: "10",
        colorId: values?.color,
        style: values?.tieStyle,
        images: fileName,
      };
      let response;
      if (type === "edit") {
        response = await SocksCategoryServices.updateSocks(
          payload,
          selectedData?.id as number
        );
      } else {
        response = await SocksCategoryServices.createSocks(payload);
      }
      if (response?.status) {
        setTies([]);
        modalNotification({
          message: response?.message,
          type: "success",
        });
        getAllShocks();
        setIsShocksFormOpen(false);
                 setCurrentPage(1);

      }
      else {
        modalNotification({
          message: response?.message || "Failed to create socks",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message:
          error.message || "Something went wrong. Please try again later.",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsTieFormOpen(false);
    setIsSubmitting(false);
  };

  const handleCloseVestForm = () => {
    setIsVestFormOpen(false);
    setSelectedData(null);
     setCurrentPage(1);
  };

  const handleVestFormSubmit = async (values: any) => {
    // setIsVestFormOpen(false);
    setIsSubmitting(true);
    try {
      const fileName = await uploadMedia(values.images);
      const payload = {
        ...values,
        categoryId: "5",
        slim_fit: true,
        ultra_slim_fit: false,
        images: fileName,
        bow_tie: values?.bow_tie === "#" ? null : values?.bow_tie,
        neck_tie: values?.neck_tie === "#" ? null : values?.neck_tie,
      };

      let response;
      if (type === "edit") {
        response = await VestCategoryServices.updateVest(
          payload,
          selectedData?.id as number
        );
      } else {
        response = await VestCategoryServices.createVest(payload);
      }
      if (response?.status) {
        setVest([]);
        modalNotification({
          message: response?.message,
          type: "success",
        });
        getAllVest();
        setIsVestFormOpen(false);
                 setCurrentPage(1);

      }
      else {
        modalNotification({
          message: response?.message || "Failed to create vest",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message:
          error.message || "Something went wrong. Please try again later.",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsVestFormOpen(false);
    setIsSubmitting(false);
    
  };

  const handleCloseShoeForm = () => {
    setIsShoeFormOpen(false);
    setSelectedData(null);
     setCurrentPage(1);
  };
  const handleShoeFormSubmit = (values: any) => {
    setIsShoeFormOpen(false);
  };

  const handleClosePocketForm = () => {
    setIsPocketFormOpen(false);
    setSelectedData(null);
     setCurrentPage(1);
  };

  const handlePocketFormSubmit = async (values: any) => {
    // setIsPocketFormOpen(false);
    setIsSubmitting(true);

    try {
      const fileName = await uploadMedia(values.images);
      const payload = {
        ...values,
        categoryId: "9",
        // colorId:values?.color,
        style: values?.pocketStyle,
        images: fileName,
      };
      let response;
      if (type === "edit") {
        response = await PocketSquareCategoryServices.updatePocketSquare(
          payload,
          selectedData?.id as number
        );
      } else {
        response = await PocketSquareCategoryServices.createPocketSquare(
          payload
        );
      }
      if (response?.status) {
        setPocketSquares([]);
        setSelectedData(null);
        modalNotification({
          message: response?.message,
          type: "success",
        });
        getAllPcketSquare();
        setIsPocketFormOpen(false);
         setCurrentPage(1);
      }
    } catch (error) {
      modalNotification({
        message: error?.message || "Failed to add pocket square",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsPocketFormOpen(false);
    setIsSubmitting(false);
  };

  const handleCloseStudsCufflinksForm = () => {
    setIsStudsCufflinksFormOpen(false);
    setSelectedData(null);
     setCurrentPage(1);
  };

  const handleStudsCufflinksFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const fileName = await uploadMedia(values.images);
      const payload = {
        ...values,
        categoryId: "8",
        images: fileName,
      };
      let response;
      if (type === "edit") {
        response = await StudsCufflinksCategoryServices.updateStudsCufflinks(
          payload,
          selectedData?.id as number
        );
      } else {
        response = await StudsCufflinksCategoryServices.createstudsCufflinks(
          payload
        );
      }
      if (response?.status) {
        setStudsCufflinks([]);
        setSelectedData(null);
        modalNotification({
          message: response?.message,
          type: "success",
        });
        getAllStudsCufflinks();
        setIsStudsCufflinksFormOpen(false);
                 setCurrentPage(1);

      }
      else {
        modalNotification({
          message: response?.message || "Failed to create studs cufflinks",
          type: "error",
        });
      }
    } catch (error) {
      modalNotification({
        message:
          error.message || "Something went wrong. Please try again later.",
        type: "error",
      });
      logger("Error : ", error);
    }
    setIsStudsCufflinksFormOpen(false);
    setIsSubmitting(false);

  };

  const getActiveTab = (tab: string) => {
    return tabs.filter((item) => item?.id === tab)?.[0]?.label;
  };

  useEffect(() => {
    getAllColors();
    switch (activeTab) {
      case "coat":
        getAllCoats();
        break;
      case "pant":
        getAllPants();
        break;
      case "shirt":
        getAllShirts();
        break;
      case "vest":
        getAllVest();
        break;
      case "tie":
        getAllTies();
        break;
      case "pocket-square":
        getAllPcketSquare();
        break;
      case "shoe":
        getAllShoes();
        break;
      case "shocks":
        getAllShocks();
        break;
      case "studsCufflinks":
        getAllStudsCufflinks();
        break;
      case "suspenders":
        getAllSuspenders();
        break;
      default:
        logger("Default case");
    }
  }, [activeTab, currentPage]);

  return (
    <div className="min-h-screen">
      <div className="lg:ml-auto">
        <main className="p-4 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-8">
            <h1
              className={`${theme ? "text-[#313A46]" : "text-[#C1C1C1]"
                } text-xl sm:text-2xl font-semibold hidden sm:block`}
            >
              Category
            </h1>
          </div>
          <div
            className={`rounded-sm ${theme
              ? " text-[#2D333C] border border-none"
              : "bg-gray-700 text-[#C1C1C1] border border-[#0000000F]"
              }`}
          >
            {" "}
            {/* Category Tabs */}
            <div
              className={`rounded-sm pt-10 px-0 ${theme
                ? " text-[#2D333C] border border-none"
                : "bg-gray-700 text-[#C1C1C1] border border-[#0000000F]"
                }`}
            >
              <CategoryTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                theme={authData?.admin?.theme}
              />
            </div>
            {/* Section Header */}
            <div
              className={`flex items-center justify-between mb-0 mx-0 mt-8 p-4 rounded gap-4 flex-wrap
    ${theme ? "bg-[#ffffff] text-[#313A46]" : "bg-gray-700 text-[#C1C1C1]"}
  `}
            >
              {/* Left Title */}
              <h2
                className={`text-xl font-semibold capitalize ${theme ? "text-[#313A46]" : "text-[#C1C1C1]"
                  }`}
              >
                {getActiveTab(activeTab)}
              </h2>

              {/* Right Section: Search + Filter + Button */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Search Input */}

                <div className="relative w-72">
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
                    // placeholder={`Search ${activeTab}...`}
                    placeholder={`Search ${tabs.find((tab) => tab.id === activeTab)?.label ||
                      activeTab
                      }...`}
                    className={`pl-9 pr-3 py-2 rounded-md text-sm outline-none w-full transition-colors
      ${theme
                        ? "bg-gray-100 text-gray-800 border border-gray-300 focus:border-blue-500"
                        : "bg-gray-600 text-gray-200 border border-gray-500 focus:border-blue-400"
                      }`}
                    onChange={(e) => {
                      handleSearch(e.target.value);
                      setSearchQuery(e.target.value);
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
                <button
                  onClick={() => handleAddCoat(activeTab)}
                  className={`text-white font-medium py-2 h-10 px-6 transition-colors cursor-pointer rounded-md
        ${theme
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border border-[#485568] bg-[#313A46] hover:bg-gray-700"
                    }
      `}
                >
                  Add{" "}
                  {activeTab === "coat"
                    ? "Coat"
                    : activeTab === "pant"
                      ? "Pant"
                      : activeTab === "shirt"
                        ? "Shirt"
                        : activeTab === "vest"
                          ? "Vest"
                          : activeTab === "tie"
                            ? "Tie"
                            : activeTab === "pocket-square"
                              ? "Pocket Square"
                              : activeTab === "suspenders"
                                ? "Suspenders"
                                : activeTab === "Shoe"
                                  ? "Shoe"
                                  : activeTab === "shocks"
                                    ? "Socks"
                                    : activeTab === "studsCufflinks"
                                      ? "Studs & Cufflinks"
                                      : "Shoe"}
                </button>
              </div>
            </div>
            <div className="">
              <CommonTable
                columns={columns}
                data={currentCategory}
                theme={theme}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={isLoading}
              />
            </div>
            {/* Pant Form */}
            <AddPantForm
              isOpen={isPantFormOpen}
              onClose={handleClosePantForm}
              onSubmit={handlePantFormSubmit}
              type={type}
              colors={colors}
              isSubmitting={isSubmitting}
              theme={authData?.admin?.theme}
              selectedData={selectedData}
              collections={collection}
              matching_suspenders={suspenders}
            />
            <AddCoatForm
              isOpen={isCoatFormOpen}
              onClose={handleCloseCoatForm}
              onSubmit={handleCoatFormSubmit}
              isSubmitting={isSubmitting}
              type={type}
              shirts={shirts}
              vests={vest}
              shoes={shoes}
              ties={ties}
              pants={pants}
              slimFitPants={slimFitPants}
              ultraSlimFitPants={ultraSlimFitPants}
              pocketSquares={pocketSquares}
              colors={colors}
              theme={authData?.admin?.theme}
              selectedData={selectedData}
              jewels={studsCufflinks}
              setSelectedId={setSelectedId}
              collections={collection}
            />
            <AddShirtForm
              isOpen={isShirtFormOpen}
              onClose={handleCloseShirtForm}
              onSubmit={handleShirtFormSubmit}
              type={type}
              colors={colors}
              vests={vest}
              theme={authData?.admin?.theme}
              selectedData={selectedData}
              isSubmitting={isSubmitting}
              collections={collection}
            />
            <AddTieForm
              isOpen={isTieFormOpen}
              onClose={handleCloseTieForm}
              onSubmit={handleTieFormSubmit}
              type={type}
              colors={colors}
              pocketSquares={pocketSquares}
              theme={authData?.admin?.theme}
              selectedData={selectedData}
              isSubmitting={isSubmitting}
              collections={collection}
            />
            <AddShoesForm
              isOpen={isShoeFormOpen}
              onClose={handleCloseShoeForm}
              onSubmit={handleAddShoe}
              colors={colors}
              type={type}
              selectedData={selectedData}
              // onSubmit={handleShoeFormSubmit}
              theme={authData?.admin?.theme}
              isSubmitting={isSubmitting}
              collections={collection}
              matching_socks={shocks}
            />
            <AddStudsCufflinksForm
              isOpen={isStudsCufflinksFormOpen}
              onClose={handleCloseStudsCufflinksForm}
              onSubmit={handleStudsCufflinksFormSubmit}
              type={type}
              theme={authData?.admin?.theme}
              selectedData={selectedData}
              isSubmitting={isSubmitting}
              collections={collection}
            />
            <AddPocketSquareForm
              isOpen={isPocketFormOpen}
              onClose={handleClosePocketForm}
              onSubmit={handlePocketFormSubmit}
              theme={authData?.admin?.theme}
              selectedData={selectedData}
              type={type}
              isSubmitting={isSubmitting}
              collections={collection}
            />
            <AddVestForm
              isOpen={isVestFormOpen}
              onClose={handleCloseVestForm}
              onSubmit={handleVestFormSubmit}
              type={type}
              colors={colors}
              theme={authData?.admin?.theme}
              selectedData={selectedData}
              isSubmitting={isSubmitting}
              neckTies={neckTies}
              bowTies={bowTies}
              collections={collection}
            />
            <AddShocksForm
              isOpen={isSocksFormOpen}
              onClose={handleCloseShocksForm}
              onSubmit={handleShocksFormSubmit}
              type={type}
              colors={colors}
              theme={authData?.admin?.theme}
              selectedData={selectedData}
              isSubmitting={isSubmitting}
              collections={collection}
            />
            <AddSuspendersForm
              isOpen={isSuspendersFormOpen}
              onClose={handleCloseSuspendersForm}
              onSubmit={handleSuspendersFormSubmit}
              type={type}
              colors={colors}
              theme={authData?.admin?.theme}
              selectedData={selectedData}
              isSubmitting={isSubmitting}
              collections={collection}
            />
            <DeleteConfirmationModal
              isOpen={isDeleteModalOpen}
              isLoading={isLoading}
              deleteMessage={deleteMessage}
              confirmMessage={confirmMessage}
              key="001"
              onClose={() => {
                setIsDeleteModalOpen(false);
                setDeleteMessage("");
                setConfirmMessage("");
              }}
              onConfirm={handleDeleteCategory}
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
            <DetailsCard
              isOpen={isDetailPopupOpen}
              onClose={() => setIsDetailPopupOpen(false)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              data={selectedItem}
              category={activeTab}
              displayTitle={getActiveTab(activeTab)}
              theme={authData?.admin?.theme}
            />
            {/* Pagination */}
         {totalPages > 1 && currentCategory && currentCategory.length >= itemsPerPage && (
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
  />
)}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
