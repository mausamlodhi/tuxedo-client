

import React from "react";
import Link from "next/link";
import { rentalProcess } from "@/utils/constant";

const RentalProcessPopup = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div
                className="
                    bg-white 
                    rounded-2xl 
                    shadow-xl 
                    w-full max-w-md 
                    p-6 
                    relative 
                    animate-fadeIn
                    flex flex-col
                    overflow-hidden
                "
                style={{
                    maxHeight: window.innerHeight < 768 ? "90vh" : "auto",
                }}
            >
              
                <h2 className="text-2xl font-advent font-semibold text-center mb-6 text-gray-800">
                    Our rental process is simple
                </h2>

                
                <div
                    className="overflow-y-auto pr-2 space-y-2"
                    style={{
                        maxHeight: window.innerHeight < 768 ? "calc(90vh - 120px)" : "auto", 
                    }}
                >

                                           
                    {rentalProcess.map((item, index) => (
                        <div
                            key={item.step}
                            className={`border border-[#BB9D7B] rounded-md p-4 flex items-start shadow-sm bg-white ${
                                index % 2 === 0
                                    ? "flex-row"
                                    : "flex-row-reverse text-right"
                            }`}
                        >
                            <div>
                                <h3 className="font-advent font-semibold text-black mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                            <span className="text-gray-400 font-advent font-semibold text-lg ml-3">
                                {item.step}
                            </span>
                        </div>
                    ))}
                </div>

               
                <div className="flex gap-3 mt-4">
                    <Link
                        href="/all-rental"
                        className="bg-[#BB9D7B] text-white font-advent font-semibold py-2 px-4 w-full hover:bg-[#a88b6b] transition cursor-pointer text-center"
                    >
                        Get fitted to best outfit
                    </Link>
                    <button
                        onClick={onClose}
                        className="border border-[#BB9D7B] text-[#BB9D7B] font-advent font-semibold py-2 px-4 w-full hover:bg-[#f9f6f2] transition cursor-pointer"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RentalProcessPopup;
