"use client";

import React from "react";
import Image from "next/image";
import Header from "@/components/header";
import { usePathname } from "next/navigation";

export default function NotFoundPage() {
    const pathname = usePathname();
    const showHeader = !pathname.startsWith("/vipadmin");
    return (
        <div className="flex flex-col min-h-screen">

            {showHeader && <Header />}

            <main className="flex flex-1 flex-col items-center justify-center text-center px-4 py-12">
                <h2 className="text-xl md:text-2xl font-inter mb-2 text-[#000000]">OOOPS!!</h2>
                <h1 className="text-6xl md:text-8xl font-bold text-[#D6A680] mb-4">404</h1>

                <p className="text-gray-600 font-inter mb-6">
                    we couldn’t find that page - <br /><br />
                    Try searching or go to{" "}


                    <a href="/" className=" font-bold text-[#D6A680] underline tracking-widest">
                        VIPFORMALWEAR home page
                    </a>
                </p>

                <div className="w-full max-w-md -mt-8">
                    <Image
                        src="/assets/images/notFound.png"
                        alt="404 illustration"
                        width={500}
                        height={350}
                        className="mx-auto"
                    />
                </div>

            </main>

        </div>
    );
}
