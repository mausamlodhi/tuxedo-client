"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuthData } from "@/app/redux/slice/auth.slice";
import { CURRENCY } from "@/utils/env";
import { getColorCode } from "@/utils";
import { TieCategoryServices } from "@/servivces/admin/category/tie.service";
import logger from "@/utils/logger";

interface DetailField {
  label: string;
  value: string | number | JSX.Element;
  type?: "text" | "color" | "image";
}

interface UniversalDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: any) => void;
  onDelete: (id: number) => void;
  data: any;
  category: string;
  title?: string;
  theme?: boolean | object;
  displayTitle: string;
}

interface RelatedItem {
  category: string;
  data: any;
}

function formatTieDetails(ids: string[] | number[], list: any[]) {
  if (!ids?.length || !list?.length) return ["N/A"];

  return ids.map((id) => {
    const tie = list.find((t) => String(t.id) === String(id));
    return tie ? `${tie.style} - ${tie.description}` : String(id);
  });
}

const getCategoryFieldMappings = (bowTies: any[], neckTies: any[]) => ({
  coat: (data) => [
    {
      label: "Buy Price",
      value: data?.buy_price ? `${CURRENCY} ${data?.buy_price}` : "N/A",
    },
    {
      label: "Rental Price",
      value: data?.rental_price ? `${CURRENCY} ${data?.rental_price}` : "N/A",
    },
    {
      label: "Color",
      value: data?.colors?.name ? (
        <div className="flex items-center gap-2">
          <span
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: getColorCode(data?.colors?.name),
              display: "inline-block",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <span>{data?.colors?.name}</span>
        </div>
      ) : (
        "N/A"
      ),
    },

    {
      label: "Pant Slim Fit",
      value: data?.pantSlimFit
        ? `${data?.pantSlimFit?.style || "N/A"} - ${
            data?.pantSlimFit?.description || "N/A"
          }`
        : "N/A",
    },
    {
      label: "Pant Ultra Slim Fit",
      value: data?.pantUltraSlimFit
        ? `${data?.pantUltraSlimFit?.style || "N/A"} - ${
            data?.pantUltraSlimFit?.description || "N/A"
          }`
        : "N/A",
    },

    {
      label: "Matching Shirt",
      value: data?.shirt
        ? `${data?.shirt?.style || "N/A"} - ${
            data?.shirt?.description || "N/A"
          }`
        : "N/A",
    },
    {
      label: "Matching Vest",
      value: data?.vest
        ? `${data?.vest?.style || "N/A"} - ${data?.vest?.description || "N/A"}`
        : "N/A",
    },
    {
      label: "Matching Shoe",
      value: data?.shoe
        ? `${data?.shoe?.style || "N/A"} - ${data?.shoe?.description || "N/A"}`
        : "N/A",
    },
    {
      label: "Matching Tie",
      value: data?.tie
        ? `${data?.tie?.style || "N/A"} - ${data?.tie?.description || "N/A"}`
        : "N/A",
    },
    {
      label: "Pocket Square",
      value: data?.pocketsquare
        ? `${data?.pocketsquare?.style || "N/A"} - ${
            data?.pocketsquare?.description || "N/A"
          }`
        : "N/A",
    },
    {
      label: "Studs & Cufflinks",
      value: data?.jewellery
        ? `${data?.jewellery?.style || "N/A"} - ${
            data?.jewellery?.description || "N/A"
          }`
        : "N/A",
    },
    {
      label: "Details",
      value: data?.detail ? (
        <div dangerouslySetInnerHTML={{ __html: data.detail }} />
      ) : (
        "N/A"
      ),
    },
  ],

  pant: (data) => [
    {
      label: "Buy Price",
      value: data?.buy_price ? `${CURRENCY} ${data?.buy_price}` : "N/A",
    },
    {
      label: "Rental Price",
      value: data?.rental_price ? `${CURRENCY} ${data?.rental_price}` : "N/A",
    },
    {
      label: "Color",
      value: data?.colors?.name ? (
        <div className="flex items-center gap-2">
          <span
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: getColorCode(data?.colors?.name),
              display: "inline-block",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <span>{data?.colors?.name}</span>
        </div>
      ) : (
        "N/A"
      ),
    },
    {
      label: "Pant Type",
      value: data?.description
        ? `${data?.style || "N/A"} - ${data?.description || "N/A"}`
        : "N/A",
    },
    // { label: 'Pant Slim Fit', value: data?.slim_fit ? 'Yes' : 'No' },
    // { label: 'Pant Ultra Slim Fit', value: data?.ultra_slim_fit ? 'Yes' : 'No' },
    {
      label: "Details",
      value: data?.detail ? (
        <div dangerouslySetInnerHTML={{ __html: data.detail }} />
      ) : (
        "N/A"
      ),
    },
  ],
  shirt: (data) => [
    {
      label: "Buy Price",
      value: data?.buy_price ? `${CURRENCY} ${data?.buy_price}` : "N/A",
    },
    {
      label: "Rental Price",
      value: data?.rental_price ? `${CURRENCY} ${data?.rental_price}` : "N/A",
    },
    {
      label: "Color",
      value: data?.colors?.name ? (
        <div className="flex items-center gap-2">
          <span
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: getColorCode(data?.colors?.name),
              display: "inline-block",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <span>{data?.colors?.name}</span>
        </div>
      ) : (
        "N/A"
      ),
    },
    {
      label: "Shirt Type",
      value: data?.description
        ? `${data?.style || "N/A"} - ${data?.description || "N/A"}`
        : "N/A",
    },
    {
      label: "Details",
      value: data?.detail ? (
        <div dangerouslySetInnerHTML={{ __html: data.detail }} />
      ) : (
        "N/A"
      ),
    },
  ],
  vest: (data) => {
    return [
      {
        label: "Buy Price",
        value: data?.buy_price ? `${CURRENCY} ${data?.buy_price}` : "N/A",
      },
      {
        label: "Rental Price",
        value: data?.rental_price ? `${CURRENCY} ${data?.rental_price}` : "N/A",
      },
      {
        label: "Color",
        value: data?.colors?.name ? (
          <div className="flex items-center gap-2">
            <span
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: getColorCode(data?.colors?.name),
                display: "inline-block",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <span>{data?.colors?.name}</span>
          </div>
        ) : (
          "N/A"
        ),
      },
      {
        label: "Vest Type",
        value: data?.description
          ? `${data?.style || "N/A"} - ${data?.description || "N/A"}`
          : "N/A",
      },
      {
        label: "Bow Tie",
        value: (
          <div className="flex flex-col gap-1">
            {formatTieDetails(data?.bow_tie || [], bowTies).map((item, idx) => (
              <span key={idx}>{item}</span>
            ))}
          </div>
        ),
      },
      {
        label: "Neck Tie",
        value: (
          <div className="flex flex-col gap-1">
            {formatTieDetails(data?.neck_tie || [], neckTies).map(
              (item, idx) => (
                <span key={idx}>{item}</span>
              )
            )}
          </div>
        ),
      },
      {
        label: "Details",
        value: data?.detail ? (
          <div dangerouslySetInnerHTML={{ __html: data.detail }} />
        ) : (
          "N/A"
        ),
      },
    ];
  },

  tie: (data) => [
    {
      label: "Buy Price",
      value: data?.buy_price ? `${CURRENCY} ${data?.buy_price}` : "N/A",
    },
    {
      label: "Rental Price",
      value: data?.rental_price ? `${CURRENCY} ${data?.rental_price}` : "N/A",
    },
    {
      label: "Color",
      value: data?.colors?.name ? (
        <div className="flex items-center gap-2">
          <span
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: getColorCode(data?.colors?.name),
              display: "inline-block",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <span>{data?.colors?.name}</span>
        </div>
      ) : (
        "N/A"
      ),
    },
    {
      label: "Tie Type",
      value: data?.description
        ? `${data?.style || "N/A"} - ${data?.description || "N/A"}`
        : "N/A",
    },
    {
      label: "Matching Pocket Square",
      value: data?.pocketsquare
        ? `${data?.pocketsquare?.style || "N/A"} - ${
            data?.pocketsquare?.description || "N/A"
          }`
        : "N/A",
    },
    {
      label: "Details",
      value: data?.detail ? (
        <div dangerouslySetInnerHTML={{ __html: data.detail }} />
      ) : (
        "N/A"
      ),
    },
  ],
  "pocket-square": (data) => [
    {
      label: "Buy Price",
      value: data?.buy_price ? `${CURRENCY} ${data?.buy_price}` : "N/A",
    },

    {
      label: "Pocket Square Type",
      value: data?.description
        ? `${data?.style || "N/A"} - ${data?.description || "N/A"}`
        : "N/A",
    },
    {
      label: "Details",
      value: data?.detail ? (
        <div dangerouslySetInnerHTML={{ __html: data.detail }} />
      ) : (
        "N/A"
      ),
    },
  ],
  shoe: (data) => [
    {
      label: "Buy Price",
      value: data?.buy_price ? `${CURRENCY} ${data?.buy_price}` : "N/A",
    },
    {
      label: "Rental Price",
      value: data?.rental_price ? `${CURRENCY} ${data?.rental_price}` : "N/A",
    },
    {
      label: "Color",
      value: data?.colors?.name ? (
        <div className="flex items-center gap-2">
          <span
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: getColorCode(data?.colors?.name),
              display: "inline-block",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <span>{data?.colors?.name}</span>
        </div>
      ) : (
        "N/A"
      ),
    },
    {
      label: "Shoe Type",
      value: data?.description
        ? `${data?.style || "N/A"} - ${data?.description || "N/A"}`
        : "N/A",
    },
    {
      label: "Details",
      value: data?.detail ? (
        <div dangerouslySetInnerHTML={{ __html: data.detail }} />
      ) : (
        "N/A"
      ),
    },
  ],

  studsCufflinks: (data) => [
    {
      label: "Buy Price",
      value: data?.buy_price ? `${CURRENCY} ${data?.buy_price}` : "N/A",
    },
    {
      label: "Rental Price",
      value: data?.rental_price ? `${CURRENCY} ${data?.rental_price}` : "N/A",
    },
    {
      label: "Details",
      value: data?.detail ? (
        <div dangerouslySetInnerHTML={{ __html: data.detail }} />
      ) : (
        "N/A"
      ),
    },
  ],
  shocks: (data) => [
    {
      label: "Buy Price",
      value: data?.buy_price ? `${CURRENCY} ${data?.buy_price}` : "N/A",
    },

    {
      label: "Details",
      value: data?.detail ? (
        <div dangerouslySetInnerHTML={{ __html: data.detail }} />
      ) : (
        "N/A"
      ),
    },
  ],
  suspenders: (data) => [
    {
      label: "Buy Price",
      value: data?.buy_price ? `${CURRENCY} ${data?.buy_price}` : "N/A",
    },

    {
      label: "Details",
      value: data?.detail ? (
        <div dangerouslySetInnerHTML={{ __html: data.detail }} />
      ) : (
        "N/A"
      ),
    },
  ],
  "Best Selling Product": (data) => [
    {
      label: "Title",
       value: data?.title  || "N/A",  
    },

    {
      label: "Buy Price",
      value: data?.buy_price ? `${CURRENCY} ${data?.buy_price}` : "N/A",
    },
    {
      label: "Rental Price",
      value: data?.rental_price ? `${CURRENCY} ${data?.rental_price}` : "N/A",
    },
    
  ],
});

const UniversalDetailPopup: React.FC<UniversalDetailPopupProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  data,
  category,
  title,
  theme,
  displayTitle,
}) => {
  const authData = useSelector(selectAuthData);
  const [relatedItem, setRelatedItem] = useState<RelatedItem | null>(null);
  const [popupPos, setPopupPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [bowTies, setBowTies] = useState<any[]>([]);
  const [neckTies, setNeckTies] = useState<any[]>([]);
  const fetchTieDetails = async () => {
    try {
      // Bow Ties
      const bowTieRes = await TieCategoryServices.getTieList({
        search: "bow",
        limit: 100,
        offset: 0,
      });

      if (bowTieRes?.status) {
        setBowTies(bowTieRes.results || []);
      }

      // Neck Ties
      const neckTieRes = await TieCategoryServices.getTieList({
        search: "neck",
        limit: 100,
        offset: 0,
      });

      if (neckTieRes?.status) {
        setNeckTies(neckTieRes.results || []);
      }
    } catch (error) {
      logger("Error fetching tie details:", error);
    }
  };

  useEffect(() => {
    if (category === "vest") fetchTieDetails();
  }, [category, data]);

  const popupContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.innerWidth < 640 && popupContainerRef.current) {
      const container = popupContainerRef.current;
      const handleScroll = () => {
        setRelatedItem(null);
        setPopupPos(null);
      };
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [isOpen]);
  if (!isOpen || !data) return null;
  const handleRelatedClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    label: string,
    key: string
  ) => {
    if (!data[key]) return;
    if (
      relatedItem?.category === label.replace("Matching ", "").toLowerCase()
    ) {
      setRelatedItem(null);
      setPopupPos(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPos({ top: rect.top + window.scrollY, left: rect.right + 10 });
    setRelatedItem({
      category: label.replace("Matching ", "").toLowerCase(),
      data: data[key],
    });
  };
  const labelToDataKey: Record<string, string> = {
    "Pant Slim Fit": "pantSlimFit",
    "Pant Ultra Slim Fit": "pantUltraSlimFit",
    "Matching Shirt": "shirt",
    "Matching Vest": "vest",
    "Matching Shoe": "shoe",
    "Matching Tie": "tie",
    "Pocket Square": "pocketsquare",
    Jewel: "jewellery",
    "Matching Pocket Square": "pocketsquare",
  };
  const handleEdit = () => {
    onEdit(data);
    onClose();
  };
  const handleDelete = () => {
    onDelete(data.id);
    onClose();
  };

  const getFields = (): DetailField[] => {
    const mapper = getCategoryFieldMappings(bowTies, neckTies)[category];
    return mapper ? mapper(data) : [];
  };

  const fields = getCategoryFieldMappings(bowTies, neckTies)[category]
    ? getCategoryFieldMappings(bowTies, neckTies)[category](data)
    : [];
  // const displayTitle = title || `${category.charAt(0).toUpperCase() + category.slice(1)} Detail`
  const getImageUrl = () => {
    if (data.image) return data.image;
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      return data.images[0];
    }
    if (data.images && typeof data.images === "string") return data.images;
    return "/api/placeholder/176/240";
  };
  const imageUrl = getImageUrl();

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={popupContainerRef}
        className={`${
          theme ? "bg-white text-slate-800" : "bg-slate-800 text-white"
        } rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-600">
          <h2 className="text-lg sm:text-xl font-semibold">{displayTitle}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
            aria-label="Close popup"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row p-4 sm:p-6 gap-6">
          {/* Image Section */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div
              className={`w-48 h-64 sm:w-64 sm:h-80 rounded-lg overflow-hidden ${
                theme
                  ? "bg-[#F4F5F7] text-slate-800"
                  : "bg-slate-800 text-white"
              }`}
            >
               <Image
      src={
        category === "Best Selling Product" && data?.coat?.images?.length > 0
          ? data.coat.images[0] 
          : imageUrl 
      }
      alt={data?.description || data?.style || "Product image"}
      width={256}
      height={320}
      className="w-full h-full object-cover"
      priority
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "/api/placeholder/256/320";
      }}
    />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <div className="text-xs sm:text-sm text-slate-400 mb-1">
                {data?.style?.split(" ").slice(-1)[0] || "MOD"}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold leading-tight mb-4">
                {data?.description || data?.name || `${category} Item`}
              </h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {fields.map((field, index) => {
                const clickableLabels = [
                  "Pant Slim Fit",
                  "Pant Ultra Slim Fit",
                  "Matching Shirt",
                  "Matching Vest",
                  "Matching Shoe",
                  "Matching Tie",
                  "Pocket Square",
                  "Jewel",
                  "Matching Pocket Square",
                ];
                if (field.label === "Slim Fit") {
                  const ultraSlim = fields.find(
                    (f) => f.label === "Ultra Slim Fit"
                  );
                  return (
                    <div key={index} className="flex gap-8">
                      <span
                        className={`${
                          theme ? "text-slate-700" : "text-slate-300"
                        } font-bold w-32`}
                      >
                        Slim Fit
                      </span>
                      <span
                        className={`${theme ? "text-black" : "text-white"}`}
                      >
                        {field.value}
                      </span>

                      <span
                        className={`${
                          theme ? "text-slate-700" : "text-slate-300"
                        } font-bold w-32`}
                      >
                        Ultra Slim Fit
                      </span>
                      <span
                        className={`${theme ? "text-black" : "text-white"}`}
                      >
                        {ultraSlim?.value || "N/A"}
                      </span>
                    </div>
                  );
                }
                if (field.label === "Ultra Slim Fit") return null;
                // Handle truncation + tooltip
                const displayValue =
                  typeof field.value === "string" && field.value.length > 30
                    ? field.value.slice(0, 30) + "..."
                    : field.value;

                return (
                  <React.Fragment key={index}>
                    <div className="flex gap-16 items-start">
                      <span
                        className={`${
                          theme ? "text-slate-700" : "text-slate-300"
                        } font-bold w-32`}
                      >
                        {field.label}
                      </span>

                      {/* Value with tooltip */}
                      <div className="relative group flex-1">
                        {/* <span className={`${theme ? "text-slate-700" : "text-slate-300"} font-bold w-32`}>{field.label}</span> */}
                        <span
                          className={`${
                            clickableLabels.includes(field.label) &&
                            field.value !== "N/A"
                              ? "cursor-pointer"
                              : ""
                          }`}
                          onClick={(e) => {
                            const key = labelToDataKey[field.label];
                            if (clickableLabels.includes(field.label) && key) {
                              handleRelatedClick(e, field.label, key);
                            }
                          }}
                        >
                          {field.value}
                        </span>
                        {/* Tooltip (only if text is long) */}
                        {typeof field.value === "string" &&
                          field.value.length > 30 && (
                            <div
                              className={`absolute left-0 top-full mt-1 hidden group-hover:block ${
                                theme
                                  ? "bg-gray-800 text-white"
                                  : "bg-white text-gray-800"
                              }  text-xs rounded-md px-2 py-1 whitespace-pre-wrap z-10 w-max max-w-xs shadow-lg`}
                            >
                              <span
                                className="block cursor-pointer"
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    String(field.value)
                                  )
                                }
                              >
                                {field.value}
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                    {/* Divider after Color */}
                    {field.label === "Color" && (
                      <div className="border-t border-dotted border-slate-500 my-3"></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {relatedItem && popupPos && (
              <div
                className={`absolute z-100 max-w-[90vw] sm:max-w-xs w-auto h-auto p-4 rounded-lg 
    ${theme ? "bg-white text-slate-800" : "bg-gray-800 text-white"}`}
                style={{
                  top:
                    window.innerWidth < 640
                      ? popupPos.top - 70
                      : popupPos.top - 70,
                  left:
                    window.innerWidth < 640
                      ? 10
                      : Math.min(popupPos.left, window.innerWidth - 280),
                }}
              >
                {/* Arrow */}
                {window.innerWidth >= 640 && (
                  <div
                    className={`absolute -left-2 top-0 w-3 h-3 rotate-360 
        ${
          theme
            ? "bg-white border-l border-t border-gray-300"
            : "bg-gray-800 border-l border-t border-gray-700"
        }`}
                  ></div>
                )}

                <h4 className="font-semibold mb-2 capitalize break-words">
                  Matching {relatedItem.category}
                </h4>

                {relatedItem.data?.images &&
                relatedItem.data.images.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {relatedItem.data.images.map(
                      (img: string, index: number) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Related ${relatedItem.category} ${index + 1}`}
                          className="w-16 h-16 rounded-md border object-cover"
                        />
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm">No Image Available</p>
                )}

                <p className="text-sm break-words">
                  <span className="font-medium">Style:</span>{" "}
                  {relatedItem.data?.style || "N/A"}
                </p>
                <p className="text-sm break-words">
                  <span className="font-medium">Description:</span>{" "}
                  {relatedItem.data?.description || "N/A"}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-12">
              <button
                onClick={handleEdit}
                className={`flex-1 ${
                  theme
                    ? "bg-white text-blue-800 border border-blue-700 hover:bg-blue-600 hover:text-white"
                    : "bg-white text-slate-700 hover:bg-slate-200"
                } font-semibold cursor-pointer py-3 px-6 rounded-lg transition-colors`}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className={`flex-1 ${
                  theme
                    ? "bg-white text-red-700 border border-red-600 hover:text-white hover:bg-red-700"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                } font-semibold cursor-pointer py-3 px-6 rounded-lg transition-colors`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalDetailPopup;
