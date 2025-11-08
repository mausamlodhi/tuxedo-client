'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { FormalwearServices } from "@/servivces/admin/formalwear/formalwear.service";
import { PER_PAGE_LIMIT } from '@/utils/env';
import RentalProcessPopup from '@/components/common/rentalProcessPopup';
import logger from '@/utils/logger';
import { useRouter } from "next/navigation";
interface SuiteProductInterface {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  
}

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [suitProducts, setSuitProducts] = useState<SuiteProductInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [prevIndex, setPrevIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowPopup(true);
      sessionStorage.setItem('hasVisited', 'true');
    }
  }, []);
 
  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(4);
    };
    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const visibleProducts = suitProducts.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribed with email:', email);
  };

  const fetchFormalwear = async (search: string = "") => {
    try {
      setLoading(true);
      const queryParams = {
        search: search,
        page: currentPage,
        limit: PER_PAGE_LIMIT,
      };
      const response = await FormalwearServices.getFormalwearList(queryParams);
     
      
      if (response?.status) {
        const formatted = (response?.results || []).map((item: any) => ({
          id: item.id?.toString(),
          name: item.title || "Untitled",
          price: item.buy_price ? `$${item.buy_price}` : "Price Unavailable",
          image: item.images?.[0] || item?.coat?.images?.[0] || ""
        }));
        setSuitProducts(formatted);
      } else {
        setSuitProducts([]);
      }
    } catch (error) {
      console.error("Error fetching formalwear:", error);
      setSuitProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load data on mount
  useEffect(() => {
    fetchFormalwear();
  }, []);
  logger("Product ",visibleProducts)

  
  return (
    <main>
      {/* {showPopup && <RentalProcessPopup onClose={() => setShowPopup(false)} />}
      <div className={showPopup ? "blur-sm brightness-100 pointer-events-none" : ""}> */}

        <Header />


        {/* <div className="fixed top-1/3 left-0 z-50 flex flex-col items-center gap-3">
        <div className="rotate-[-90deg] text-xs tracking-widest bg-black text-white px-2 py-1">CONTACT A STYLIST</div>
        <div className="flex flex-col gap-2 items-center">
          <button className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs">✖</button>
          <a href="#" className="text-black hover:text-gray-600">FB</a>
          <a href="#" className="text-black hover:text-gray-600">IG</a>
        </div>
      </div> */}

        {/* Hero Banner Section */}
        <section className="flex relative">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[500px]">
            <Image
              src="/assets/images/banner-01.jpg"
              alt="Model"
              fill
              className="object-cover object-top"   // 👈 align to top instead of cropping head
              quality={100}
              priority
            />

            {/* Overlay Text */}
            <div className="font-advent absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 bg-[#00000080] text-white px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 text-center font-semibold tracking-wide text-sm sm:text-base md:text-lg max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
              VIP FORMAL WEAR IS NORTH CAROLINA&apos;S AUTHORITY ON TUXEDO RENTAL.
            </div>
          </div>
        </section>

        <div className="min-h-screen bg-white">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="py-6 sm:py-8 md:py-10">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  <span className="w-6 sm:w-8 h-px bg-gray-400"></span>
                  <span className="uppercase tracking-wider font-medium">For Your Moment</span>
                </div>
                <h1 className="font-advent text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-6 sm:mb-8">
                  CREATE YOUR LOOK
                </h1>
              </div>

              {/* Main Content Grid */}
              <div className="pb-8 sm:pb-12 md:pb-16">
                {/* Responsive Layout */}
                <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-6 lg:gap-0">
                  {/* TO OWN Section */}
                  <div className="w-full lg:w-1/2 bg-[#F6F4F0] flex flex-col">
                    {/* Image Top */}
                    <div className="w-full">
                      <Image
                        src="/assets/images/image-01.png"
                        alt="Man browsing suits in wardrobe"
                        width={800}
                        height={400}
                        className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] object-cover"
                        priority
                      />
                    </div>
                    {/* Text Bottom */}
                    <div className="p-4 sm:p-6 md:p-8">
                      <h2 className="font-advent text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">TO OWN</h2>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                        Elevate your wardrobe with beautifully constructed,<br className="hidden sm:block" />
                        classic American suiting.
                      </p>
                      <Link
                        href="/all-rental?price_type=buy_price"
                        className="font-advent inline-flex items-center text-sm sm:text-base font-medium text-gray-900 hover:text-gray-700 transition-colors"
                      >
                        BUY NEW
                        <svg className="ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className='w-full lg:w-10 h-4 lg:h-auto bg-white'></div>

                  {/* TO RENT Section */}
                  <div className="w-full lg:w-1/2 flex flex-col sm:flex-row bg-white">
                    {/* Left Text Block */}
                    <div className="w-full sm:w-1/2 bg-[#F6F4F0] flex flex-col justify-center p-4 sm:p-6 md:p-8 order-2 sm:order-1">
                      <h2 className="font-advent text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">TO RENT</h2>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                        Explore tailored suits and tuxedos<br className="hidden sm:block" />
                        expertly designed for any<br className="hidden sm:block" />
                        occasion.
                      </p>
                      <Link
                        href="/all-rental?price_type=rental_price"
                        className="font-advent inline-flex items-center text-sm sm:text-base font-medium text-gray-900 hover:text-gray-700 transition-colors"
                      >
                        START RENTING
                        <svg className="ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>

                    {/* Right Image Block */}
                    <div className="w-full sm:w-1/2 order-1 sm:order-2">
                      <Image
                        src="/assets/images/image-02.jpg"
                        alt="Professional man in dark suit"
                        width={800}
                        height={600}
                        className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Popular Suits Section */}
          <section className="bg-[#BB9D7B] py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-[#FFFFFF] mb-2">
                    <span className="w-6 sm:w-8 h-px bg-white"></span>
                    <span className="tracking-wider text-white font-medium">Browse by style</span>
                  </div>
                  <h2 className="font-advent text-2xl sm:text-3xl font-semibold text-white">Popular Suits & Tuxedos</h2>
                </div>

                {/* Navigation Arrows */}
                <div className="flex space-x-2 self-start sm:self-auto">
                  <motion.button
                    onClick={() => {
                      setPrevIndex(currentIndex);
                      setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
                    }}
                    disabled={currentIndex === 0}
                    className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
                  >
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
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setPrevIndex(currentIndex);
                      setCurrentIndex((prev) =>
                        prev + itemsPerPage >= suitProducts.length ? prev : prev + itemsPerPage
                      );
                    }}
                    disabled={currentIndex + itemsPerPage >= suitProducts.length}
                    className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
                  >
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
                  </motion.button>
                </div>
              </div>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {loading ? (
                  <p className="text-white col-span-4 text-center">Loading...</p>
                ) : visibleProducts.length === 0 ? (
                  <p className="text-white col-span-4 text-center">No products available</p>
                ) : (
                  visibleProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-[#BB9D7B] border border-[#DBB589] overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-[3/4] relative">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover cursor-pointer" 
                          onClick={()=>{
                            router.push(`/all-rental/${product.name}?category=formalwear&id=${product.id}&price_type=rental_price`);
                          }}
                        />
                        {product.brand === "Kenneth Cole" && (
                          <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                            <span className="bg-black text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                              {product.brand.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-advent font-bold text-white mb-1 text-sm sm:text-base">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#FFFFFF]">
                          Starts at {product.price}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </section>

          <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="text-center py-12 sm:py-16 px-4">
              <h1 className="font-advent text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Trust us for your vip Formal Wear needs
              </h1>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                There&apos;s a reason men trust us! We offer style and selection with a price that fits
                every occasion and budget.
              </p>
            </div>

            {/* Three Column Features Section */}
            <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
                {/* Style is in the Details */}
                <div className="text-center px-2 sm:px-6 py-6 sm:py-8 border border-[#BB9D7B] rounded">
                  <h3 className="font-advent text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide ">
                    STYLE IS IN THE DETAILS
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Tuxedo rentals are an often underappreciated part of
                    weddings, prom, and other special occasions. Instead of
                    settling for something that works, find the perfect
                    tuxedo or suit that complements your style and gives
                    you a presence.
                  </p>
                </div>

                {/* Outstanding Service */}
                <div className="text-center px-2 sm:px-6 py-6 sm:py-8 border border-[#BB9D7B] rounded">
                  <h3 className="font-advent text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">
                    OUTSTANDING SERVICE
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    The convenience of a local tuxedo rental shop cannot
                    be overstated. At VIP Formal Wear, inventory is within
                    reach and can be delivered the same day for customers
                    in the Raleigh area.
                  </p>
                </div>

                {/* Convenient Locations */}
                <div className="text-center px-2 sm:px-6 py-6 sm:py-8 border border-[#BB9D7B] rounded">
                  <h3 className="font-advent text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">
                    CONVENIENT LOCATIONS
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    VIP&apos;s two convenient locations in Raleigh, Greensboro,
                    and Winston-Salem offer the best tuxedo rental services
                    and prices available. Unlike many large retailers who
                    charge extra delivery and sizing fees, VIP Formal Wear
                    offers truly customer-first service.
                  </p>
                </div>
              </div>

              {/* Get Started Button */}
              <div className="text-center mb-16 sm:mb-20">
                <button 
                  className="font-advent font-semibold rounded-md px-8 sm:px-12 py-2.5 sm:py-3 border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-200  tracking-wide text-sm sm:text-base">
                  Get Started
                </button>
              </div>
                   {/* How It Works Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
                {/* Left Column - Process Steps */}
                <div>
                  <div className="flex items-center mb-6 sm:mb-8">
                    <span className="w-8 sm:w-12 h-px bg-[#000000] mr-3 sm:mr-4"></span>
                    <span className="text-xs sm:text-sm text-[#000000] tracking-wider">How It Works</span>
                  </div>

                  <h2 className="font-advent text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 sm:mb-12">
                    Our rental process is simple
                  </h2>

                  {/* Step 1 */}
                  <div className="mb-6 sm:mb-8 relative border border-[#BB9D7B] rounded-sm p-3 sm:p-4">
                    <div className="flex items-start flex-col sm:flex-row">
                      <div className="text-4xl sm:text-6xl font-light text-gray-200 mb-2 sm:mb-0 sm:mr-4 lg:mr-6 order-1 sm:order-1">01</div>
                      <div className="order-2 sm:order-2 sm:pt-2">
                        <h3 className="font-advent text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                          Find us and choose your style
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                          Find the nearest VIP Formalwear location to you! Call for an
                          appointment to stop by and browse.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="mb-6 sm:mb-8 relative border border-[#BB9D7B] rounded-sm p-3 sm:p-4">
                    <div className="flex items-start flex-col sm:flex-row">
                      <div className="order-1 sm:order-2 sm:pt-2 mb-2 sm:mb-0">
                        <div className="flex justify-between items-start mb-2 sm:mb-3">
                          <h3 className="font-advent text-base sm:text-lg font-semibold text-gray-900">Get fitted</h3>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                          Two to three months ahead of the event, stop in to be measured.
                          We measure you in-house for an exact fit and out-of-town
                          groomsmen call measurements in.
                        </p>
                      </div>
                      <div className="text-4xl sm:text-6xl font-light text-gray-200 order-2 sm:order-1 sm:mr-4 lg:mr-6">02</div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="mb-6 sm:mb-8 relative border border-[#BB9D7B] rounded-sm p-3 sm:p-4">
                    <div className="flex items-start flex-col sm:flex-row">
                      <div className="text-4xl sm:text-6xl font-light text-gray-200 mb-2 sm:mb-0 sm:mr-4 lg:mr-6 order-1 sm:order-1">03</div>
                      <div className="order-2 sm:order-2 sm:pt-2">
                        <h3 className="font-advent text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                          Pickup your tuxedos
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                          Your tuxedos are available for pick-up two days before the big day.
                          Try your tux on to make sure it&apos;s perfect!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="mb-6 sm:mb-8 relative border border-[#BB9D7B] rounded-sm p-3 sm:p-4">
                    <div className="flex items-start flex-col sm:flex-row">
                      <div className="order-1 sm:order-2 sm:pt-2 mb-2 sm:mb-0">
                        <div className="flex justify-between items-start mb-2 sm:mb-3">
                          <h3 className="font-advent text-base sm:text-lg font-semibold text-gray-900">Return your tuxedos</h3>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                          Your tuxes are due back by the end of the next business day.
                          We do allow multiple returns by one person!
                        </p>
                      </div>
                      <div className="text-4xl sm:text-6xl font-light text-gray-200 order-2 sm:order-1 sm:mr-4 lg:mr-6">04</div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Promotional Card */}
                <div className="relative mt-8 lg:mt-0">
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    {/* Background Image */}
                    <div className="relative h-80 sm:h-96 lg:h-[400px] xl:h-[770px] bg-gray-800">
                      <Image
                        src="/assets/images/image-07.jpg"
                        alt="Man in formal suit with burgundy tie"
                        width={400}
                        height={900}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white">
                        <h3 className="font-advent text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                          Get 50% OFF on first class suits
                        </h3>

                        <form onSubmit={handleSubscribe} className="space-y-3 sm:space-y-4">
                          <div>
                            <label className="block text-xs sm:text-sm mb-2">
                              Enter your email to subscribe*
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-white border border-gray-600 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                                placeholder="Your email address"
                                required
                              />
                              <button
                                type="submit"
                                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#BB9D7B] hover:bg-[#BB9D7B] text-white font-medium rounded-md sm:rounded-r-md sm:rounded-l-none transition-colors duration-200 text-sm"
                              >
                                Subscribe
                              </button>
                            </div>
                          </div>
                        </form>

                        <p className="text-xs text-gray-300 mt-3 sm:mt-4">
                          *Use code Classic at checkout through 4/30. Exclusions apply.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="flex flex-col lg:flex-row w-full min-h-[80vh] bg-[#f9f5f2]">
              {/* Left Image */}
              <div className="relative w-full lg:w-1/2 h-[400px] lg:h-auto">
                <Image
                  src="/assets/images/image-08.jpg"
                  alt="Wedding Couple"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Right Content */}
              <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10 lg:py-0 w-full lg:w-1/2">
                <p className="text-sm uppercase tracking-wide mb-2 text-[#000000]">
                  Forever Moments
                </p>
                <h1 className="font-advent text-4xl sm:text-5xl font-bold leading-tight text-gray-900 mb-4">
                  We Make Weddings Look Good
                </h1>
                <p className="text-[#000000] mb-6 max-w-lg">
                  Your wedding day deserves to be filled with joy, not anxiety about how
                  you look. We&apos;ll help you enjoy your moment.
                </p>
                <button className="bg-[#d4a077] text-white font-medium px-6 py-3 rounded hover:bg-[#c28f6e] transition-colors">
                  Outfit Your Wedding Party
                </button>
              </div>
            </section>
            {/* Background decorative elements - Hidden on mobile for better performance */}
            <div className="hidden lg:block fixed top-0 right-0 w-96 h-96 opacity-5 pointer-events-none">
              <div className="w-full h-full rounded-full border-4 border-gray-300"></div>
            </div>
            <div className="hidden lg:block fixed bottom-0 left-0 w-64 h-64 opacity-5 pointer-events-none">
              <div className="w-full h-full rounded-full border-4 border-gray-300"></div>
            </div>
          </div>
        </div>

         <Footer />

          {/* </div> */}
    </main>
  );
}

