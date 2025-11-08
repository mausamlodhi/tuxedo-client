"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Breadcrumb from "@/components/breadcrumb";



const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.3
    }
  }
};

const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 1.6 }
};

const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 1.6 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 1.6 }
};


export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">

      <Header />
      <Breadcrumb />

      <section className="relative w-full top-16">
        {/* <img
    src="/assets/images/banner-01.jpg"
    alt="About Banner"
    className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover "
  /> */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            ABOUT
          </h1>
        </div>
      </section>




      <motion.section
        className="relative w-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="relative ">
          {/* <motion.div
            className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-r from-bg-[#DBB589]  via-[#DBB589]  to-[#DBB589]  rounded-lg mx-6 md:mx-12 lg:mx-36"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div className="absolute  rounded-lg"></div>
          </motion.div> */}

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.h1
              className="text-white text-2xl sm:text-3xl md:text-5xl font-bold px-6 py-3 sm:px-10 sm:py-6 mt-64 bg-black/60 rounded-lg tracking-widest backdrop-blur-sm border border-white/20"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                transition: { duration: 0.3 }
              }}
              animate={{
                textShadow: [
                  "0 0 10px rgba(255, 255, 255, 0.5)",
                  "0 0 20px rgba(255, 255, 255, 0.8)",
                  "0 0 10px rgba(255, 255, 255, 0.5)"
                ]
              }}
              transition={{
                textShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              ABOUT
            </motion.h1>
          </motion.div>
        </div>
      </motion.section>



      <motion.main
        className="flex-1 px-8 md:px-16 lg:px-32 py-12 space-y-16"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >


        <motion.div
          className="bg-white p-8 rounded-xl border mt-24 border-[#BB9D7B]"
          variants={slideInLeft}

        >
          <motion.h2
            className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 relative"

          >
            <span className="relative z-10">North Carolina's Authority on Tuxedo Rental and Formal Wear</span>
            <motion.div

            />
          </motion.h2>

          <motion.div
            className="space-y-4"
            variants={staggerContainer}
          >
            <motion.p
              className="text-gray-700 leading-relaxed text-lg"
              variants={fadeInUp}
            >
              Tuxedo rental is a part of the formal wear routine that every man goes
              through. At VIP, we make the experience as enjoyable as possible while
              providing every guest with exactly what they came for. If you want to
              achieve a classic, black-and-white tuxedo look, we can do that. If you
              are preparing for prom, we can help match your accent pieces to your
              date.
            </motion.p>
            <motion.p
              className="text-gray-700 leading-relaxed text-lg"
              variants={fadeInUp}
            >
              From sizing and styling to delivery and ongoing customer service, VIP
              offers it all. With local service and a commitment to helping you look
              your best, we are the menswear experts you want.
            </motion.p>
          </motion.div>
        </motion.div>


        <motion.div
          className="bg-white p-8 rounded-xl   border border-[#BB9D7B]"
          variants={slideInRight}

        >
          <motion.h2
            className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 relative"

          >
            <span className="relative z-10">Menswear for Every Occasion</span>
            <motion.div

            />
          </motion.h2>

          <motion.div
            className="space-y-6"
            variants={staggerContainer}
          >
            <motion.p
              className="text-gray-700 leading-relaxed text-lg"
              variants={fadeInUp}
            >
              At VIP Formal Wear, we provide the clothing and expertise to help you
              stand out at your next event. From the finest detail to the overall
              look, our experts take pride in offering the highest quality tuxedos at
              affordable prices. Come to us before it&apos;s time for your next:
            </motion.p>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 "
              variants={staggerContainer}
            >
              {["Wedding", "Prom", "Quinceañera", "Other Formal Event"].map((item, index) => (
                <motion.div
                  key={item}
                  className="bg-[#DBB589] p-4 rounded-xl"
                  variants={scaleIn}

                >
                  <span className="text-white font-semibold text-lg flex items-center   ">
                    <motion.div
                      className="  rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        backgroundColor: ["#3b82f6", "#8b5cf6", "#3b82f6"]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                    />
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className="text-gray-700 leading-relaxed text-lg"
              variants={fadeInUp}
            >
              VIP has been serving North Carolina's formal wear needs since 1971. Our
              skilled staff is comprised of formal wear specialists knowledgeable in
              every aspect of special event etiquette. When you visit a VIP Formal
              Wear location, you'll find experts dedicated to helping you look your
              best on your big day. We're here to answer your questions, advise your
              choices, and help you create a look that's all your own.
            </motion.p>
          </motion.div>
        </motion.div>


        <motion.div
          className="bg-white p-8 rounded-xl  border border-[#BB9D7B]"
          variants={scaleIn}

        >
          <motion.h2
            className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 relative"
            whileHover={{ color: "#1f2937" }}
          >
            <span className="relative z-10">Convenient In-Store Locations</span>
            <motion.div

            />
          </motion.h2>

          <motion.div
            className="space-y-6"
            variants={staggerContainer}
          >
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={staggerContainer}
            >
              {[
                "Raleigh — Crabtree Valley Mall",
                "Garner Area — South Wilmington St.",
                "Greensboro — Four Seasons Town Centre",
                "Winston Salem — Hanes Mall"
              ].map((location, index) => (
                <motion.div
                  key={location}
                  className="bg-[#DBB589]  p-6 rounded-xl"
                  variants={fadeInUp}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "linear-gradient(to right, #dbeafe, #e0e7ff)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="flex items-center">
                    <motion.div
                      className="w-3 h-3  rounded-full mr-4"

                    />
                    <span className="text-white font-semibold">{location}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="space-y-4"
              variants={staggerContainer}
            >
              <motion.p
                className="text-gray-700 leading-relaxed text-lg"
                variants={fadeInUp}
              >
                Each of our VIP locations strive to have the best service and prices
                around. With our local NC warehouse, last-minute groomsmen and changes
                are easily handled. Feel confident that we are not owned by a large
                corporation who only deals in tuxedos on the side. As tuxedo
                specialists, men's formal wear is our objective.
              </motion.p>
              <motion.p
                className="text-gray-700 leading-relaxed text-lg"
                variants={fadeInUp}
              >
                Spend a few minutes browsing our collections or visit one of our
                locations to speak to a VIP Formal Wear professional today.
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>



      </motion.main>


      <Footer />
    </div>
  );
}


