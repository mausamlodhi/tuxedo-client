"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Product } from "@/components/productLookDrawer";
import Builder from "@/components/common/builderComponent";
import { flattenLayers, getLayerData, groupByCategory } from "@/utils";
import { hangerLayer } from "@/hooks/useLayers";
import { CURRENCY } from "@/utils/env";
import LookPreview from '@/components/lookPreview';
import { useSearchParams } from "next/navigation";
import logger from "@/utils/logger";
import { useDispatch, useSelector } from "react-redux";
import { getInvitedEventDetails, getSelectedOutfit, resetInvitedEvent } from "@/app/redux/slice/invited-event.slice";
import CheckoutSidebarComponent from "@/components/forms/checkoutSidebar";
import { UserAuthServices } from "@/servivces/user/auth.service";
import { selectUserData, updateEventData } from "@/app/redux/slice/auth.slice";

type ClothingItem = {
  id: string;
  name: string;
  icon: string;
  product?: any[];
  image?: string;
  lookPreviewClass?: string;
};

type SelectedProducts = Record<string, Product | null>;

const OutfitBuilder: React.FC = () => {
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const eventData = useSelector(getInvitedEventDetails);
  const lookBuilderRef = useRef<HTMLDivElement | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>(
    {}
  );
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [layerData, setLayerData] = useState(null);
  const [layers, setLayers] = useState(null);
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false)
  const [orderId,setOrderId] = useState<string>("");
  const [isOrderPlaced,setIsOrderPlaced] = useState<boolean>(false)
  const selectedOutfit = useSelector(getSelectedOutfit);
  const searchParams = useSearchParams();
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const priceType = searchParams.get("price_type");
  // let layers = flattenLayers(layerData);

  const handleGenerateLookBuilderData = async () => {
    try {
      const layerData = await getLayerData(selectedOutfit);
      setLayerData(layerData);

      let layers = flattenLayers(layerData);
      const hangerData = layerData["Pant"] || layerData["Socks"];
      if (hangerData && hangerData.length > 0) {
        layers = [
          hangerLayer,
          ...layers
        ]
      }
      setLayers(layers);
      logger("Logger : 50 :----- ", selectedOutfit, layerData, layers)
      // const outfitData = await groupByCategory([layerData]);
      // logger('Look builder data : ', outfitData)
    } catch (error) {
      logger('Getting an error while generating look builder data : ', error)
    }
  }

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

  const clothingItems: ClothingItem[] = [
    {
      id: "Coat",
      name: "Jacket",
      icon: "/assets/SVG/icons/new-coat.svg",
      product: layerData?.["Coat"] || [],
      image: "/assets/images/jacket.png",
      lookPreviewClass: "coat-preview"
    },
    {
      id: "Pant",
      name: "Pants",
      icon: "/assets/SVG/icons/pants.svg",
      product: layerData?.["Pant"] || [],
      image: "/assets/images/pant.png",
      lookPreviewClass: "pant-preview",
    },
    {
      id: "Shirt",
      name: "Shirt",
      icon: "/assets/SVG/icons/shirt.svg",
      product: layerData?.["Shirt"] || [],
      image: "/assets/images/shirt.png",
      lookPreviewClass: "shirt-preview"
    },
    {
      id: "Tie",
      name: "Tie",
      icon: "/assets/SVG/icons/tie.svg",
      product: layerData?.["Tie"] || [],
      image: "/assets/images/tie.png",
      lookPreviewClass: `${layerData?.["Tie"]?.[0]?.className}-preview`
    },
    {
      id: "Vest",
      name: "Vest & Cummerbund",
      icon: "/assets/SVG/icons/vest.svg",
      product: layerData?.["Vest"] || [],
      image: "/assets/images/vest.png",
      lookPreviewClass: "vest-preview"
    },
    {
      id: "PocketSquare",
      name: "Pocket Square",
      icon: "/assets/SVG/icons/pocket-square.svg",
      product: layerData?.["PocketSquare"] || [],
      image: "/assets/images/pocket_square.png",
      lookPreviewClass: "pocket-preview"
    },
    {
      id: "StudsCufflinks",
      name: "Studs & Cufflinks",
      icon: "/assets/SVG/icons/cufflink.svg",
      product: layerData?.["StudsCufflinks"] || [],
      image: "/assets/images/cufflinks.png",
      lookPreviewClass: "cufflink-preview"
    },
    {
      id: "Suspenders",
      name: "Suspenders",
      icon: "/assets/SVG/icons/belt.svg",
      product: layerData?.["Suspenders"] || [],
      image: "/assets/images/belt.png",
      lookPreviewClass: "suspenders-preview"
    },
    {
      id: "Shoe",
      name: "Shoes",
      icon: "/assets/SVG/icons/shoes.svg",
      product: layerData?.["Shoe"] || [],
      image: "/assets/images/shoeDummy.png",
      lookPreviewClass: "shoes-preview"
    },
    {
      id: "Socks",
      name: "Socks",
      icon: "/assets/SVG/icons/socks.svg",
      product: layerData?.["Socks"] || [],
      image: "/assets/images/socks.png",
      lookPreviewClass: "socks-preview"
    },
  ];

  const placedOrder = async (data: any) => {
    try {
      setIsLoading(true);
      const orderData = {
        userId: userData?.id,
        outfitId: selectedOutfit?.id,
        eventId: eventData?.id,
        store: data?.store || "",
        status: "Pending",
        deliveryDate: eventData?.eventDate || "",
        totalAmount: eventData?.outfits?.[0]?.totalAmount,
        isCheckout: true,
        customerName: `${selectedOutfit?.firstName} ${selectedOutfit?.lastName}`,
        email: selectedOutfit?.email||userData?.email,
      };
      const response = await UserAuthServices.handleCreateOrder(orderData);
      if (response?.status) {
        setOrderId(response?.data?.id);
        setIsOrderPlaced(true)
        dispatch(resetInvitedEvent());
      }
    } catch (error) {
      logger("error while placing an order : ", error);
    }
    setIsLoading(false)
  };

  useEffect(() => {
    handleGenerateLookBuilderData();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-advent">

      {showCustomizer ? (
        <LookPreview
          onBack={() => setShowCustomizer(false)}
          items={clothingItems}
          layerData={layerData}
          onSelectProduct={() => logger("On Select ")}
        />
      ) : (
        <>
          <div className="flex flex-col lg:flex-row lg:flex-1">
            {/* Left Side - Look Builder */}
            <div
              ref={lookBuilderRef}
              className="w-full lg:w-1/2 bg-[#FFFFFF] relative flex flex-col lg:h-[calc(100vh-60px)] lg:overflow-y-auto"
            >
              <div style={{ height: '500px' }} className="overflow-hidden">
                <div className="flex items-center justify-center mt-4 gap-2 px-2 sm:px-4">
                  <button
                    className="flex items-center justify-center text-black bg-white hover:bg-gray-100 px-4 py-2 font-advent border border-gray-300 w-full sm:w-auto cursor-pointer"
                    onClick={() => logger("Show customizer")}
                  >
                    Customize
                  </button>
                </div>

                <div className="flex items-center justify-center p-8 ">
                  <div className="relative max-w-xs sm:max-w-md md:max-w-lg aspect-[3/5] bg-white flex items-center justify-center min-h-[400px]">
                    {layers?.length <= 0 ? (
                      <Image
                        src="/assets/suitframe.svg"
                        alt="Suit Frame"
                        width={300}
                        height={400}
                        className="object-contain cursor-pointer"
                        style={{ marginBottom: '100px' }}
                      // onClick={() => setShowCustomizer(true)}
                      />
                    ) : <Builder
                      layers={layers}
                      setShowCustomizer={() => logger("customizer")}
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
            <div className="w-full lg:w-1/2 bg-white relative">
              {/* Header */}

              {/* Content */}
              <div className="p-6 flex-1 overflow-y-auto lg:max-h-[calc(120vh-240px)] max-lg:pb-20">
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    {/* Left side: Label */}
                    <div className="text-xl font-bold font-advent text-gray-800">
                      YOUR LOOK
                    </div>

                    {/* Right side: Total Price */}
                    <div className="text-xl font-bold font-advent text-black">
                      Total&nbsp;
                      {CURRENCY} {selectedOutfit?.totalAmount}
                    </div>
                  </div>
                </div>


                {/* Product List */}
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
                      >
                        {/* Left side: Icon */}
                        <div className="flex items-center space-x-3">
                          <Image
                            src={product ? product.image : item.icon}
                            alt={product ? product.name : item.name}
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="flex items-center ml-auto space-x-4">
                          <span className="text-xs text-gray-500 mt-1 max-w-[220px] line-clamp-2">
                            {item?.product?.[0]?.description?.slice(0, 50) || ""}
                          </span>
                          <span className="text-sm text-gray-700 font-medium">
                            {item?.product?.length ? item?.product?.[0]?.title : ""}
                          </span>
                          <span className="text-sm font-semibold text-black">
                            {(() => {
                              const p = item?.product?.[0];
                              if (!p) return null;
                              if (["PocketSquare", "Suspenders", "Socks"].includes(item.id)) {
                                return `Buy Price : ${CURRENCY}${p.buy_price || 0}`;
                              }
                              if (priceType === "buy_price") {
                                return `Buy Price : ${CURRENCY}${p.buy_price || 0}`;
                              }
                              return `Rental Price : ${CURRENCY}${p.rental_price || 0}`;
                            })()}
                          </span>
                        </div>

                        {/* Arrow */}
                        {item?.product?.length ? (
                          <div className="flex space-x-2 ms-4"></div>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-2">
                <button
                  className="bg-[#2D333C] text-white px-6 py-2  hover:bg-[#484e57] transition font-advent cursor-pointer"
                  onClick={() => setIsOpen(true)}
                >
                  Proceed to Checkout
                </button>
                <button
                  className="bg-white text-gray-700 px-6 py-2 border border-black hover:bg-gray-200 transition font-advent cursor-pointer"
                  onClick={() => console.log("Cancelled")}
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </>
      )}
      <CheckoutSidebarComponent
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={placedOrder}
        isOrderPlaced={isOrderPlaced}
        setIsOrderPlaced={setIsOrderPlaced}
        orderId={orderId}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OutfitBuilder;
