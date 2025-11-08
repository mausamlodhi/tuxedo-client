"use client";

import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface ShopLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

const center = {
  lat: 37.7936,
  lng: -122.4011,
};

const shops: ShopLocation[] = [
  { id: 1, name: "Shop 1", lat: 37.7936, lng: -122.4011 },
  { id: 2, name: "Shop 2", lat: 37.781, lng: -122.41 },
];

const ShopMap = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
        {shops.map((shop) => (
          <Marker
            key={shop.id}
            position={{ lat: shop.lat, lng: shop.lng }}
            title={shop.name}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              // scaledSize: new window.google.maps.Size(40, 40), // clean scaling
              // origin: new window.google.maps.Point(0, 0),
              // anchor: new window.google.maps.Point(20, 40), // centers marker bottom
            }}
          />

        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default ShopMap;
