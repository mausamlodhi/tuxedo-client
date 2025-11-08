"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Image as AntdImage } from "antd";
import { ShirtCategoryServices } from "@/servivces/admin/category/shirt.service";
import modalNotification from "@/utils/notification";
import logger from "@/utils/logger";
import { CoatCategoryServices } from "@/servivces/admin/category/coat.service";
import { PantCategoryServices } from "@/servivces/admin/category/pant.service";
import { VestCategoryServices } from "@/servivces/admin/category/vest.service";
import { TieCategoryServices } from "@/servivces/admin/category/tie.service";
import { PocketSquareCategoryServices } from "@/servivces/admin/category/pocketSquare.service";
import { ShoeCategoryServices } from "@/servivces/admin/category/shoe.service";
import { StudsCufflinksCategoryServices } from "@/servivces/admin/category/jewelry.service";
import {
  COAT,
  FORMALWEAR,
  JEWEL,
  PANT,
  POCKET_SQUARE,
  SHIRT,
  SHOE,
  SOCKS,
  SUSPENDERS,
  TIE,
  VEST,
} from "@/utils/constant";
import { useRouter, useSearchParams } from "next/navigation";
import { CURRENCY } from "@/utils/env";
import { SuspendersCategoryServices } from "@/servivces/admin/category/suspenders.service";
import { SocksCategoryServices } from "@/servivces/admin/category/socks.service";
import { updateAllLayers } from "@/hooks/useLayers";
import { updateAllLayerInCategory } from "@/app/redux/slice/look-builder.slice";
import { useDispatch } from "react-redux";
import { FormalwearServices } from "@/servivces/admin/formalwear/formalwear.service"; 

const SuitetDetailComponent: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [details, setDetails] = useState(null);
  const [category, setCategory] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch();
  const suitProducts: SuiteProductInterface[] = [
    {
      id: "1",
      name: "Dominic by Ike Evening",
      brand: "Ike Evening",
      price: "$349.95",
      image: "/assets/images/image-03.png",
    },
    {
      id: "2",
      name: "Archer by Ike Evening",
      brand: "Ike Evening",
      price: "$349.95",
      image: "/assets/images/image-04.jpg",
    },
    {
      id: "3",
      name: "Dawson by Ike Evening",
      brand: "Ike Evening",
      price: "$349.95",
      image: "/assets/images/image-05.jpg",
    },
    {
      id: "4",
      name: "Lenox by Kenneth Cole",
      brand: "Kenneth Cole",
      price: "$329.95",
      image: "/assets/images/image-06.jpg",
    },
  ];
  const [images, setImages] = useState([]);
  const searchParams = useSearchParams();
  const productCategory = searchParams.get("category");
  const productId = parseInt(searchParams.get("id"));
  const priceType = searchParams.get("price_type");

  const handleCustomizeRental = async () => {
    const updateLayerData = [];
    let data = details;

    // For Formalwear, start with coat data
    if (productCategory === FORMALWEAR) {
      data = details?.coat;
      updateLayerData.push({
        category: "Coat",
        data: {
          details: data?.collections?.details,
          id: data?.id,
          rental_price: data?.rental_price,
          buy_price: data?.buy_price,
          images: data?.images,
          tie_type: data?.tie_type || "",
          description: data?.description,
        },
      });
    } else {
      updateLayerData.push({
        category: productCategory,
        data: {
          details: data?.collections?.details,
          id: data?.id,
          rental_price: data?.rental_price,
          buy_price: data?.buy_price,
          images: data?.images,
          tie_type: data?.tie_type || "",
          description: data?.description,
        },
      });
    }

    // Category mapping
    const categoryMap = {
      StudsCufflinks: "jewellery",
      Pant: ["pantSlimFit", "pantUltraSlimFit"],
      PocketSquare: "pocketsquare",
      Shirt: "shirt",
      Shoe: "shoe",
      Tie: "tie",
      Vest: "vest",
    };

    for (const [category, keys] of Object.entries(categoryMap)) {
      const sources = Array.isArray(keys) ? keys : [keys];
      let source = null;

      // Custom Pant logic
      if (category === "Pant") {
        source =
          data?.pantSlimFit && Object.keys(data.pantSlimFit).length
            ? data.pantSlimFit
            : data?.pantUltraSlimFit;
      } else {
        source =
          sources
            .map((key) => data?.[key])
            .find((item) => item && Object.keys(item || {}).length > 0) || null;
      }

      if (!source) continue;

      // For PocketSquare in rental, fallback to buy_price if rental_price is missing
      const rentalPrice =
        category === "PocketSquare" && !source?.rental_price
          ? source?.buy_price
          : source?.rental_price;

      updateLayerData.push({
        category,
        data: {
          details: source?.collections?.details,
          id: source?.id,
          rental_price: rentalPrice,
          buy_price: source?.buy_price,
          images: source?.images,
          tie_type: source?.tie_type || "",
          description: source?.description,
        },
      });
    }

    const layers = await updateAllLayers(updateLayerData);
    dispatch(updateAllLayerInCategory(layers));
    router.push(`/look-builder?price_type=${priceType}`);
  };
  const calculateTotal = (details, priceType = "rental_price") => {
    if (!details) return 0;

    const data = productCategory === FORMALWEAR ? details?.coat : details;
    if (!data) return 0;

    let total = parseFloat(data?.[priceType] || 0);

    const categoryMap = {
      StudsCufflinks: "jewellery",
      Pant: ["pantSlimFit", "pantUltraSlimFit"],
      PocketSquare: "pocketsquare",
      Shirt: "shirt",
      Shoe: "shoe",
      Tie: "tie",
      Vest: "vest",
    };

    for (const [category, keys] of Object.entries(categoryMap)) {
      const sources = Array.isArray(keys) ? keys : [keys];
      let source = null;

      // Pant logic
      if (category === "Pant") {
        source =
          data?.pantSlimFit && Object.keys(data.pantSlimFit).length
            ? data.pantSlimFit
            : data?.pantUltraSlimFit;
      } else {
        source =
          sources
            .map((key) => data?.[key])
            .find((item) => item && Object.keys(item || {}).length > 0) || null;
      }

      if (!source) continue;

      // PocketSquare fallback: if rental_price missing, use buy_price
      let price = source?.[priceType];
      if (
        category === "PocketSquare" &&
        priceType === "rental_price" &&
        !price
      ) {
        price = source?.buy_price;
      }

      if (price) {
        total += parseFloat(price);
      }
    }

    return total.toFixed(2);
  };

  const getShirtDetails = async () => {
    try {
      const response = await ShirtCategoryServices.shirtDetails(productId);
      if (response?.status) {
        setDetails(response?.data);
        setImages(response?.data?.images || []);
      } else {
        modalNotification({
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      logger("Error : ", error);
    }
  };

  const getCoatDetails = async () => {
    try {
      const response = await CoatCategoryServices.coatDetails(productId);
      if (response?.status) {
        setDetails(response?.data);
        setImages(response?.data?.images || []);
      } else {
        modalNotification({
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      logger("Error : ", error);
    }
  };

  const getPantDetails = async () => {
    try {
      const response = await PantCategoryServices.pantDetails(productId);
      if (response?.status) {
        setDetails(response?.data);
        setImages(response?.data?.images || []);
      } else {
        modalNotification({
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      logger("Error : ", error);
    }
  };

  const getVestDetails = async () => {
    try {
      const response = await VestCategoryServices.vestDetails(productId);
      if (response?.status) {
        setDetails(response?.data);
        setImages(response?.data?.images || []);
      } else {
        modalNotification({
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      logger("Error : ", error);
    }
  };

  const getTieDetails = async () => {
    try {
      const response = await TieCategoryServices.tieDetails(productId);
      if (response?.status) {
        setDetails(response?.data);
        setImages(response?.data?.images || []);
      } else {
        modalNotification({
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      logger("Error : ", error);
    }
  };

  const getPocketSquareDetails = async () => {
    try {
      const response = await PocketSquareCategoryServices.pocketSquareDetails(
        productId
      );
      if (response?.status) {
        setDetails(response?.data);
        setImages(response?.data?.images || []);
      } else {
        modalNotification({
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      logger("Error : ", error);
    }
  };

  const getShoeDetails = async () => {
    try {
      const response = await ShoeCategoryServices.shoeDetails(productId);
      if (response?.status) {
        setDetails(response?.data);
        setImages(response?.data?.images || []);
      } else {
        modalNotification({
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      logger("Error : ", error);
    }
  };

  const getJewelDetails = async () => {
    try {
      const response =
        await StudsCufflinksCategoryServices.studsCufflinksDetails(productId);
      if (response?.status) {
        setDetails(response?.data);
        setImages(response?.data?.images || []);
      } else {
        modalNotification({
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      logger("Error : ", error);
    }
  };

  const getSuspendersDetails = async () => {
    try {
      const response = await SuspendersCategoryServices.suspendersDetails(
        productId
      );
      if (response?.status) {
        setDetails(response?.data);
        setImages(response?.data?.images || []);
      } else {
        modalNotification({
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      logger("Error : ", error);
    }
  };

  const getSocksDetails = async () => {
    try {
      const response = await SocksCategoryServices.shocksDetails(productId);
      if (response?.status) {
        setDetails(response?.data);
        setImages(response?.data?.images || []);
      } else {
        modalNotification({
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      logger("Error : ", error);
    }
  };

  const getFormalwearDetails = async () => {
    try {
      const response = await FormalwearServices.FornalwearDetails(productId);
      if (response?.status) {
        setDetails(response?.data);
        setImages(response?.data?.coat?.images || []);
      } else {
        modalNotification({
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      logger("Error : ", error);
    }
  };

  useEffect(() => {
    switch (category) {
      case SHIRT:
        getShirtDetails();
        break;
      case COAT:
        getCoatDetails();
        break;
      case PANT:
        getPantDetails();
        break;
      case VEST:
        getVestDetails();
        break;
      case TIE:
        getTieDetails();
        break;
      case POCKET_SQUARE:
        getPocketSquareDetails();
        break;
      case SHOE:
        getShoeDetails();
        break;
      case JEWEL:
        getJewelDetails();
        break;
      case SUSPENDERS:
        getSuspendersDetails();
        break;
      case SOCKS:
        getSocksDetails();
        break;
      case FORMALWEAR:
        getFormalwearDetails();
        break;

      default:
        break;
    }
  }, [productId, category]);

  useEffect(() => {
    if (productCategory) {
      setCategory(productCategory);
    }
  }, [productCategory]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Grid Section */}
          {/* <div className="grid grid-cols-2 gap-4">
                        {productImages.map((image) => (
                            <div
                                key={image.id}
                                className="aspect-[3/4] bg-gray-100 overflow-hidden"
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={600}
                                    height={800}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div> */}

          <div className="flex gap-4">
            {/* Thumbnails on the left */}
            <div
              className={
                images?.length > 4
                  ? "grid grid-flow-row auto-rows-[6rem] gap-2 overflow-y-auto max-h-[600px]" // scrollable column
                  : "grid grid-rows-4 gap-2" // normal 4-row grid
              }
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-[6rem] aspect-[3/4] cursor-pointer border-2 ${
                    selectedImage === index
                      ? "border-[#D4B896]"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={image}
                    alt={image}
                    width={100}
                    height={133}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Main Selected Image on the right */}
            <div className="aspect-[3/4] bg-white overflow-hidden flex items-center justify-center">
              <AntdImage
                src={images[selectedImage]}
                alt={images[selectedImage]}
                width={600}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* <div className="flex flex-col space-y-4">
            Thumbnail Images
            <div
              className={
                details?.images.length > 4
                  ? "grid grid-flow-col auto-cols-[6rem] gap-2 overflow-x-auto max-w-[600px]" // scrollable row
                  : "grid grid-cols-4 gap-2" // normal 4-column grid
              }
            >
              {details?.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-full aspect-[3/4] cursor-pointer border-2 ${
                    selectedImage === index
                      ? "border-[#D4B896]"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={image}
                    alt={image}
                    width={100}
                    height={133}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
           

            Main Selected Image
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
              <AntdImage
                src={details?.images[selectedImage]}
                alt={details?.images[selectedImage]}
                width={600}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details Section (Unchanged) */}
          <div className="space-y-6">
            {/* Brand & Rating */}
            <div className="space-y-2">
              <p className="text-sm sm:text-base text-gray-600">
                {details?.style}
              </p>
              {/* <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">(4.5) 5265 Reviews</span>
                            </div> */}
              {/* Product Title */}
              {/* <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 leading-tight">
                {details?.description}
              </h1> */}

              {/* Product Description */}
              {/* <p className="text-sm text-advent sm:text-base text-gray-600 leading-relaxed">
                An updated tuxedo with modern silk notch lapels, silk trimmed
                pockets and a double button closure. Includes jacket with an
                option of slim or classic fit pants.
              </p> */}

              {/* Price & Customize Button */}
              <button
                className="bg-[#D6A680] cursor-pointer p-4 h-10 sm:p-6 flex items-center w-full justify-center"
                onClick={handleCustomizeRental}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                  <div className="text-center sm:text-left">
                    <p className="text-white text-sm sm:text-base font-medium mb-1">
                      {priceType === "buy_price"
                        ? "Customize to Buy"
                        : "Customize to Rental"}
                    </p>
                  </div>

                  <p className="text-white text-2xl sm:text-3xl font-bold text-center sm:text-right">
                    {CURRENCY} {calculateTotal(details, priceType)}
                  </p>
                </div>
              </button>

              {/* Includes Section */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <p className="text-sm sm:text-base text-[#000000] leading-relaxed">
                  Includes Jacket, Pants, Shirt, Vest, Neckwear
                </p>
              </div>

              {/* Details Section */}
              <div className="space-y-4">
                <h2 className="font-advent text-xl sm:text-2xl font-semibold text-gray-900">
                  Details
                </h2>

                <div className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: details?.detail }} />
                </div>

                {/* Features Grid */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    {leftFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm sm:text-base text-gray-600">
                          {feature.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {rightFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm sm:text-base text-gray-600">
                          {feature.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
              {/* Shipping Section */}
              {/* <div className="space-y-4">
                <h2 className="font-advent text-xl sm:text-2xl font-semibold text-gray-900">
                  Shipping
                </h2>

                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm sm:text-base text-gray-600">
                      Free shipping on orders over $300.
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm sm:text-base text-gray-600">
                      Arrives 10 days before your event.
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        {/* <CustomerReviewsSection /> */}
      </div>
      <section className="bg-[#BB9D7B] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
                <span className="w-6 sm:w-8 h-px bg-white"></span>
                <span className=" tracking-wider text-white font-medium">
                  Well Suited
                </span>
              </div>
              <h2 className="font-advent text-2xl sm:text-3xl font-semibold text-white">
                You may also like...
              </h2>
            </div>

            {/* Navigation Arrows */}
            <div className="flex space-x-2 self-start sm:self-auto">
              <button className="p-2 rounded-sm bg-white transition-shadow">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-sm bg-white transition-shadow">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {suitProducts.map((product, index) => (
              <div
                key={product.id}
                className="bg-[#BB9D7B] border border-[#DBB589] overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  {/* Brand overlay for Kenneth Cole */}
                  {product.brand === "Kenneth Cole" && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <span className="bg-black text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                        KENNETH COLE
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-advent font-semibold text-white mb-1 text-sm sm:text-base text-center">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FFFFFF] text-center">
                    Starts at {product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SuitetDetailComponent;
