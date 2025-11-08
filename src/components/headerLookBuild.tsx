import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Edit, LogOut, User } from "lucide-react";

interface UserInfo {
  name: string;
  event: string;
  avatarUrl?: string;
}

interface HeaderProps {
  title: string;
  breadcrumbs?: string[];
  userInfo?: UserInfo;
  showEdit?: boolean;
}

const HeaderLookBuilder: React.FC<HeaderProps> = ({
  title,
  breadcrumbs,
  userInfo,
  showEdit = true,
}) => {
  const [openUserProfile, setOpenUserProfile] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenUserProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <header className="bg-[#F0F0F0] border-b border-gray-300 px-4 sm:px-6 py-3 sm:py-4 ">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        {/* LEFT SIDE */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1 font-advent">
            {title}
          </h1>
          <nav className="flex flex-wrap items-center space-x-2 text-sm text-gray-600">
            {breadcrumbs?.map((item, index) => (
              <React.Fragment key={index}>
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? "text-gray-900"
                      : "hover:text-gray-900 cursor-pointer"
                  }
                >
                  {item}
                </span>
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* RIGHT SIDE (User Info) */}
        {userInfo && (
          <div className="flex flex-col items-start sm:items-end">
            {/* 🔥 WRAP avatar + dropdown in relative */}
            <div className="relative inline-block" ref={dropdownRef}>
              {/* Avatar + Name */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setOpenUserProfile((prev) => !prev);
                }}
              >
                {/* Avatar */}
                {userInfo.avatarUrl ? (
                  <img
                    src={userInfo.avatarUrl}
                    alt={userInfo.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2a5 5 0 100 10 5 5 0 000-10zm-7 18a7 7 0 0114 0H5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Name */}
                <span className=" font-advent text-sm font-semibold text-gray-900">
                  {userInfo.name}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>

              {/*Profile Dropdown */}
              {openUserProfile && (
                <div className="absolute right-0 top-full mt-1 w-32 sm:w-32 rounded-md shadow-lg bg-[#F0F0F0] z-50">
                  <div
                    className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200"
                    // onClick={() => router.push("/profile")}
                  >
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">Profile</span>
                  </div>
                  <div
                    className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200"
                    // onClick={}
                  >
                    <LogOut className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">Logout</span>
                  </div>
                </div>
              )}
            </div>

            {/* Event (Date) */}
            <div className="flex items-center gap-1 mt-1 sm:mt-0 ">
              <span className="text-[#000000] text-xs font-semibold font-advent">{userInfo.event}</span>
              {showEdit && (
                <Edit className="w-3 h-3 text-[#000000] cursor-pointer hover:text-gray-700" />
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderLookBuilder;
