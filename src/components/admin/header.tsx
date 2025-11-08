'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import { Search, Sun, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { selectAuthData, toggleThemeAction, logoutAction, selectUserData } from '@/app/redux/slice/auth.slice';
import modalNotification from '@/utils/notification';
import { ADMIN_ROLE, TOKEN_KEY } from '@/utils/env';
import { removeLocalStorageToken } from '@/utils';
import {AdminAuthServices} from '@/servivces/admin/auth/auth.service';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const dispatch = useDispatch();
  const authData = useSelector(selectAuthData);
  const [theme, setTheme] = useState(false);
  const userData = useSelector(selectUserData);
  useEffect(() => {
    setTheme(authData?.admin?.theme);
  }, [authData?.admin?.theme]);
  const toggleTheme = () => {
    dispatch(toggleThemeAction(!authData.admin.theme));
  };
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleLogout = () => {
    AdminAuthServices.adminLogout();
    deleteCookie(TOKEN_KEY);
    deleteCookie(ADMIN_ROLE)
    dispatch(logoutAction())
    removeLocalStorageToken();
    router.push("/vipadmin");
    modalNotification({
      message: "Logged out successfully",
      type: "success",
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`${
        theme ? "bg-[#FFFFFF] text-gray-800" : "bg-[#2F3742] text-white"
      } ${className}`}
    >
      <div className="px-4 xs:px-2 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between">
          {/* Left Section - Search */}
          <div className="flex items-center space-x-2 flex-1">
            <div className="relative flex-1 max-w-md min-w-0 ml-7">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4  text-gray-400" />
              </div>

              <input
                type="text"
                placeholder="Search"
                className={`block w-full pl-10 h-10 pr-3 py-1 border rounded-sm
        ${
          theme
            ? "bg-[#FFFFFF] border-[#9097A7] text-[#9CA3AF]"
            : "bg-[#363F4A] border-none text-[#FFFFFF]"
        }
        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
          </div>

          {/* Right Section - Icons and User */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              className="p-1 rounded-lg cursor-pointer transition-colors"
              onClick={toggleTheme}
            >
              {theme ? (
                <Sun className="h-5 w-5 text-black" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-1 rounded-lg hover:bg-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                0
              </span>
            </button>

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              {/* Trigger */}
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">
                      {userData?.email}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Dropdown */}
              {open && (
                <div
                  className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg ${
                    theme
                      ? "bg-[#FFFFFF] text-gray-800"
                      : "bg-[#2F3742] text-white"
                  } z-50`}
                >
                  <div
                    className="px-4 py-2 flex items-center gap-2"
                    // onClick={() => router.push("/profile")}
                  >
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">Profile</span>
                  </div>
                  <div
                    className={`px-4 py-2 flex items-center gap-2 ${
                      theme ? "hover:bg-[#F3F4F6]" : "hover:bg-[#2F3742]"
                    } cursor-pointer`}
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
