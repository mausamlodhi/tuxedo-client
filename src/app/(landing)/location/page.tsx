"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Clock } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { locations } from "@/utils/constant";
import Breadcrumb from "@/components/breadcrumb";

// // Location data
// const locations = [
//   {
//     id: 'winston-salem',
//     name: 'Winston-Salem—Hanes Mall',
//     address: 'VIP Formal Wear 3320 Silas Creek Pkwy',
//     city: 'Winston-Salem',
//     state: 'NC',
//     zip: '27103',
//     description: 'Looking for a Winston-Salem tuxedo specialist? You\'ve come to the right place. Located in Hanes Mall, VIP Formal Wear carries a wide selection of tuxedo designers so you can choose the perfect look for your next event.',
//     location: 'Hanes Mall\nLower Level Next to Belk',
//     hours: {
//       weekdays: 'Monday through Saturday: 11am-8pm',
//       sunday: 'Sunday: 12pm-6pm'
//     },
//     phone: '336-760-2205',
//     coordinates: { lat: 35.77909, lng: -78.62989 }
//   },
//   {
//     id: 'raleigh',
//     name: 'Raleigh—Crabtree Valley Mall',
//     address: '  VIP Formal Wear 4325 Glenwood Ave Suite 1042',
//     city: 'Raleigh',
//     state: 'NC',
//     zip: '27612',
//     description: 'VIP Formal Wear is Crabtree Valley Mall’s tuxedo specialist. We’re your one-stop shop for all your North Raleigh formal wear needs. Our skilled tuxedo specialists will help you prepare for your next formal event down to the last detail. ',
//     location: 'Crabtree Valley Mall\nLower Level across from Panera Bread',
//     hours: {
//       weekdays: 'Monday through Saturday: 11am-8pm',
//       sunday: 'Sunday: 12pm-7pm'
//     },
//     phone: '919-787-6011',
//     coordinates: { lat: 35.88972, lng: -78.656561 }
//   },
//   {
//     id: 'garner-area',
//     name: 'Garner Area—South Wilmington St.',
//     address: 'VIP Formal Wear 3801 S South Wilmington Street',
//     city: 'Garner',
//     state: 'NC',
//     zip: '27603',
//     description: 'Visit our Garner Area location for premium formal wear rentals and sales. Our experienced staff will help you find the perfect tuxedo for weddings, proms, and special events.',
//     location: 'SouthPark Mall\nIntersection of 70E & 401S',
//     hours: {
//       weekdays: 'Monday through Friday: 10am-9pm',
//       saturday: '10am-3pm',
//       sunday: 'sunday closed'
//     },
//     phone: '704-552-7848',
//     coordinates: { lat: 35.1582, lng: -80.8414 }
//   },
//   {
//     id: 'greensboro',
//     name: 'Greensboro—Four Seasons Town Centre',
//     address: 'VIP Formal Wear 103 Four Seasons Town Centre',
//     city: 'Greensboro',
//     state: 'NC',
//     zip: '27407',
//     description: 'VIP Formal Wear is Greensboro’s tuxedo specialist. We’re your one-stop shop for all your North Raleigh formal wear needs.O ur skilled tuxedo specialists will help you prepare for your next formal event down to the last detail.',
//     location: 'Four Seasons Town Centre\nLevel 1 Near JCPenney',
//     hours: {
//       weekdays: 'Monday through Saturday: 11am-8pm',
//       sunday: 'Sunday: 12pm-7pm'
//     },
//     phone: '336-323-1695',
//     coordinates: { lat: 36.11924, lng: -79.82839 }
//   }
// ];

const LocationCard = ({ location, onGetDirections }) => {
  return (
    <div className="bg-white rounded-lg border border-amber-200 p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">{location.name}</h2>

      <p className="text-gray-700 mb-12">{location.description}</p>

      <div className="my-12">
        <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
        <div className="whitespace-pre-line text-gray-700">
          {location.location}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">
        {/* Address and Directions */}
        <div className="mb-8">
          <div className="flex items-start mb-4">
            <MapPin className="h-8 w-8 black-1 mr-3 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">
                {location.address}
              </div>
              <div className="text-gray-600">
                {location.city}, {location.state} {location.zip}
              </div>
            </div>
          </div>

          <button
            onClick={() => onGetDirections(location)}
            className=" px-6 py-2 font-medium border hover:bg-[#DBB589] hover:text-white transition-colors cursor-pointer"
          >
            DIRECTIONS
          </button>
        </div>

        {/* Hours and Phone */}
        <div>
          <div className="flex items-start mb-4">
            <Clock className="h-8 w-8 text-black mt-1 mr-3 flex-shrink-0" />
            <div>
              <div className="text-gray-700 mb-1">
                {location.hours.weekdays}
              </div>
              <div className="text-gray-700">{location.hours.sunday}</div>
            </div>
          </div>

          <button className="  px-6 py-2 font-medium hover:bg-[#DBB589] hover:text-white transition-colors border cursor-pointer">
            {location.phone}
          </button>
        </div>
      </div>
    </div>
  );
};

const LocationsPage = () => {
  const searchParams = useSearchParams();
  const locParam = searchParams.get("loc");

  const [selectedLocation, setSelectedLocation] = useState(
    locParam || "winston-salem"
  );

  const handleLocationChange = (locationId) => {
    setSelectedLocation(locationId);
    // Smooth scroll to the location content
    const element = document.getElementById("location-content");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGetDirections = (location) => {
    const address = `${location.address}, ${location.city}, ${location.state} ${location.zip}`;
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, "_blank");
  };

  const currentLocation = locations.find((loc) => loc.id === selectedLocation);

  useEffect(() => {
    if (locParam) {
      setSelectedLocation(locParam);
    }
  }, [locParam]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            LOCATIONS
          </h1>

          {/* Location Selector Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationChange(location.id)}
                className={`px-6 py-3 font-medium transition-colors ${
                  selectedLocation === location.id
                    ? "bg-[#DBB589] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                } cursor-pointer`}
              >
                {location.city}
              </button>
            ))}
          </div>
        </div>

        {/* Location Content */}
        <div id="location-content" className="max-w-4xl mx-auto">
          {currentLocation && (
            <LocationCard
              location={currentLocation}
              onGetDirections={handleGetDirections}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LocationsPage;
