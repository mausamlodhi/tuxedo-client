'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, X, Phone, MapPin } from 'lucide-react';
import React, { JSX } from 'react';

export default function Footer(): JSX.Element {
  const companyLinks: {label: string; href: string}[] = [
   {label: 'Home', href: '/'},
   {label: 'About', href: '/about'},
   {label: 'Locations', href: '/location'},
   { label: 'Contact Us', href: '/contact' },
   { label: 'Terms & Conditions', href: '/' },
   { label: 'Privacy Policy', href: '/' },
  ];

  const styleLinks: string[] = [
    'Tuxedos',
    'Vests',
    'Ties',
    'Shirts',
    'Shoes',
    'Weddings',
    'Quinceanera',
    'Prom',
    'Graduation',
    'Black Tie Events',
    'Suit Rental',
  ];

  return (
    <footer className="bg-black text-white text-sm font-light">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Logo & Description */}
        <div className="col-span-1">
           <Link href="/" >
          <Image
            src="/assets/SVG/icons/footer-logo.png"
            alt="VIP Formalwear Logo"
            width={60}
            height={80}
            className="object-cover opacity-80"
          />
          </Link>
          <p className="mb-4 leading-relaxed mt-4">
            Quisque eleifend eu dolor a pulvinar. Vestibulum auctor dolor justo,
            a dignissim orci rutrum a. Integer finibus mauris risus.
          </p>

          {/* Follow Us Links */}
          <div className="mt-4">
            <h3 className="font-advent font-semibold text-base mb-3 ">
              Follow Us
            </h3>
            <div className="flex space-x-4  text-black">
              <X className="w-5 h-5 hover:text-gray-400 bg-white cursor-pointer" />
              <Facebook className="w-5 h-5 hover:text-gray-400 bg-white cursor-pointer" />
              <Instagram className="w-5 h-5 hover:text-gray-400 bg-white cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Company Links */}
        <div className="col-span-1">
          <h3 className="font-advent font-semibold text-base mb-3">Company</h3>
          <ul className="space-y-2">
            {companyLinks.map((item) => (

              <li key={item.label}>
                <Link href={item.href} className="hover:text-gray-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Styles Links */}
        <div className="col-span-1">
          <h3 className="font-advent font-semibold text-base mb-3">Styles</h3>
          <ul className="space-y-2">
            {styleLinks.map((item: string) => (
              <li key={item}>
                <Link href="#" className="hover:text-gray-300">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Talk To Us */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <h3 className="font-advent font-semibold text-base mb-3">Talk to us</h3>
          <p className="mb-4 leading-relaxed">
            Come into one of our stores. Our expert stylists are here to help you
            find a smart, personalized look at a price that suits you.
          </p>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 mt-1" />
              <span>3801 S. Wilmington Street Raleigh, NC 27603</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>919.772.7200</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="text-center text-xs border-t border-gray-800 py-4 px-4">
        © {new Date().getFullYear()} vipformalwear | All Rights Reserved
      </div>
    </footer>
  );
}
