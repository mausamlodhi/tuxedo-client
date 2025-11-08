"use client";

import Image from "next/image";
import Link from "next/link";
import { JSX, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { logoutAction, selectAuthData } from "@/app/redux/slice/auth.slice";
import logger from "@/utils/logger";
import { AdminAuthServices } from "@/servivces/admin/auth/auth.service";
import { deleteCookie } from "cookies-next";
import { ADMIN_ROLE, CUSTOMER_ROLE, TOKEN_KEY } from "@/utils/env";
import { removeLocalStorageToken } from "@/utils";
import modalNotification from "@/utils/notification";

interface BodyData {
  price_type?: string;
  category?: string;
  color?: string;
}

const Header = (): JSX.Element => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState<
    "" | "rent" | "buy" | "location"
  >("");
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const dispatch = useDispatch();
  const authData = useSelector(selectAuthData);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedLocation = searchParams.get("loc");

  const userDropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdown(false);
      }
    };

   
    if (userDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdown]);



  const handleLocationSelect = (locationId: string) => {
    router.push(`/location?loc=${locationId}`);
    setShowDropdown("");
    setMobileDropdown(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    AdminAuthServices.adminLogout();
    deleteCookie(TOKEN_KEY);
    deleteCookie(CUSTOMER_ROLE);
    dispatch(logoutAction());
    removeLocalStorageToken();
    router.push("/");
    modalNotification({
      message: "Logged out successfully",
      type: "success",
    });
  };

  const handleFilterNavigate = ({
    price_type,
    category,
    color,
  }: {
    price_type?: string;
    category?: string;
    color?: string;
  }) => {
    const params = new URLSearchParams();

    if (price_type) params.set("price_type", price_type);
    if (category) params.set("category", category);
    if (color) params.set("color", color);

    router.push(`/all-rental?${params.toString()}`);
    setShowDropdown("");
  };

  const isActive = (href: string) => pathname === href;
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/wedding", label: "Wedding" },
    // { href: "#", label: "Rent" },
    // { href: "/all-rental", label: "Buy" },
    { href: "/about", label: "About" },
    { href: "/contact-us", label: "Contact" },
  ];

  const locations = [
    { id: "winston-salem", label: "Winston-Salem" },
    { id: "raleigh", label: "Raleigh" },
    { id: "garner-area", label: "Garner Area" },
    { id: "greensboro", label: "Greensboro" },
  ];

  const buy = [
    { id: "coat", label: "Coat" },
    { id: "shirt", label: "Shirt" },
    { id: "pant", label: "Pant" },
    { id: "tie", label: "Tie" },
    { id: "shoe", label: "Shoe" },
    { id: "suspenders", label: "Suspenders" },
    { id: "shocks", label: "Socks" },
    { id: "pocketsquare", label: "Pocket Square" },
     { id: "Vest & Cummerbund", label: "Vest & Cummerbund" },
    { id: "studs & cufflinks", label: "Studs & Cufflinks" },
  ];

  const rent = [
    { id: "coat", label: "Coat" },
    { id: "shirt", label: "Shirt" },
    { id: "pant", label: "Pant" },
    { id: "Vest & Cummerbund", label: "Vest & Cummerbund" },
    { id: "shoe", label: "Shoe" },
    { id: "tie", label: "Tie" },
    { id: "studs & cufflinks", label: "Studs & Cufflinks" },
  ];
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

  type Color = (typeof categoryFilters.colors)[number];
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

  return (
    <header className="px-4 md:px-6 lg:px-8 h-[70px] py-3 relative z-[9999] bg-white shadow-sm">
      <div className="max-w-[1400px] mx-auto h-full flex items-center">
        <Link className="flex-shrink-0 mr-4 md:mr-8" href="/">
          <Image
            src="/assets/SVG/icons/logo.svg"
            alt="Logo"
            width={60}
            height={70}
            className="object-cover"
          />
        </Link>

        <div className="hidden md:flex flex-1 justify-center">
          <nav className="flex items-center gap-x-4 lg:gap-x-6 text-xs md:text-sm font-medium">
            {navLinks.map((link) =>
              link.href === "#" ? (
                <div key={link.href} className="relative">
                  <span className="relative px-1 whitespace-nowrap cursor-pointer">
                    {link.label}
                  </span>
                </div>
              ) : (
                <div key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className="relative whitespace-nowrap px-1"
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#dbb589] rounded-full cursor-pointer"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </div>
              )
            )}
            {/* For Rent */}
            <div
              className="relative z-[9999] flex-shrink-0"
              onMouseEnter={() => setShowDropdown("rent")}
              onMouseLeave={() => setShowDropdown("")}
            >
              <button
                className="relative px-1 hover:text-gray-700"
                onClick={() =>
                  handleFilterNavigate({ price_type: "rental_price" })
                }
              >
                <span className="whitespace-nowrap">
                  Rent
                  <motion.span
                    animate={{ rotate: showDropdown === "rent" ? 180 : 0 }}
                    transition={{ duration: 0.05 }}
                    className="inline-block text-xs origin-center"
                  >
                    <svg
                      className="arrow icon transition-transform block w-[8px]"
                      viewBox="0 0 6 8"
                      fill="none"
                    >
                      <path
                        d="M1.89518e-05 4.24579C0.696019 3.99379 1.59602 3.84979 2.52002 3.83778L2.18402 6.15379C2.10002 6.72979 2.36402 7.02979 2.74802 7.02979C3.14402 7.02979 3.40802 6.72979 3.32402 6.15379L3.00002 3.83778C3.92402 3.84979 4.82402 3.99379 5.52002 4.24578L5.52002 3.78978C4.11602 3.38179 2.97602 2.84178 2.97602 0.969785L2.54402 0.969785C2.54402 2.84178 1.40402 3.38179 1.89319e-05 3.78979L1.89518e-05 4.24579Z"
                        fill="currentcolor"
                      ></path>
                    </svg>
                  </motion.span>
                </span>
              </button>

              <AnimatePresence>
                {showDropdown === "rent" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-[520px] bg-[#F2F2F2] shadow-lg rounded-md p-4 z-50 grid grid-cols-2 gap-4"
                  >
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-gray-700 border-b pb-1">
                        Categories
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {rent.map((item) => (
                          <motion.button
                            key={item.id}
                            onClick={() =>
                              handleFilterNavigate({
                                price_type:
                                  showDropdown === "rent"
                                    ? "rental_price"
                                    : "buy_price",
                                category: item.label,
                              })
                            }
                            className={`block text-left text-sm px-2 py-1 rounded-md transition-colors cursor-pointer ${
                              selectedLocation === item.id
                                ? "bg-[#dbb589] text-white font-semibold"
                                : "hover:bg-gray-100"
                            }`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {item.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-gray-700 border-b pb-1">
                        Colors
                      </h4>
                      <div className="grid grid-cols-2 gap-2 w-65">

                        {Object.entries(colorMap).map(
                          ([colorName, colorHex]) => (
                            <motion.button
                              key={colorName}
                              onClick={() =>
                                handleFilterNavigate({
                                  price_type:
                                    showDropdown === "rent"
                                      ? "rental_price"
                                      : "buy_price",
                                  color: colorName,
                                })
                              }
                              className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1"
                               whileHover={{ scale: 1.03 }}
                               whileTap={{ scale: 0.97 }}
                            >
                              <span
                                className="inline-block w-4 h-4 rounded-full "
                                style={{ backgroundColor: colorHex }}
                              ></span>
                              <span className="text-sm capitalize">
                                {colorName}
                              </span>
                            </motion.button>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* For buy */}
            <div
              className="relative z-[9999] flex-shrink-0"
              onMouseEnter={() => setShowDropdown("buy")}
              onMouseLeave={() => setShowDropdown("")}
            >
              <button
                className="relative px-1 hover:text-gray-700"
                onClick={() =>
                  handleFilterNavigate({ price_type: "buy_price" })
                }
              >
                <span className="whitespace-nowrap">
                  Buy{" "}
                  <motion.span
                    animate={{ rotate: showDropdown === "buy" ? 180 : 0 }}
                    transition={{ duration: 0.05 }}
                    className="inline-block text-xs origin-center"
                  >
                    <svg
                      className="arrow icon transition-transform block w-[8px]"
                      viewBox="0 0 6 8"
                      fill="none"
                    >
                      <path
                        d="M1.89518e-05 4.24579C0.696019 3.99379 1.59602 3.84979 2.52002 3.83778L2.18402 6.15379C2.10002 6.72979 2.36402 7.02979 2.74802 7.02979C3.14402 7.02979 3.40802 6.72979 3.32402 6.15379L3.00002 3.83778C3.92402 3.84979 4.82402 3.99379 5.52002 4.24578L5.52002 3.78978C4.11602 3.38179 2.97602 2.84178 2.97602 0.969785L2.54402 0.969785C2.54402 2.84178 1.40402 3.38179 1.89319e-05 3.78979L1.89518e-05 4.24579Z"
                        fill="currentcolor"
                      ></path>
                    </svg>
                  </motion.span>
                </span>
              </button>

              <AnimatePresence>
                {showDropdown === "buy" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-[520px] bg-[#F2F2F2]  shadow-lg rounded-md p-4 z-50 grid grid-cols-2 gap-12"
                   >
                    {/* Left: Buy Categories */}
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-gray-700 border-b pb-1">
                        Categories
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {buy.map((item) => (
                          <motion.button
                            key={item.id}
                            onClick={() =>
                              handleFilterNavigate({
                                price_type: "buy_price",
                                category: item.label,
                              })
                            }
                            className="block text-left text-sm px-2 py-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {item.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Right: Color Options */}
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-gray-700 border-b pb-1">
                        Colors
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(colorMap).map(
                          ([colorName, colorHex]) => (
                            <motion.button
                              key={colorName}
                              onClick={() =>
                                handleFilterNavigate({
                                  price_type: "buy_price",
                                  color: colorName,
                                })
                              }
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 py-1"
                               whileHover={{ scale: 1.03 }}
                               whileTap={{ scale: 0.97 }}
                            >
                              <span
                                className="inline-block w-4 h-4 rounded-full "
                                style={{ backgroundColor: colorHex }}
                              ></span>
                              <span className="text-sm">{colorName}</span>
                            </motion.button>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="relative z-[9999] flex-shrink-0"
              onMouseEnter={() => setShowDropdown("location")}
              onMouseLeave={() => setShowDropdown("")}
            >
              <button className="relative px-1 hover:text-gray-700">
                {selectedLocation ? (
                  <span className="whitespace-nowrap">
                    {locations.find((l) => l.id === selectedLocation)?.label}
                  </span>
                ) : (
                  <span className="whitespace-nowrap">
                    Location{" "}
                    <span className="inline-block">
                      <motion.span
                        animate={{
                          rotate: showDropdown === "location" ? 180 : 0,
                        }}
                        transition={{ duration: 0.05 }}
                        className="inline-block text-xs origin-center"
                      >
                        {" "}
                        <svg
                          className="arrow icon transition-transform block w-[8px]"
                          viewBox="0 0 6 8"
                          fill="none"
                        >
                          <path
                            d="M1.89518e-05 4.24579C0.696019 3.99379 1.59602 3.84979 2.52002 3.83778L2.18402 6.15379C2.10002 6.72979 2.36402 7.02979 2.74802 7.02979C3.14402 7.02979 3.40802 6.72979 3.32402 6.15379L3.00002 3.83778C3.92402 3.84979 4.82402 3.99379 5.52002 4.24578L5.52002 3.78978C4.11602 3.38179 2.97602 2.84178 2.97602 0.969785L2.54402 0.969785C2.54402 2.84178 1.40402 3.38179 1.89319e-05 3.78979L1.89518e-05 4.24579Z"
                            fill="currentcolor"
                          ></path>
                        </svg>
                      </motion.span>
                    </span>
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showDropdown === "location" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-[#F2F2F2]  shadow-lg rounded-md py-2 z-50 overflow-hidden"
                  >
                    {locations.map((loc) => (
                      <motion.button
                        key={loc.id}
                        onClick={() => handleLocationSelect(loc.id)}
                        className={`block w-full text-left px-4 py-2 transition-colors ${
                          selectedLocation === loc.id
                            ? "bg-[#dbb589] text-white font-semibold"
                            : "hover:bg-gray-100"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loc.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-auto">
          <Link href="/cart">
            <Image
              src="/assets/SVG/icons/cart.svg"
              alt="Cart"
              width={20}
              height={30}
              className="object-cover"
            />
          </Link>

          {authData?.user?.email ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2"
              >
                {authData?.user?.image ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-100">
                    <Image
                      src={authData.user.image}
                      alt="User"
                      width={40}
                      height={40}
                      className="w-full h-full object-contain scale-90"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/assets/SVG/icons/user.svg"
                      alt="User"
                      width={20}
                      height={20}
                      className="text-gray-500"
                    />
                  </div>
                )}
                <span className="hidden md:inline text-sm font-medium">
                  {authData?.user?.firstName && authData?.user?.lastName
                    ? `${authData.user.firstName} ${authData.user.lastName}`
                    : authData?.user?.email}
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-4 h-4 transition-transform ${
                    userDropdown ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {userDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50"
                  >
                    <Link
                      href="/my-account"
                      className="block px-4 cursor-pointer py-2 hover:bg-gray-100 text-sm"
                    >
                      Profile
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                    >
                      My Orders
                    </Link>
                    <button
                      className="block w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/signin"
              className={`text-sm font-medium hidden md:inline relative`}
            >
              Sign In
              {isActive("/signin") && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#dbb589] rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          )}

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col px-6 py-4 gap-3 md:hidden z-50 overflow-hidden"
            >
              {navLinks.map((link) =>
                link.href === "#" ? (
                  <div key={link.href} className="relative">
                    <span className="relative px-1 whitespace-nowrap">
                      {link.label}
                    </span>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-2 ${
                      isActive(link.href) ? "text-[#dbb589] font-semibold" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}

              <div className="flex flex-col">
                <div className="flex justify-between items-center py-2">
                  <button
                    onClick={() => router.push("/#")}
                    className="text-left font-medium flex-1"
                  >
                    Rent
                  </button>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(showDropdown === "rent" ? "" : "rent");
                    }}
                    animate={{ rotate: showDropdown === "rent" ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-2"
                  >
                    <motion.span
                      animate={{ rotate: showDropdown === "rent" ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="inline-block text-xs origin-center"
                    >
                      ▾
                    </motion.span>
                  </motion.button>
                </div>

                {/* Dropdown List */}
                <AnimatePresence>
                  {showDropdown === "rent" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col pl-4"
                    >
                      <h4 className="font-semibold mb-2 text-sm text-gray-700">
                        Categories
                      </h4>
                      {rent.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleLocationSelect(item.id)}
                          className="py-2 text-left hover:bg-gray-100 rounded-md text-sm"
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between items-center py-2">
                  <button
                    onClick={() => router.push("/all-rental")}
                    className="text-left font-medium flex-1"
                  >
                    Buy
                  </button>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(showDropdown === "buy" ? "" : "buy");
                    }}
                    animate={{ rotate: showDropdown === "buy" ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-2"
                  >
                    <motion.span
                      animate={{ rotate: showDropdown === "rent" ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="inline-block text-xs origin-center"
                    >
                      ▾
                    </motion.span>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showDropdown === "buy" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col pl-4"
                    >
                      {buy.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => router.push("/all-rental")}
                          className="py-2 text-left hover:bg-gray-100 rounded-md text-sm"
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <button
                  className="w-full text-left py-2 flex justify-between items-center"
                  onClick={() =>
                    setShowDropdown(
                      showDropdown === "location" ? "" : "location"
                    )
                  }
                >
                  Location
                  <motion.span
                    animate={{ rotate: showDropdown === "location" ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block text-xs origin-center"
                  >
                    ▾
                  </motion.span>
                </button>
                <AnimatePresence>
                  {showDropdown === "location" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col pl-4"
                    >
                      {locations.map((loc) => (
                        <button
                          key={loc.id}
                          onClick={() => handleLocationSelect(loc.id)}
                          className={`py-2 text-left ${
                            selectedLocation === loc.id
                              ? "bg-[#dbb589] text-white font-semibold rounded-md"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {loc.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Info or Sign In */}
              {authData?.user?.email ? (
                <div className="flex cursor-pointer items-center gap-2 py-2">
                  <Image
                    src="/assets/SVG/icons/user.svg"
                    alt="User"
                    width={20}
                    height={20}
                  />
                  <span className="text-sm">{authData?.user?.email}</span>
                </div>
              ) : (
                <Link
                  href="/signin"
                  className={`py-2 ${
                    isActive("/signin") ? "text-[#dbb589] font-semibold" : ""
                  }`}
                >
                  Sign In
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;


