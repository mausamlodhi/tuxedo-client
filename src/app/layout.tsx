import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import StoreProvider from "@/providers/store.provider";
import "./globals.css";
import 'toastr/build/toastr.min.css';
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VIP Formalwear",
  description: "VIP Formalwear web application",
  icons:{
    icon: "/assets/SVG/icons/logo.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId="820459295448-s1dp1rfq3mal5nasrolpcvjntidmgic1.apps.googleusercontent.com">
          <StoreProvider>
            {children}
          </StoreProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
