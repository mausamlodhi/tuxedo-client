'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Menu,  X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectAuthData } from '@/app/redux/slice/auth.slice';
import { attributeIcon, bestSellingWear, CategoryIcon, collectionIcon, customerManagementIcon, dashBoardIcon, invoiceIcon,  LeadIcon,  orderIcon, settingsIcon, UsersIcon, } from '@/utils/icons';

interface MenuItem {
  label: string;
  icon: any; // path in public folder
  path?: string;
  children?: { label: string; path: string, icon: any }[];
}

interface SideBarProps {
  className?: string;
}

const SideBar: React.FC<SideBarProps> = ({ className = "" }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const authData = useSelector(selectAuthData);
  const theme = authData?.admin?.theme; // true = light theme, false = dark

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const getIconColor = (isActive: boolean) => {
    if (theme) {
      // Light theme
      return isActive ? "#006FCF" : "#2D333C";
    } else {
      // Dark theme
      return isActive ? "#FFFFFF" : "#9097A7";
    }
  };

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: dashBoardIcon, path: '/vipadmin/dashboard' },
    { label: 'Category', icon: CategoryIcon, path: '/vipadmin/category' },
    { label: 'Best Selling Formal Wear', icon: bestSellingWear, path: '/vipadmin/best-selling-formalwear'},
    {
      label: 'Customer Management',
      icon: customerManagementIcon,
      children: [
        { label: 'Customers', path: '/vipadmin/customer-management', icon: UsersIcon },
        { label: 'Leads', path: '/vipadmin/leads', icon:  LeadIcon },
      ],
    },
    { label: 'Collections', icon: collectionIcon, path: '/vipadmin/collections' },
    {
      label: 'Orders',
      icon: orderIcon,
      children: [
        { label: 'All Orders', path: '#', icon: "" },
        { label: 'Pending', path: '#', icon: "" },
      ],
    },
    {
      label: 'Attributes',
      icon: attributeIcon,
      children: [
        { label: 'Sizes', path: '#', icon: "" },
        { label: 'Colors', path: '#', icon: "" },
      ],
    },
    {
      label: 'Invoice',
      icon: invoiceIcon,
      children: [
        { label: 'Invoices', path: '#', icon: "" },
        { label: 'Drafts', path: '#', icon: "" },
      ],
    },
    { label: 'Settings', icon: settingsIcon, path: '#' },
  ];


  const darkColors = {
    sidebarBg: "bg-[#313A46]",
    hoverBg: "hover:bg-[#353B48]",
    activeBg: "bg-[#353B48]",
    text: "text-gray-400",
    activeText: "text-white",
    border: "border-white",
  };

  const lightColors = {
    sidebarBg: "bg-white",
    hoverBg: "hover:bg-gray-100",
    activeBg: "bg-gray-100",
    text: "text-gray-700",
    activeText: "text-[#006FCF]",
    border: "border-[#006FCF]",
  };

  const themeColors = theme ? lightColors : darkColors;

  const SideBarContent = () => (
    <div className={`h-full flex flex-col overflow-y-auto scrollbar-thin  ${theme ? "bg-white text-gray-700 scrollbar-light": "bg-[#313A46] text-gray-400 scrollbar-dark "}`}>
      {/* Logo */}
      <div className="p-6  ">
        <div className="flex items-center ms-14 space-x-2">
          {theme ? (
            <Image src="/assets/SVG/icons/logo.svg" alt="Logo" width={80} height={90} />
          ) : (
            <Image src="/assets/SVG/icons/footer-logo.png" alt="Logo" width={80} height={90} />
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className={`flex-1 ms-2 me-2 py-4  ${themeColors.sidebarBg} transition-colors`}>
        {menuItems.map((item, index) => {
          const isActive =
            pathname === item.path || item.children?.some((c) => c.path === pathname);
          const isExpanded = expandedItems.includes(item.label);
          const hasChildren = !!item.children;

          // dynamically set icon color
          const iconColor = getIconColor(!!isActive);

          return (
            <div key={index}>
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-colors ${isActive
                      ? `${themeColors.activeText} font-medium border-l-4 ${themeColors.border} ${themeColors.activeBg}`
                      : `${themeColors.text} ${themeColors.hoverBg}`
                      }`}
                  >
                    <div className="flex cursor-pointer items-center space-x-3">
                      {item.icon(iconColor)}
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={14} className={isActive ? themeColors.activeText : themeColors.text} />
                    ) : (
                      <ChevronDown size={14} className={isActive ? themeColors.activeText : themeColors.text} />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="ml-10 mt-2 space-y-2">
                      {item.children?.map((child, cIndex) => {
                        const isChildActive = pathname === child.path;
                        return (
                          <Link
                            key={cIndex}
                            href={child.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center space-x-3 rounded px-2 py-1 transition-colors ${isChildActive
                                ? `${themeColors.activeBg} ${themeColors.activeText}`
                                : themeColors.text
                              }`}
                          >
                            
                            {child.icon && (
                              typeof child.icon === "function"
                                ? child.icon(getIconColor(isChildActive)) // lucide-react style
                                : <span className={`w-4 h-4 ${isActive
                      ? `${themeColors.activeText} font-medium border-l-2 ${themeColors.border} ${themeColors.activeBg}`
                      : `${themeColors.text} ${themeColors.hoverBg}`
                      }`}>{child.icon}</span> // public svg/img
                            )}
                            <span className="text-sm">{child.label}</span>
                          </Link>
                        );
                      })}

                      

                    </div>

                    
                  )}
                </>
              ) : (
                <Link
                  href={item.path || "#"}
                  onClick={() => setIsMobileOpen(false)}   
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${isActive
                    ? `${themeColors.activeText} font-medium border-l-4 ${themeColors.border} ${themeColors.activeBg}`
                    : `${themeColors.text} ${themeColors.hoverBg}`
                    }`}
                >
                  {item.icon(iconColor)}
                  <span className="text-sm">{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}

      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className={`lg:hidden absolute top-5 -ml-3 z-50 p-2 md:p-2 
    ${theme ? "bg-white text-gray-800" : "bg-gray-800 text-white"} 
    rounded-md cursor-pointer transition-all duration-300
    ${isMobileOpen ? "left-52" : "left-4"}`}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>



      {/* Desktop Sidebar */}
      <div className={`hidden lg:block w-64 h-screen fixed left-0 top-0 z-40 ${className}`}>
        <SideBarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className={`fixed top-0 left-0 w-64 h-full transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
            <SideBarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;



