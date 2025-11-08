// app/all-rental/page.tsx (assuming using App Router)
"use client";

import Image from "next/image";
import { JSX, useEffect, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import modalNotification from "@/utils/notification";
import logger from "@/utils/logger";
import { ShirtCategoryServices } from "@/servivces/admin/category/shirt.service";
import { CoatCategoryServices } from "@/servivces/admin/category/coat.service";
import { PantCategoryServices } from "@/servivces/admin/category/pant.service";
import { TieCategoryServices } from "@/servivces/admin/category/tie.service";
import { PocketSquareCategoryServices } from "@/servivces/admin/category/pocketSquare.service";
import { ShoeCategoryServices } from "@/servivces/admin/category/shoe.service";
import { StudsCufflinksCategoryServices } from "@/servivces/admin/category/jewelry.service";
import useDebounce from "@/utils/debounce";
import { SocksCategoryServices } from "@/servivces/admin/category/socks.service";
import SuspendersCategory from "@/apiEndPoints/admin/suspenders.category";
import { VestCategoryServices } from "@/servivces/admin/category/vest.service";
import { SuspendersCategoryServices } from "@/servivces/admin/category/suspenders.service";
import { log } from "node:console";

type FilterOption = {
  name: string;
  checked?: boolean;
};

// TypeScript interfaces
interface FilterState {
  [key: string]: string | null;
}

interface CategoryFilters {
  categories: string[];
  colors: string[];
}

interface ExpandedState {
  [key: string]: boolean;
}

const categoryServices: Record<string, any> = {
  Coat: CoatCategoryServices,
  Pant: PantCategoryServices,
  Shirt: ShirtCategoryServices,
  "Vest & Cummerbund": VestCategoryServices,
  Tie: TieCategoryServices,
  "Pocket Square": PocketSquareCategoryServices,
  "Studs & Cufflinks": StudsCufflinksCategoryServices,
  Suspenders: SuspendersCategoryServices,
  Shoe: ShoeCategoryServices,
  Socks: SocksCategoryServices,
};

const categoryFilters = {
  categories: Object.keys(categoryServices),
  colors: [
    "Beige",
    "Black",
    "Brown",
    "Gray",
    "White",
    "Tan",
    "Blue",
    "Green",
    "Burgundy",
  ],
};

const AllRentalComponent = (): JSX.Element => {

  const categoryFilters = {
    categories: [
      "Coat",
      "Pant",
      "Shirt",
      "Vest & Cummerbund",
      "Tie",
      "Pocket Square",
      "Studs & Cufflinks",
      "Suspenders",
      "Shoe",
      "Socks",
    ] as const,
    colors: [
      "Beige",
      "Black",
      "Brown",
      "Gray",
      "White",
      "Tan",
      "Blue",
      "Green",
      "Burgundy",
    ] as const,
  };

  type Category = (typeof categoryFilters.categories)[number];
  type Color = (typeof categoryFilters.colors)[number];
  const productSearch = useDebounce((val: string) => getAllProducts(), 800);
  const colorMap: Record<Color, string> = {
    Beige: "#F5F5DC",
    Black: "#000000",
    Brown: "#8B4513",
    Gray: "#808080",
    White: "#FFFFFF",
    Tan: "#D2B48C",
    Blue: "#4169E1",
    Green: "#228B22",
    Burgundy: "#800020",
  };

  const categoryIcons: Record<Category, any> = {
    Coat: "/assets/SVG/icons/new-coat.svg",
    Pant: "/assets/SVG/icons/pants.svg",
    Tie: "/assets/SVG/icons/tie.svg",
    "Pocket Square": "/assets/SVG/icons/pocket-square.svg",
    "Vest & Cummerbund": "/assets/SVG/icons/vest.svg",
    Shirt: "/assets/SVG/icons/shirt.svg",
    "Studs & Cufflinks": "/assets/SVG/icons/cufflink.svg",
    Suspenders: "/assets/SVG/icons/belt.svg",
    Shoe: "/assets/SVG/icons/shoes.svg",
    Socks: "/assets/SVG/icons/socks.svg",
  };
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [sort, setSort] = useState("Default Sorting");
  const searchParams = useSearchParams();
  const priceType = searchParams.get("price_type");
  //  const category = searchParams.get("category");
  // const color = searchParams.get("color");

  const categoryParam = searchParams.get("category");
  const colorParam = searchParams.get("color");
  const priceTypeParam = searchParams.get("price_type");




  const [expanded, setExpanded] = useState<ExpandedState>({
    categories: true,
    colors: true,
  });
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({
    categories: [],
    colors: [],
  });
  const toggleExpand = (section: string) =>
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleAddFilter = (filter: string) =>
    setFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );

  const clearFilters = () => {
    setSelectedFilters({ categories: [], colors: [] });
    setFilters([]);
    getAllProducts();
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const removeFilter = (filter: string) => {
    setSelectedFilters((prev) => {
      // remove from categories
      const updatedCategories = prev.categories.filter((f) => f !== filter);
      // remove from colors
      const updatedColors = prev.colors.filter((f) => f !== filter);

      const newFilters = {
        categories: updatedCategories,
        colors: updatedColors,
      };

      // sync flat filters
      setFilters([...newFilters.categories, ...newFilters.colors]);

      return newFilters;
    });
  };

  const handleToggleFilter = (section: string, option: string) => {
    if(option===categoryParam){
      router.replace('/all-rental?price_type='+priceType);
    }
    setSelectedFilters((prev) => {
      const currentSelection = prev[section] || [];
      let updated;

      if (currentSelection.includes(option)) {
        updated = currentSelection.filter((f) => f !== option);
      } else {
        updated = [...currentSelection, option];
      }

      const newFilters = {
        ...prev,
        [section]: updated,
      };

      // sync flat filters for top bar
      setFilters([...newFilters.categories, ...newFilters.colors]);

      return newFilters;
    });
  };

  const isSelected = (section: string, option: string): boolean => {
    return selectedFilters[section]?.includes(option) || false;
  };

  const formatSectionTitle = (section: string): string => {
    return section.charAt(0).toUpperCase() + section.slice(1);
  };

  const getAllProducts = async () => {
    try {
      setLoading(true);
      setProducts([]);
      const queryParams = { limit: 30, page: 1, price_type: priceType };
      const responses = await Promise.all(
        Object.entries(categoryServices).map(async ([category, service]) => {
          try {
            const response = await service[
              `get${category.replace(/\s/g, "")}List`
            ](queryParams);
            return response?.status ? response.results : [];
          } catch (err) {
            logger(`Error fetching ${category}:`, err);
            return [];
          }
        })
      );

      const combined = shuffleArray(responses.flat());
      setProducts(combined);
    } catch (err) {
      logger("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = async (filters: any) => {
    try {
      setProducts([]);
      setLoading(true);
      const queryParams = {
        limit: 30,
        page: 1,
        colors: filters.colors,
        price_type: priceType
      };
      const responses = await Promise.all(
        filters.categories.map(async (category) => {
          const service = categoryServices[category];

          if (!service) return [];

          try {
            const methodName = `get${category.replace(/\s/g, "")}List`;
            const response = await service[methodName](queryParams);

            return response?.status ? response.results : [];
          } catch (err) {
            logger(`Error fetching ${category}:`, err);
            return [];
          }
        })
      );
      const combined = shuffleArray(responses.flat());

      if (combined.length === 0) {
        logger("No products found", combined);
        setProducts([]);
      } else {
        setProducts(combined);
      }
    } catch (err) {
      logger("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryParam ) {
      const newSelectedFilters = {
        categories: [...new Set([categoryParam, ...selectedFilters.categories])],
        colors: [...new Set([colorParam, ...selectedFilters.colors])],
      };
      getFilteredProducts(newSelectedFilters);
      return;
    }
    if (
      selectedFilters.categories.length === 0 &&
      selectedFilters.colors.length === 0
    ) {
      getAllProducts();
    } else if (selectedFilters.categories.length === 0 &&
      selectedFilters.colors.length > 0 || colorParam) {
      getFilteredProducts({
        categories: Object.keys(categoryServices),
        colors: selectedFilters.colors,
      });
    } else {
      const newSelectedFilters = {
        categories: [... new Set([categoryParam, ...selectedFilters.categories])],
        colors: [... new Set([colorParam, ...selectedFilters.colors])]
      };
      getFilteredProducts(newSelectedFilters);
    }
  }, [selectedFilters, colorParam, categoryParam, priceTypeParam]);

  useEffect(() => {
    if (categoryParam || colorParam || priceTypeParam) {
      const newSelectedFilters = {
        categories: categoryParam ? [categoryParam] : [],
        colors: colorParam ? [colorParam] : [],
      };
      setSelectedFilters(newSelectedFilters);
      setFilters([...newSelectedFilters.categories, ...newSelectedFilters.colors]);
      // getFilteredProducts({
      //   categories: newSelectedFilters.categories,
      //   colors: newSelectedFilters.colors,
      // });
    } else {
      setSelectedFilters({ categories: [], colors: [] });
      setFilters([]);
      // getAllProducts();
    }
  }, [categoryParam, colorParam, priceTypeParam]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      {/* <h2 className="text-xl font-semibold">ALL RENTAL</h2> */}
      <p className="text-sm text-gray-700 my-2">
        Explore our complete rental collection of premium men's formal wear and
        accessories. From stylish suits and tuxedos to elegant shirts, shoes,
        and accessories, find everything you need to create the perfect look for
        any occasion. Discover the quality and style that sets The Black Tux
        apart.
      </p>
      <br />
      <div className="flex items-center justify-between px-2 md:px-0 text-sm md:text-base font-light">
        {/* Left Section */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">
            Filter & Sort {products?.length} Items
          </span>
          {filters.length > 0 && (
            <>
              <button
                onClick={clearFilters}
                className="text-xs font-advent px-2 py-1 bg-gray-100 border rounded-sm hover:bg-gray-200 cursor-pointer"
              >
                CLEAR ALL
              </button>
              {filters.map((filter) => (
                <span
                  key={filter}
                  className="flex items-center bg-white border rounded-full px-3 py-1 text-xs gap-1"
                >
                  {filter}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="text-gray-500 hover:text-black cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 cursor-pointer">
          <span>{sort}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row border-t border-[#D9D9D9] gap-6 mt-6">
        {/* Sidebar */}
        <aside className="w-full md:w-80 lg:w-80 font-advent border-r border-[#E5E7EB] bg-white p-6 space-y-4">
          {Object.entries(categoryFilters).map(([section, options]) => (
            <div
              key={section}
              className="border-b border-[#E5E7EB] pb-6 last:border-b-0"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleExpand(section)}
                className="flex justify-between items-center w-full text-left mb-4 group"
              >
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#AC845D] transition-colors duration-200">
                  {formatSectionTitle(section)}
                </h3>
                <div
                  className={`transform transition-transform duration-300 ease-out ${expanded[section] ? "rotate-180" : "rotate-0"
                    }`}
                >
                  <ChevronDown
                    size={20}
                    className="text-gray-500 group-hover:text-[#AC845D]"
                  />
                </div>
              </button>

              {/* Options List */}
              <div
                className={`transition-all duration-300 ease-in-out ${expanded[section]
                  ? "max-h-64 opacity-100 overflow-y-auto"
                  : "max-h-0 opacity-0 overflow-hidden"
                  }`}
              >
                <div className="space-y-3 pr-1">
                  {options.map((option) => {
                    const selected = isSelected(section, option);

                    return (
                      <div key={option} className="group">
                        <button
                          onClick={() => handleToggleFilter(section, option)}
                          className="flex items-center cursor-pointer justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 whitespace-nowrap">
                              {option}
                            </span>
                          </div>

                          {/* Category Icons */}
                          {section === "categories" && (
                            <div className="relative">
                              <div
                                className={`
                            text-2xl transition-all duration-300 ease-out relative
                            ${selected ? "scale-110" : "group-hover:scale-105"}
                          `}
                              >
                                <Image
                                  alt="Icon"
                                  src={categoryIcons[option as Category]}
                                  height="30"
                                  width="30"
                                />

                                {/* Animated Check Badge */}
                                <div
                                  className={`
                              absolute -top-1 -right-1 w-5 h-5 bg-[#AC845D] rounded-full 
                              flex items-center justify-center shadow-lg transform transition-all duration-300
                              ${selected
                                      ? "scale-100 opacity-100"
                                      : "scale-0 opacity-0"
                                    }
                            `}
                                >
                                  <Check
                                    size={12}
                                    className="text-white"
                                    strokeWidth={3}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Color Swatches - Square/Rectangular */}
                          {section === "colors" && (
                            <div className="relative">
                              <div
                                className={`
                            w-8 h-6 rounded-md border-2 shadow-sm transition-all duration-300 ease-out relative overflow-hidden
                            ${selected
                                    ? "scale-110 border-[#AC845D] shadow-md"
                                    : "border-gray-300 group-hover:scale-105 group-hover:border-gray-400"
                                  }
                            ${option === "White" ? "border-gray-400" : ""}
                          `}
                                style={{
                                  backgroundColor: colorMap[option as Color],
                                }}
                              >
                                {/* Animated Check Overlay */}
                                <div
                                  className={`
                              absolute inset-0 bg-[#AC845D] bg-opacity-90 
                              flex items-center justify-center transition-all duration-300
                              ${selected
                                      ? "scale-100 opacity-100"
                                      : "scale-0 opacity-0"
                                    }
                            `}
                                >
                                  <Check
                                    size={14}
                                    className="text-white"
                                    strokeWidth={3}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </aside>
        {/* Product grid */}
        <section className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <>
              {products.length === 0 ? (
                <div className="flex items-center justify-center h-40 sm:h-60 md:h-80 lg:h-[400px]">
                  <p className="text-center text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl">
                    No products found
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, idx) => (
                    <div
                      key={idx}
                      className="border font-advent border-[#D9D9D933] p-2 group"
                    >
                      <div className="relative w-full h-[400px] overflow-hidden">
                        <Image
                          src={product.images?.[0]}
                          alt={product.description}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform cursor-pointer duration-300 group-hover:scale-105"
                          onClick={() => {
                            router.push(
                              `/all-rental/${product.description
                              }?price_type=${priceType}&category=${encodeURIComponent(
                                product?.category?.name
                              )}&id=${product.id}`
                            );
                          }}
                        />
                        <button className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-sm flex items-center justify-center space-x-2 px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Image
                            src="/assets/SVG/icons/whiteCart.svg"
                            alt="Logo"
                            width={15}
                            height={25}
                          />
                          <span>Add to cart</span>
                        </button>
                      </div>
                      <h3 className="text-base mt-2 font-medium truncate">
                        {product.description}
                      </h3>
                      {/* <p className="text-sm text-gray-600">
                        {priceType === "rental_price"
                               ? `Rental Price: $${product.rental_price || 0}`
                             : `Buy Price: $${product.buy_price || 0}`}

                      </p> */}

                      <p className="text-sm text-gray-600">
                        {["Pocket Square", "Suspenders", "Socks"].includes(product?.category?.name)
                          ? `Buy Price: $${product.buy_price || 0}`
                          : priceType === "rental_price"
                            ? `Rental Price: $${product.rental_price || 0}`
                            : `Buy Price: $${product.buy_price || 0}`}
                      </p>

                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {products.length > 0 && (
            <div className="flex justify-center mt-20">
              {" "}
              <button className="border border-black px-6 py-2 text-sm hover:bg-black hover:text-white transition cursor-pointer">
                {" "}
                Show More{" "}
              </button>{" "}
            </div>
          )}
        </section>
      </div>
      <section className="py-16 px-4 bg-white relative overflow-hidden">
        {/* Optional Background Element */}
        <div className="absolute right-0 top-0 w-64 opacity-50 pointer-events-none">
          <Image
            src="/assets/SVG/icons/leaf.svg"
            alt="Logo"
            width={400}
            height={500}
            className="object-cover"
          />
        </div>

        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="font-advent text-2xl md:text-3xl font-semibold mb-2">
            Trust us for your{" "}
            <span className="capitalize">vip Formal Wear</span> needs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-sm md:text-base">
            There’s a reason men trust us! We offer style and selection with a
            price that fits every occasion and budget.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="border border-[#BB9D7B] p-6 rounded">
              <h3 className="font-advent text-lg font-bold mb-2 uppercase">
                Style is in the Details
              </h3>
              <p className="text-sm text-gray-600">
                Tuxedo rentals are an often underappreciated part of weddings,
                proms, and other special occasions. Instead of settling for
                something that works, find the perfect tuxedo or suit that
                complements your style and gives you a presence.
              </p>
            </div>

            {/* Card 2 */}
            <div className="border border-[#BB9D7B] p-6 rounded">
              <h3 className="font-advent text-lg font-bold mb-2 uppercase">
                Outstanding Service
              </h3>
              <p className="text-sm text-gray-600">
                The convenience of a local tuxedo rental shop cannot be
                overstated. All VIP Formal Wear inventory is within reach and
                can be delivered the same day for customers in the Raleigh area.
              </p>
            </div>

            {/* Card 3 */}
            <div className="border border-[#BB9D7B] p-6 rounded">
              <h3 className="font-advent text-lg font-bold mb-2 uppercase">
                Convenient Locations
              </h3>
              <p className="text-sm text-gray-600">
                VIP’s five convenient locations in Raleigh, Greensboro, and
                Winston-Salem offer the best tuxedo rental services and prices
                available. Unlike many large retailers who charge extra delivery
                and sizing fees, VIP Formal Wear offers truly customer-first
                service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllRentalComponent;
