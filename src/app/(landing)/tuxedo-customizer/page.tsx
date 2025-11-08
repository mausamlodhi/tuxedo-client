"use client";

import React, { useState } from 'react';
import { ChevronLeft, Trash2, Shirt, Watch, Diamond, Square, Circle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import LookPreview from '@/components/lookPreview';
import logger from '@/utils/logger';

const TuxedoCustomizer = () => {
    const [view, setView] = useState('detailed');
    const handleBackClick = () => {
       logger("Callll")
    };
    const items = [
        { name: 'Jacket & Pants', icon: Shirt, image: '/assets/images/jacket.png' },
        { name: 'Shirt', icon: Shirt, image: 'https://gentux.imgix.net/1591704711_200608-151436-shirt.png' },
        { name: 'Tie', icon: Circle, image: 'https://gentux.imgix.net/1591704712_200608-151436-tie.png' },
        { name: 'Vest & Cummerbund', icon: Square, image: 'https://gentux.imgix.net/1591704712_200608-151436-vest.png' },
        { name: 'Pocket Square', icon: Square, image: '/assets/images/pocket_square.png' },
        { name: 'Lapel Pin', icon: Diamond, image: '/assets/images/label_pinDummy.png' },
        { name: 'Cufflinks', icon: Circle, image: '/assets/images/cufflinks.png' },
        { name: 'Suspenders', icon: Circle, image: '/assets/images/belt.png' },
        { name: 'Studs', icon: Circle, image: '/assets/images/cufflinks.png' },
        { name: 'Socks', icon: Circle, image: '/assets/images/socks.png' },
        { name: 'Belt', icon: Circle, image: '/assets/images/belt.png' },
        { name: 'Shoes', icon: Circle, image: '/assets/images/shoeDummy.png' }
    ];

    const DetailedView = () => (
        <div className="w-full bg-gray-200 flex flex-col">
            <div className="flex-1  overflow-x-hidden overflow-y-hidden px-4 sm:px-0">
                <motion.div layoutId="tuxedo-box" className="text-start w-full h-[700px] ">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-6 md:mb-12">
                        Select an Item
                    </h2>

                    {/* Mobile Grid View (< 640px) */}
                    <div className="block sm:hidden">
                        <div className="grid grid-cols-3 gap-4 mb-20">
                            {items.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                                    >
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                            <Icon className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <span className="text-xs text-center text-gray-700 font-medium">
                                            {item.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Desktop View (>= 640px) */}
                    <div className="hidden sm:flex w-full h-[600px] gap-0">
                        <div className="flex flex-col w-1/5 items-center flex-1 rounded-lg">
                            <span className="text-xs sm:text-sm text-gray-600 mb-2 block px-2 py-1">
                                Socks
                            </span>
                            <div className="relative w-[64px] h-[2px] bg-teal-600 mx-auto transition">
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 
                                        border-l-4 border-r-4 border-t-4 border-transparent 
                                        border-t-teal-600"></div>
                            </div>
                            <div >
                                <div className='overflow-hidden mt-5 h-[150px] w-[100px] ms-10'>
                                    <Image
                                        height={80}
                                        width={80}
                                        src={'/assets/images/socks.png'}
                                        alt="Socks"
                                        className="transform transition duration-300 hover:scale-110 cursor-pointer mt-4"
                                    />
                                </div>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600 mb-2 block px-2 py-1">
                                Shoes
                            </span>
                            <div className="relative w-[64px] h-[2px] bg-teal-600 mx-auto transition">
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 
                                        border-l-4 border-r-4 border-t-4 border-transparent 
                                        border-t-teal-600"></div>
                            </div>
                            <div className='overflow-hidden h-[350px] w-[400px] ms-10'>
                                <Image
                                    height={380}
                                    width={380}
                                    src={'/assets/images/shoeDummy.png'}
                                    alt="Shoe"
                                    className="transform mt-[-350px] ms-14 transition duration-300 hover:scale-110 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-1/5 items-center flex-1 rounded-lg">
                            <span className="text-xs sm:text-sm text-gray-600 mb-2 block px-auto py-1">
                                Lapel Pin
                            </span>
                            <div className="relative w-[64px] h-[3px] bg-teal-600 mx-auto my-2 rounded-full transition">
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 
                                    border-l-4 border-r-4 border-t-4 border-transparent 
                                    border-t-teal-600"
                                ></div>
                            </div>

                            <img
                                src="/assets/images/label_pinDummy.png"
                                alt="lapel_pin"
                                className="w-[200px] h-[150px] transform transition duration-300 hover:scale-110 cursor-pointer mt-4"
                            />
                            <span className="text-xs sm:text-sm text-gray-600 mb-2 block px-2 py-1">
                                Pocket Square
                            </span>
                            <div className="relative w-[64px] h-[2px] bg-teal-600 mx-auto transition">
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 
                                        border-l-4 border-r-4 border-t-4 border-transparent 
                                        border-t-teal-600"></div>
                            </div>
                            <div className='relative overflow-hidden h-[350px] w-[300px] me-10'>
                                <Image
                                    height={380}
                                    width={380}
                                    src={'/assets/images/pocket_square.png'}
                                    alt="pocket_square"
                                    className="object-cover object-center transform transition duration-300 hover:scale-110 cursor-pointer mt-4"
                                />
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600 mb-2 block mt-4 px-2 py-1">
                                Suspender
                            </span>
                            <div className="relative w-[64px] h-[2px] bg-teal-600 mx-auto transition">
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 
                                        border-l-4 border-r-4 border-t-4 border-transparent 
                                        border-t-teal-600"></div>
                            </div>
                            <div className='overflow-hidden h-[350px] w-[400px] me-10'>
                                <Image
                                    height={380}
                                    width={380}
                                    src={'/assets/images/suspender.png'}
                                    alt="Suspender"
                                    className=" transform mt-[-400px]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-1/5 items-center flex-1">
                            <span className="text-xs sm:text-sm text-gray-600 mb-2 block px-2 py-1">
                                Tie
                            </span>
                            <div className="relative w-[64px] h-[2px] bg-teal-600 mx-auto transition">
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 
                                        border-l-4 border-r-4 border-t-4 border-transparent 
                                    border-t-teal-600"></div>
                            </div>
                            <div className='overflow-hidden mt-5 h-[150px] w-[100px] ms-6'>
                                <Image
                                    height={80}
                                    width={80}
                                    src={'https://gentux.imgix.net/1591704712_200608-151436-tie.png'}
                                    alt="Tie"
                                    className="transform transition duration-300 hover:scale-110 cursor-pointer"
                                />
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600 mb-2 block px-2 py-1">
                                Cfflinks
                            </span>
                            <div className="relative w-[64px] h-[2px] bg-teal-600 mx-auto transition">
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 
                                        border-l-4 border-r-4 border-t-4 border-transparent 
                                        border-t-teal-600"></div>
                            </div>
                            <div className='overflow-hidden h-[350px] w-[400px] me-52'>
                                <Image
                                    height={380}
                                    width={380}
                                    src={'/assets/images/cufflinks.png'}
                                    alt="cufflinks"
                                    className="mt-[-400px] transform transition duration-300 hover:scale-110 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-2/5 items-center flex-2">
                            <span className="text-xs sm:text-sm text-gray-600 mb-2 block px-2 py-1">
                                Shirt
                            </span>
                            <div className="relative w-[64px] h-[2px] bg-teal-600 mx-auto transition">
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 
                                        border-l-4 border-r-4 border-t-4 border-transparent 
                                        border-t-teal-600"></div>
                            </div>
                            <img
                                src={"https://gentux.imgix.net/1591704711_200608-151436-shirt.png"}
                                alt="Shirt"
                                className="w-auto h-auto rounded-lg transform transition duration-300 hover:scale-110 cursor-pointer mt-10"
                            />
                        </div>

                        <div className="flex flex-col w-2/5 items-center flex-2 rounded-lg">
                            <span className="text-xs sm:text-sm text-gray-600 block px-2 py-1">
                                Vest
                            </span>
                            <div className="relative w-[64px] h-[2px] bg-teal-600 mx-auto transition">
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 
                                        border-l-4 border-r-4 border-t-4 border-transparent 
                                        border-t-teal-600"></div>
                            </div>
                            <img
                                src={'https://gentux.imgix.net/1591704712_200608-151436-vest.png'}
                                alt="Vest"
                                className="w-auto h-auto transform transition duration-300 hover:scale-110 cursor-pointer mt-10"
                            />
                        </div>

                        <div className="flex flex-col items-center flex-2 w-1/5 rounded-lg">
                            <span className="text-xs sm:text-sm text-gray-600 mb-2 block px-2 py-1">
                                Pant
                            </span>
                            <div className="relative w-[64px] h-[2px] bg-teal-600 mx-auto transition">
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 
                                        border-l-4 border-r-4 border-t-4 border-transparent 
                                        border-t-teal-600"></div>
                            </div>
                            <div className='overflow-hidden mt-5 h-[150px] w-[100px] ms-10'>
                                <Image
                                    src={'/assets/images/pant.png'}
                                    alt="Jacket"
                                    width={100}
                                    height={600}
                                    className="w-auto left-5 h-auto transform transition duration-300 hover:scale-110 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-center flex-2 w-1/5 rounded-lg">
                            <span className="text-xs sm:text-sm text-gray-600 mb-2 block px-2 py-1">
                                Jacket
                            </span>
                            <div className="relative w-[64px] h-[2px] bg-teal-600 mx-auto transition">
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 
                                        border-l-4 border-r-4 border-t-4 border-transparent 
                                        border-t-teal-600"></div>
                            </div>
                            <img
                                src={'/assets/images/jacket.png'}
                                alt="Jacket"
                                className="w-auto h-auto transform transition duration-300 hover:scale-110 mt-7 cursor-pointer"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
    const layers = [
        {
            title: "jacket-and-pants",
            label: "Jacket & Pants",
            images: [
                { src: "https://gentux.imgix.net/look-builder/gentux/v117/130074BLK-jacket_front.png", alt: "jacket_front" },
                { src: "https://gentux.imgix.net/look-builder/gentux/v117/130074BLK-jacket_full.png", alt: "jacket_full" },
                { src: "https://gentux.imgix.net/look-builder/gentux/v117/shadow-jacket_shadows.png", alt: "shadow" },
                { src: "https://gentux.imgix.net/look-builder/gentux/v117/230139BLK-pants.png", alt: "pants" },
                { src: "https://gentux.imgix.net/look-builder/gentux/v117/hanger-hanger.png", alt: "hanger" },
            ],
        },
        {
            title: "shirt",
            label: "Shirt",
            images: [
                { src: "https://gentux.imgix.net/look-builder/gentux/v117/330175WHT-shirt_collar.png", alt: "shirt_collar" },
                { src: "https://gentux.imgix.net/look-builder/gentux/v117/330175WHT-shirt_full.png", alt: "shirt_full" },
            ],
        },
        // add more layers (tie, vest, socks, etc.)
    ];
    return (
        <div className="font-sans relative min-h-screen w-full overflow-x-hidden  bg-gray-200 ">
            <AnimatePresence mode="wait">
                {view === "detailed" && (
                    <motion.div
                        key="detailed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        <DetailedView />
                        <span className="flex flex-col items-center space-y-3 px-4 sm:px-8 pb-8 overflow-y-hidden">
                            <button
                                onClick={handleBackClick}
                                className="
      w-full sm:w-[300px] md:w-[400px] lg:w-[500px] xl:w-[600px] 2xl:w-[800px]
      py-8 sm:py-4 bg-[#BB9D7B] text-black
      flex items-center hover:bg-gray-100 transition-colors cursor-pointer
      relative overflow-hidden
    "
                            >
                                {/* Left white part (1/5) with arrow */}
                                <span className="
      w-1/5 h-full bg-white flex items-center justify-center
      border border-gray-600 absolute left-0 top-0
    ">
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                                </span>

                                {/* Right colored part (4/5) with text */}
                                <span className="
      w-4/5 ml-auto flex items-center justify-center
      text-sm sm:text-base md:text-lg font-medium
    ">
                                    Back
                                </span>
                            </button>

                            <p className="mt-2 text-xs text-gray-400 text-center px-4">
                                ©2025 All rights reserved. VIP is a registered trademark.
                            </p>
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TuxedoCustomizer;