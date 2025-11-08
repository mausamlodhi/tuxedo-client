'use client';

import { useSelector } from "react-redux";
import { selectAuthData } from "@/app/redux/slice/auth.slice";
import ActiveOrders from "@/components/admin/activeOrders";
import AddProductButton from "@/components/admin/addProducts";
import SalesStatistics from "@/components/admin/salesStatistics";
import StatsCards from "@/components/admin/statsCards";
import TopProducts from "@/components/admin/topProducts";
import { DashboardServices } from "@/servivces/admin/dashboard/dashboard.services";
import {useEffect, useState } from "react";
import logger from "@/utils/logger";
import modalNotification from "@/utils/notification";

const Dashboard: React.FC = () => {
  const authData = useSelector(selectAuthData);
  const theme = authData?.admin?.theme;
 
  const [customerData , setCustomerData] = useState<any>(null);
 
  const handleAddProduct = () => {
    console.log('Navigate to add product page');
    // Add your navigation logic here
  };


  const getCustomerData = async () => {
    try {
      const res = await DashboardServices.getTotalCustomers({});
      setCustomerData(res);
      if(res.status){
       
      }
      else {
     
      modalNotification({
        message: res?.message || "Failed to get customer details",
        type: "error",
      });
    }
     
    } catch (error) {
       modalNotification({
      message: error.message || "Something went wrong. Please try again later.",
      type: "error",
    });
      logger(error as any, "");
     
    }
  };

   useEffect(()=>{
    getCustomerData();
    
    
   },[])

  return (
    <>
      <div className='flex flex-col lg:flex-row px-8'>
        <h1 className={`${theme ? "text-[#313A46]" : "text-[#C1C1C1]"} text-xl sm:text-2xl md:mt-14 font-semibold hidden sm:block`}>Dashboard</h1>

        <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10  flex ml-auto">
          <AddProductButton
            theme={theme}
            className="h-10"
            onClick={handleAddProduct} />
        </div>

      </div>
      <main className="p-4 sm:p-6 lg:p-8">

        {/* Top Section - Stats Cards and Add Product Button */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex-1">
            <StatsCards
              theme={theme}
              customerData={customerData}

            />
          </div>

        </div>

        {/* Bottom Section - Sales Statistics and Top Products */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Sales Statistics - Takes 2/3 width on xl screens */}
          <div className="xl:col-span-2">
            <SalesStatistics
              theme={theme}
            />
          </div>

          {/* Top Products - Takes 1/3 width on xl screens */}
          <div className="xl:col-span-1">
            <TopProducts 
              theme={theme}
               customerData={customerData}
            />
          </div>
        </div>

        <div className="w-full">
          <ActiveOrders
            theme={theme}
          />
        </div>

      </main>
    </>
  );
};

export default Dashboard;