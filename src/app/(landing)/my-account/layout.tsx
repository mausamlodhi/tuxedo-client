"use client";
import { selectActiveSidebar, setActiveSidebar } from "@/app/redux/slice/auth.slice";
import BreadcrumbCustom from "@/components/breadcrumbCustom";
import Footer from "@/components/footer";
import Header from "@/components/header";
import SidebarAccount from "@/components/sidebarMyaccount";
import logger from "@/utils/logger";
import { useDispatch, useSelector } from "react-redux";
import DashboardPage from "./page";
import EventPage from "./event/page";
import ContactInfoPage from "./contact-info/page";
import ChangePasswordPage from "./change-password/page";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {

 const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const selectedSidebar = useSelector(selectActiveSidebar);
  const router = useRouter();

  
  const tab = searchParams.get("tab");

//  useEffect(()=>{
//   return ()=>{
//     if(tab){
//       dispatch(setActiveSidebar("events"));
//     }else
//     dispatch(setActiveSidebar("dashboard"));
//   }
//  },[dispatch]);

  const childrenelemet = () => {
    switch (selectedSidebar) {
      case "dashboard":
        return <DashboardPage />;
      case "events":
        return <EventPage />;
      case "contact-info":
        return <ContactInfoPage />;
      case "change-password":
        return <ChangePasswordPage />;
      default:
        return <>Nothing</>;
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BreadcrumbCustom
        title="MY ACCOUNT"
        items={[{ label: "Home", href: "/" }, { label: "MY ACCOUNT" }]}
      />
      <div className="flex flex-1 mt-12 mb-20 gap-8 px-4 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="hidden lg:block flex-shrink-0">
          <SidebarAccount />
        </div>
        <main className="flex-1 min-w-0 w-full">{childrenelemet()}</main>
      </div>
      <Footer />
    </div>
  );
}
