"use client";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  setActiveSidebar,
  selectActiveSidebar,
  logoutAction,
} from "@/app/redux/slice/auth.slice";
import { AdminAuthServices } from "@/servivces/admin/auth/auth.service";
import { deleteCookie } from "cookies-next";
import { CUSTOMER_ROLE, TOKEN_KEY } from "@/utils/env";
import { removeLocalStorageToken } from "@/utils";
import modalNotification from "@/utils/notification";

interface MenuItem {
  key: string;
  label: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "/assets/SVG/icons/dashd1.svg",
  },
  { key: "events", label: "Events", icon: "/assets/SVG/icons/dash2.svg" },
  {
    key: "contact-info",
    label: "Contact Info",
    icon: "/assets/SVG/icons/dash3.svg",
  },
  {
    key: "change-password",
    label: "Change Password",
    icon: "/assets/SVG/icons/dash4.svg",
  },
  { key: "logout", label: "Log-out", icon: "/assets/SVG/icons/dash5.svg" },
];

const SidebarAccount = () => {
  const dispatch = useDispatch();
  const active = useSelector(selectActiveSidebar);
  const router = useRouter();
  const handleClick = (key: string) => {
    if (key === "logout") {
      AdminAuthServices.adminLogout();
      deleteCookie(TOKEN_KEY);
      deleteCookie(CUSTOMER_ROLE)
      dispatch(logoutAction())
      removeLocalStorageToken();
      router.push("/");
      modalNotification({
        message: 'Logged out successfully',
        type: 'success'
      })
    } else {
      dispatch(setActiveSidebar(key));
    }
  };
  return (
    <aside className="w-64 bg-white border border-gray-300 rounded-sm shadow">
      <div className="pt-3">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleClick(item.key)}
              className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${active === item.key
                  ? "bg-[#D6A680] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
                className={`object-contain transition ${active === item.key ? "brightness-0 invert" : "opacity-60"
                  }`}
              />
              <span className="font-medium font-advent">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarAccount;
