"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronRight, Redo, Undo } from "lucide-react";
import Image from "next/image";
import FooterLookBuilder from "@/components/footerLookBuild";
import ProductDrawer, { Product } from "@/components/productLookDrawer";
import Builder from "@/components/common/builderComponent";
import { CoatCategoryServices } from "@/servivces/admin/category/coat.service";
import { PantCategoryServices } from "@/servivces/admin/category/pant.service";
import { ShirtCategoryServices } from "@/servivces/admin/category/shirt.service";
import { VestCategoryServices } from "@/servivces/admin/category/vest.service";
import { TieCategoryServices } from "@/servivces/admin/category/tie.service";
import { PocketSquareCategoryServices } from "@/servivces/admin/category/pocketSquare.service";
import { ShoeCategoryServices } from "@/servivces/admin/category/shoe.service";
import { StudsCufflinksCategoryServices } from "@/servivces/admin/category/jewelry.service";
import logger from "@/utils/logger";
import { SuspendersCategoryServices } from "@/servivces/admin/category/suspenders.service";
import { SocksCategoryServices } from "@/servivces/admin/category/socks.service";
import { useDispatch, useSelector } from "react-redux";
import { flattenLayers, setLocalStorageToken } from "@/utils";
import { hangerLayer } from "@/hooks/useLayers";
import { CURRENCY, CUSTOMER_ROLE_ID } from "@/utils/env";
import { redo, undo, updateLayerInCategory } from "@/app/redux/slice/look-builder.slice";
import TuxedoCustomizer from "../tuxedo-customizer/page";
import LookPreview from '@/components/lookPreview';
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import AuthEventPopUp from "@/components/common/authEventPopUp";
import { selectEventData, setActiveSidebar, updateEventData } from "@/app/redux/slice/auth.slice";
import HeaderLookBuilder from "@/components/headerLookBuild";
import SidebarForm from "@/components/addEditOutfit";
import { outfitServices } from "@/servivces/user/outfit.service";
import modalNotification from "@/utils/notification";

type ClothingItem = {
  id: string;
  name: string;
  icon: string;
  product?: any[];
  image?: string;
  lookPreviewClass?: string;
};

type CustomerInfo = {
  firstName: string;
  lastName: string;
  role: string;
};

type SelectedItems = Record<string, boolean>;

type SelectedProducts = Record<string, Product | null>;

const categoryServices: Record<string, any> = {
  Coat: CoatCategoryServices,
  Pant: PantCategoryServices,
  Shirt: ShirtCategoryServices,
  Vest: VestCategoryServices,
  Tie: TieCategoryServices,
  PocketSquare: PocketSquareCategoryServices,
  Suspenders: SuspendersCategoryServices,
  Shoe: ShoeCategoryServices,
  Socks: SocksCategoryServices,
  StudsCufflinks: StudsCufflinksCategoryServices,
};
const LookBuilder: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [showOutfitForm, setShowOutfitForm] = useState<boolean>(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    role: "",
  });
  const [eventData, setEventData] = useState({
    firstName: "",
    lastName: "",
    eventName: "",
    eventDate: "",
    ownerRole: "Groom",
    totalPrice: 0,
  });
  const lookBuilderRef = useRef<HTMLDivElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>(
    {}
  );
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState<
    Record<string, any[]>
  >({});
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const layerData = useSelector((state: any) => state.lookBuilder.present);
  const hangerData = layerData["Pant"] || layerData["Socks"];
  const lookBuilderData = useSelector((state: any) => state.lookBuilder);
  const present = lookBuilderData.present as any;
  const eventOutfitData = useSelector(selectEventData);
  const searchParams = useSearchParams();
  const priceType = searchParams.get("price_type");
  const showEventPopupFlag = searchParams.get("showEventPopup");
  const eventType = searchParams.get("type");
  const outfitIndex = searchParams.get("outfit");
  let layers = flattenLayers(layerData);
  if (hangerData && hangerData.length > 0) {
    layers = [
      ...layers,
      hangerLayer
    ]
  }
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    if (showEventPopupFlag === "true") {
      setShowEventPopup(true);
    }
  }, [showEventPopupFlag]);

  const getAllProducts = async () => {
    try {
      const queryParams = {
        limit: 30,
        page: 1,
        price_type: priceType
      };

      const responses = await Promise.all(
        Object.entries(categoryServices).map(async ([category, service]) => {
          try {

            const response = await service[
              `get${category.replace(/\s/g, "")}List`
            ](queryParams);
            return {
              category,
              products: response?.status ? response.results : [],
            };

          } catch (err) {
            logger(`Error fetching ${category}:`, err);
            return { category, products: [] };
          }
        })
      );

      const grouped: Record<string, any[]> = {};
      responses.forEach(({ category, products }) => {
        grouped[category] = products;
      });

      setProductsByCategory(grouped);

      const combined = shuffleArray(responses.flatMap((r) => r.products));
      setAllProducts(combined);
    } catch (err) {
      logger("Error fetching products:", err);
    }
  };

  const clothingItems: ClothingItem[] = [
    {
      id: "Coat",
      name: "Jacket",
      icon: "/assets/SVG/icons/new-coat.svg",
      product: layerData["Coat"] || [],
      image: "/assets/images/jacket.png",
      lookPreviewClass: "coat-preview"
    },
    {
      id: "Pant",
      name: "Pants",
      icon: "/assets/SVG/icons/pants.svg",
      product: layerData["Pant"] || [],
      image: "/assets/images/pant.png",
      lookPreviewClass: "pant-preview",
    },
    {
      id: "Shirt",
      name: "Shirt",
      icon: "/assets/SVG/icons/shirt.svg",
      product: layerData["Shirt"] || [],
      image: "/assets/images/shirt.png",
      lookPreviewClass: "shirt-preview"
    },
    {
      id: "Tie",
      name: "Tie",
      icon: "/assets/SVG/icons/tie.svg",
      product: layerData["Tie"] || [],
      image: "/assets/images/tie.png",
      lookPreviewClass: `${layerData["Tie"]?.[0]?.className}-preview`
    },
    {
      id: "Vest",
      name: "Vest & Cummerbund",
      icon: "/assets/SVG/icons/vest.svg",
      product: layerData["Vest"] || [],
      image: "/assets/images/vest.png",
      lookPreviewClass: "vest-preview"
    },
    {
      id: "PocketSquare",
      name: "Pocket Square",
      icon: "/assets/SVG/icons/pocket-square.svg",
      product: layerData["PocketSquare"] || [],
      image: "/assets/images/pocket_square.png",
      lookPreviewClass: "pocket-preview"
    },
    {
      id: "StudsCufflinks",
      name: "Studs & Cufflinks",
      icon: "/assets/SVG/icons/cufflink.svg",
      product: layerData["StudsCufflinks"] || [],
      image: "/assets/images/cufflinks.png",
      lookPreviewClass: "cufflink-preview"
    },
    {
      id: "Suspenders",
      name: "Suspenders",
      icon: "/assets/SVG/icons/belt.svg",
      product: layerData["Suspenders"] || [],
      image: "/assets/images/belt.png",
      lookPreviewClass: "suspenders-preview"
    },
    {
      id: "Shoe",
      name: "Shoes",
      icon: "/assets/SVG/icons/shoes.svg",
      product: layerData["Shoe"] || [],
      image: "/assets/images/shoeDummy.png",
      lookPreviewClass: "shoes-preview"
    },
    {
      id: "Socks",
      name: "Socks",
      icon: "/assets/SVG/icons/socks.svg",
      product: layerData["Socks"] || [],
      image: "/assets/images/socks.png",
      lookPreviewClass: "socks-preview"
    },
  ];

  const handleUpdateOutfit = async () => {
    try {
      const selectedOutfit = eventOutfitData?.outfits?.[Number(outfitIndex)];

      const outfitData = {
        eventId: selectedOutfit?.eventId,
        firstName: selectedOutfit?.firstName,
        lastName: selectedOutfit?.lastName,
        email: selectedOutfit?.email,
        phone: selectedOutfit?.phone,
        coatId: present?.Coat?.[0]?.id || null,
        pantId: present?.Pant?.[0]?.id || null,
        shirtId: present?.Shirt?.[0]?.id || null,
        tieId: present?.Tie?.[0]?.id || null,
        vestId: present?.Vest?.[0]?.id || null,
        shoeId: present?.Shoe?.[0]?.id || null,
        socksId: present?.Socks?.[0]?.id || null,
        jewelId: present?.StudsCufflinks?.[0]?.id || null,
        suspendersId: present?.Suspenders?.[0]?.id || null,
        pocket_squareId: present?.PocketSquare?.[0]?.id || null,
        totalAmount: getTotalPrice ? getTotalPrice().toFixed(4) : 0
      };
      const response = await outfitServices.updateOutfit(outfitData, selectedOutfit?.id);
      if (response.status) {
        const updatedOutfits = eventOutfitData.outfits.map((outfit, index) =>
          index === Number(outfitIndex) ? response.results : outfit
        );
        const updatedEventData = {
          ...eventOutfitData,
          outfits: updatedOutfits,
        };
        dispatch(updateEventData(updatedEventData));
        modalNotification({
          type: "success",
          message: "Outfit updated successfully",
        });
        router.push(`/event-details?price_type=${priceType}`);
      }
    } catch (error) {
      logger("Error updating outfit:", error);
    }
  };


  const handleItemClick = (itemId: string) => {
    setSelectedCategory(itemId);
    const data = productsByCategory[itemId] || []
    setSelectedProduct(data);
    setDrawerOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedLayers = {
      ...layerData,
      [itemId]: undefined,
    }
    dispatch(updateLayerInCategory({ category: selectedCategory, layer: updatedLayers }))
  }

  const handleProductSelect = (product: Product | null) => {
    if (!selectedCategory) return;

    if (!product) {
      setSelectedProducts((prev) => {
        const updated = { ...prev };
        delete updated[selectedCategory];
        return updated;
      });
      setSelectedItems((prev) => {
        const updated = { ...prev };
        delete updated[selectedCategory];
        return updated;
      });
      setDrawerOpen(false);
      return;
    }

    setSelectedProducts((prev) => ({
      ...prev,
      [selectedCategory]: { ...product, category: selectedCategory },
    }));
    setSelectedItems((prev) => ({
      ...prev,
      [selectedCategory]: true,
    }));

    setDrawerOpen(false);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedCategory("");
    setSelectedProduct([]);
  };

  const getTotalPrice = () => {
    let total = 0;
    Object.keys(layerData).forEach((category) => {
      const products = layerData[category];
      total += priceType === 'rental_price' ? parseFloat(products?.[0].rental_price) || 0 : parseFloat(products?.[0].buy_price) || 0;
    });
    // return layers.reduce((total, product) => {
    //   return total + (parseInt(product?.rental_price) || 0);
    // }, 0);
    return total
  };
  const handleSelectProduct = (category: string, product: Product) => {
    setSelectedProducts((prev) => {
      let updated = { ...prev, [category]: product };

      if (category === "jacket") {
        delete updated["vest"];
      }

      return updated;
    });
  };
  const layerOrder = [
    "shirt",
    "vest",
    "jacket",
    "tie",
    "pocket",
    "lapel",
    "cufflinks",
    "belt",
    "shoes",
    "socks",
  ];

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    const total = getTotalPrice();
    setEventData((prev) => ({ ...prev, totalPrice: total }));
  }, [layerData, priceType]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (isCtrlOrCmd && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (lookBuilderData.past.length > 0) dispatch(undo());
      }
      if (isCtrlOrCmd && e.key.toLowerCase() === "y") {
        e.preventDefault();
        if (lookBuilderData.future.length > 0) dispatch(redo());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, lookBuilderData.past.length, lookBuilderData.future.length]);


  // useEffect(() => {
  //   if (showAuthPopup || showEventPopup) {
  //     document.body.style.overflow = "hidden"; // Stop scrolling
  //   } else {
  //     document.body.style.overflow = "auto"; // Enable scrolling again
  //   }


  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, [showAuthPopup, showEventPopup]);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-advent">
      {/* <HeaderLookBuilder title="dgdgb" /> */}
      <AuthEventPopUp
        type="event"
        isOpen={showEventPopup}
        onClose={() => setShowEventPopup(false)}
        eventData={eventData}
        onEventDataChange={setEventData}
      />
      {showCustomizer ? (
        <LookPreview
          onBack={() => setShowCustomizer(false)}
          items={clothingItems}
          layerData={layerData}
          onSelectProduct={handleItemClick}
        />
      ) : (
        <>
          <div className="flex flex-col lg:flex-row lg:flex-1">
            {/* Left Side - Look Builder */}
            <div
              ref={lookBuilderRef}
              className="w-full lg:w-1/2 bg-[#FFFFFF] relative flex flex-col lg:h-[calc(100vh-60px)] lg:overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-[#313131] text-white p-3 sm:p-4 text-center font-marcellus">
                <h2 className="text-xl font-semibold">Look Builder</h2>
              </div>

              <div style={{ height: '500px' }} className="overflow-hidden">
                <div className="flex flex-row items-center justify-between mt-4 gap-2 px-2 sm:px-4">
                  <button className="disabled:cursor-not-allowed flex cursor-pointer items-center bg-white text-[#000000] hover:bg-gray-100 px-3 py-2 rounded font-advent font-semibold"
                    disabled={!lookBuilderData.past.length}
                    onClick={() => dispatch(undo())}
                  >
                    <Undo className="w-4 h-4 mr-1" />
                    <span>Undo</span>
                  </button>
                  <button className="flex items-center justify-center text-black bg-white hover:bg-gray-100 px-4 py-2 font-advent border border-gray-300 w-full sm:w-auto cursor-pointer"
                    onClick={() => setShowCustomizer(true)}

                  >
                    Customize
                  </button>
                  <button className="disabled:cursor-not-allowed flex cursor-pointer items-center justify-center bg-white text-black hover:bg-gray-100 px-3 py-2 rounded w-full sm:w-auto"
                    disabled={!lookBuilderData.future.length}
                    onClick={() => dispatch(redo())}
                  >
                    <span className="mr-1">Redo</span>
                    <Redo className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center p-8 ">
                  <div className="relative max-w-xs sm:max-w-md md:max-w-lg aspect-[3/5] bg-white flex items-center justify-center min-h-[400px]">
                    {layers.length <= 0 ? (
                      <Image
                        src="/assets/suitframe.svg"
                        alt="Suit Frame"
                        width={300}
                        height={400}
                        className="object-contain cursor-pointer"
                        style={{ marginBottom: '100px' }}
                        onClick={() => setShowCustomizer(true)}
                      />
                    ) : <Builder
                      layers={layers}
                      setShowCustomizer={setShowCustomizer}
                    />}
                    {/* <Builder /> */}
                    {layerOrder.map((category, index) => {
                      const product = selectedProducts[category];
                      if (!product) return null;

                      return (
                        <Image
                          key={index}
                          src={product.image}
                          alt={product.name}
                          width={800}
                          height={200}
                          className="object-contain"
                          style={{ zIndex: index }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 bg-white">
              <div className="bg-[#F8F8F8] text-center p-4 z-50">
                <h2 className="font-advent text-xl text-[#000000] font-medium">
                  Recommendations
                </h2>
              </div>
              <div className="p-6 flex-1 overflow-y-auto lg:max-h-[calc(100vh-120px)] max-lg:pb-20">
                <div className="mb-6">
                  {showOutfitForm && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="First name"
                        value={customerInfo.firstName}
                        onChange={(e) =>
                          setCustomerInfo((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Last name"
                        value={customerInfo.lastName}
                        onChange={(e) =>
                          setCustomerInfo((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={customerInfo.role}
                        onChange={(e) =>
                          setCustomerInfo((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select role</option>
                        <option value="groom">Groom</option>
                        <option value="groomsman">Groomsman</option>
                        <option value="father">Father of Bride/Groom</option>
                        <option value="guest">Guest</option>
                      </select>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    {/* Price */}
                    <div className="text-xl font-bold font-advent">
                      LOOK -{" "}
                      <span className="text-black">
                        {CURRENCY}{getTotalPrice().toFixed(2)}
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 font-advent">
                      <button
                        className="bg-[#D6A680] text-white px-4 py-2 w-full sm:w-auto cursor-pointer"
                        onClick={() => {
                          if (auth.isAuthenticate) {
                            logger("Event Type:", eventType);
                            if (eventType === "add") {
                              setIsEditOpen(true);
                            } else if (eventType === "edit") {
                              handleUpdateOutfit();
                            } else {
                              setShowEventPopup(true)
                            }

                          } else {
                            router.push('/signin?redirect=/look-builder?showEventPopup=true')

                          }
                        }}
                      >
                        Save Outfit
                      </button>


                      <button
                        className={`px-6 py-2 w-full sm:w-auto rounded text-white 
                          ${eventType ? "bg-gray-300 cursor-pointer" : "bg-gray-200 cursor-not-allowed opacity-70"}`}
                        disabled={!eventType}
                        onClick={() => {
                          if (eventType) {
                            router.back(); 
                          } else {
                            setShowOutfitForm(false); 
                          }
                        }}
                      >
                        Cancel
                      </button>


                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {clothingItems.map((item, idx) => {
                    const product = selectedProducts[item.id];

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 border cursor-pointer transition-colors bg-white ${product
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-100"
                          }`}
                        onClick={() => !product && handleItemClick(item.id)}
                      >
                        {/* Left side: Icon + Title */}
                        <div className="flex items-center space-x-3">
                          <Image
                            src={product ? product.image : item.icon}
                            alt={product ? product.name : item.name}
                            width={24}
                            height={24}
                          />

                          {/* <span className="font-medium text-gray-800">
            {item?.product?.length ? item?.product.name : item.name}
          </span> */}
                        </div>

                        {/*  Title + Price aligned to the end */}
                        <div className="flex items-center ml-auto space-x-4">
                          <span className="text-xs text-gray-500 mt-1 max-w-[220px] line-clamp-2">
                            {item?.product?.[0]?.description?.slice(0, 50) || ""}
                          </span>
                          <span className="text-sm text-gray-700 font-medium">
                            {item?.product?.length ? item?.product?.[0]?.title : ""}
                          </span>
                          <span className="text-sm font-semibold text-black">
                            {/* {(priceType === 'buy_price' && item?.product?.[0]) ?
                              `Buy Price : ${CURRENCY}${item?.product?.[0]?.buy_price || 0}` : null
                            }
                            {
                              (priceType === 'rental_price' && item?.product?.[0]) ?
                                `Rental Price : ${CURRENCY}${item?.product?.length ? item?.product?.[0]?.rental_price : 0}` : null
                            } */}

                            {(() => {
                              const p = item?.product?.[0];
                              if (!p) return null;

                              // Always show buy price for these categories
                              if (["PocketSquare", "Suspenders", "Socks"].includes(item.id)) {
                                return `Buy Price : ${CURRENCY}${p.buy_price || 0}`;
                              }

                              // Otherwise, use the main price type
                              if (priceType === "rental_price") {
                                return `Rental Price : ${CURRENCY}${p.rental_price || 0}`;
                              }
                              return `Buy Price : ${CURRENCY}${p.buy_price || 0}`;
                            })()}

                          </span>

                        </div>
                        <br />
                        {/* Right side: Action buttons */}
                        {item?.product?.length ? (
                          <div className="flex space-x-2 ms-4">
                            {/* Edit */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemClick(item.id);
                              }}
                              className="p-1 border bg-[#D9D9D9] rounded hover:bg-gray-300 transition"
                            >
                              <Image
                                src="assets/SVG/icons/edit1.svg"
                                alt="Edit"
                                width={16}
                                height={16}
                                className="filter invert-0 brightness-0 cursor-pointer"
                              />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItem(item.id);
                              }}
                              className="p-1 border-[#E9292D] bg-red-100 rounded hover:bg-gray-300 transition"
                            >
                              <Image
                                src="/assets/SVG/icons/trash.svg"
                                alt="Delete"
                                width={16}
                                height={16}
                                className="cursor-pointer hover:opacity-80"
                              />
                            </button>
                          </div>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          </div>

          {/* Product Drawer */}
          <ProductDrawer
            isOpen={drawerOpen}
            onClose={closeDrawer}
            category={
              selectedCategory
                ? clothingItems.find((item) => item.id === selectedCategory)
                  ?.name || ""
                : ""
            }
            products={selectedProduct}
            selectedProduct={
              selectedCategory ? selectedProducts[selectedCategory] || null : null
            }
            priceType={priceType}
            selectedCategory={selectedCategory}
            onProductSelect={handleProductSelect}
          />
          <SidebarForm
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            getTotalPrice={getTotalPrice}
            priceType={priceType || ''}
          />
          <FooterLookBuilder />
        </>
      )}
    </div>
  );
};

export default LookBuilder;
