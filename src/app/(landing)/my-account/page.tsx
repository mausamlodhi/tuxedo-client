// "use client";

// import React from "react";

// import Image from "next/image";
// import { useSelector } from "react-redux";
// import { selectAuthData } from "@/app/redux/slice/auth.slice";

// const DashboardPage: React.FC = () => {

//    const authData = useSelector(selectAuthData);
//   // Mock user data - replace with actual user data from your store/API
//   const userData = {
//    name: authData?.user?.firstName && authData?.user?.lastName
//     ? `${authData.user.firstName} ${authData.user.lastName}`
//     : authData?.user?.firstName || authData?.user?.lastName || "John Doe",
//     email: authData?.user.email || "johndoe@email.com",
//     significantOther: authData?.user.significantOther || "N/A",
//     phone: authData?.user.phone || "+202-555-0176",
//   };

//   const orderStats = [
//     {
//       icon: "/assets/SVG/icons/to.svg",
//       count: "26",
//       label: "Total Orders",
//       bgColor: "bg-blue-50",
//       borderColor: "border-blue-200",
//     },
//     {
//       icon: "/assets/SVG/icons/po.svg",
//       count: "05",
//       label: "Pending Orders",
//       bgColor: "bg-orange-50",
//       borderColor: "border-orange-200",
//     },
//     {
//       icon: "/assets/SVG/icons/co.svg",
//       count: "21",
//       label: "Completed Orders",
//       bgColor: "bg-green-50",
//       borderColor: "border-green-200",
//     },
//   ];

//   return (
//     <div className="w-full max-w-4xl mx-auto">
//       {/* Welcome Header */}
//       <div className="mb-8">
//         <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-advent mb-2 whitespace-nowrap">
//         Hello, {userData.name.charAt(0).toUpperCase() + userData.name.slice(1)}
//         </h2>
//         <p className="text-sm text-gray-600 font-Marcellus">
//           From your account dashboard, you can easily check & view your{" "}
//           <span className="text-[#D99E46] font-normal">Recent Orders</span>,
//           manage your{" "}
//           <span className="text-[#D99E46] font-normal">Password</span> and{" "}
//           <span className="text-[#D99E46] font-normal">Account Details</span>.
//         </p>
//       </div>

//       {/* Cards section */}
//       <div className="max-w-3xl">
//         <div className="flex flex-col lg:flex-row gap-6">

//           <div className="max-w-md w-full">
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h2 className="text-lg font-semibold text-gray-900 font-advent mb-6">
//                 ACCOUNT INFO
//               </h2>

//               <div className="space-y-3">

//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">

//                    {authData?.user?.image ? (
//                                   <Image
//                                     src={authData.user.image}
//                                     alt="User"
//                                     width={24}
//                                     height={24}
//                                     className="rounded-full object-cover"
//                                   />
//                                 ) : (
//                                   <Image
//                                     src="/assets/SVG/icons/user.svg"
//                                     alt="User"
//                                     width={24}
//                                     height={24}
//                                   />
//                                 )}
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-900 font-advent">
//                     {userData.name}
//                   </h3>
//                 </div>

//                 {/* Account details */}
//                 <div className="space-y-2 text-sm">
//                   <div className="flex gap-2">
//                     <span className="font-bold text-gray-900">Email:</span>
//                     <span className="text-gray-600">{userData.email}</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <span className="font-bold text-gray-900">
//                       Significant Other:
//                     </span>
//                     <span className="text-gray-600">
//                       {userData.significantOther}
//                     </span>
//                   </div>
//                   <div className="flex gap-2">
//                     <span className="font-bold text-gray-900">Phone:</span>
//                     <span className="text-gray-600">{userData.phone}</span>
//                   </div>
//                 </div>

//                 {/* Button */}
//                 <div className="pt-4">
//                   <button className="px-6 py-2 border-2 border-[#D6A680] text-[#D6A680] hover:bg-[#D6A680] hover:text-white transition-colors duration-200 font-advent font-medium">
//                     EDIT ACCOUNT
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Order Statistics */}
//           <div className="flex-1 space-y-4">
//             {orderStats.map((stat, index) => (
//               <div
//                 key={index}
//                 className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-4 flex items-center gap-4`}
//               >
//                 <div className="flex-shrink-0">
//                   <Image
//                     src={stat.icon}
//                     alt={stat.label}
//                     width={44}
//                     height={44}
//                   />
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold text-gray-900 font-advent">
//                     {stat.count}
//                   </div>
//                   <div className="text-sm text-gray-600 font-advent">
//                     {stat.label}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { loginAction, selectAuthData } from "@/app/redux/slice/auth.slice";
import { CustomerManagementServices } from "@/servivces/admin/customer/customer.service";
import modalNotification from "@/utils/notification";
import logger from "@/utils/logger";
import { Camera } from "lucide-react";

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const authData = useSelector(selectAuthData);
  // Mock user data - replace with actual user data from your store/API
  const userData = {
    firstName: authData?.user?.firstName || "",
    lastName: authData?.user?.lastName || "",
    name:
      authData?.user?.firstName && authData?.user?.lastName
        ? `${authData.user.firstName} ${authData.user.lastName}`
        : authData?.user?.firstName || authData?.user?.lastName || "N/A",
    email: authData?.user.email || "N/A",
    significantOther: authData?.user.significantOther || "N/A",
    phone: authData?.user.phone || "N/A",
    image: authData?.user?.image || "/assets/SVG/icons/user.svg",
  };

  const orderStats = [
    {
      icon: "/assets/SVG/icons/to.svg",
      count: "26",
      label: "Total Orders",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: "/assets/SVG/icons/po.svg",
      count: "05",
      label: "Pending Orders",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      icon: "/assets/SVG/icons/co.svg",
      count: "21",
      label: "Completed Orders",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.phone.match(/^[0-9+\- ]{7,15}$/))
      newErrors.phone = "Enter a valid phone number";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const handleSave = async () => {
    const validationErrors = validate();
    console.log("Validation Errors:", validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const updateData = {
      id: authData?.user?.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      image: formData.image,
      email: formData.email,
      significantOther: formData.significantOther,
    };

    try {
      const response = await CustomerManagementServices.updateCustomer(
        updateData,
        authData?.user?.id // make sure ID comes from Redux auth state
      );
      logger(response, "response on update customer");
      if (response?.status) {
        dispatch(loginAction(updateData));
        modalNotification({
          message: response?.message || "Account updated successfully",
          type: "success",
        });
      }

      setIsModalOpen(false);
    } catch (error) {
      modalNotification({
        message: "Failed to update account. Please try again.",
        type: "error",
      });
    }
  };


   useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"; // stop background scroll
    } else {
      document.body.style.overflow = ""; // restore default
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-advent mb-2 whitespace-nowrap">
          Hello,{" "}
          {userData.name.charAt(0).toUpperCase() + userData.name.slice(1)}
        </h2>
        <p className="text-sm text-gray-600 font-Marcellus">
          From your account dashboard, you can easily check & view your{" "}
          <span className="text-[#D99E46] font-normal">Recent Orders</span>,
          manage your{" "}
          <span className="text-[#D99E46] font-normal">Password</span> and{" "}
          <span className="text-[#D99E46] font-normal">Account Details</span>.
        </p>
      </div>

      {/* Cards section */}
      <div className="max-w-3xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 font-advent mb-6">
                ACCOUNT INFO
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                    {authData?.user?.image ? (
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <Image
                          src={authData.user.image}
                          alt="User"
                          width={40}
                          height={40}
                          className="object-contain object-center w-full h-full"
                        />
                      </div>
                    ) : (
                      <Image
                        src="/assets/SVG/icons/user.svg"
                        alt="User"
                        width={24}
                        height={24}
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 font-advent">
                    {userData.name}
                  </h3>
                </div>

                {/* Account details */}
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-bold text-gray-900">Email:</span>
                    <span className="text-gray-600">{userData.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-gray-900">
                      Significant Other:
                    </span>
                    <span className="text-gray-600">
                      {userData.significantOther}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-gray-900">Phone:</span>
                    <span className="text-gray-600">{userData.phone}</span>
                  </div>
                </div>

                {/* Button */}
                <div className="pt-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2 border-2 border-[#D6A680] text-[#D6A680] hover:bg-[#D6A680] hover:text-white transition-colors duration-200 font-advent font-medium"
                  >
                    EDIT ACCOUNT
                  </button>
                </div>
              </div>
              {isModalOpen && (
                <div className="fixed inset-0  flex items-center justify-center  z-50 ">
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

                  <div className="bg-white rounded-lg shadow-lg p-2 w-full max-w-md relative">
                    <h2 className="text-lg font-bold ">Edit Account</h2>

                    {/* Profile Image */}


                    <div className="relative flex flex-col items-center">
                      {/* Profile Image Wrapper */}
                      <div className="relative w-15 h-15">
                        <Image
                          src={formData.image}
                          alt="Profile"
                          width={80}
                          height={80}
                          className="rounded-full object-cover w-15 h-15"
                        />

                        {/* Camera Icon ON Image */}
                        <label
                          htmlFor="profileImageInput"
                          className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-200 transition"
                        >
                          <Camera className="w-4 h-4 text-gray-600" />
                        </label>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        id="profileImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>


                    {/* Form */}
                    <div className="space-y-2 ">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>

                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First Name"
                          className="w-full border border-[#b8875f] px-3 py-2 rounded"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-xs">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>

                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last Name"
                          className="w-full border border-[#b8875f] px-3 py-2 rounded"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-xs">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full border border-[#b8875f] px-3 py-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                      />

                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Significant Other
                      </label>

                      <input
                        type="text"
                        name="significantOther"
                        value={formData.significantOther}
                        onChange={handleChange}
                        placeholder="Significant Other"
                        className="w-full border border-[#b8875f] px-3 py-2 rounded"
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>

                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone"
                          className="w-full border border-[#b8875f] px-3 py-2 rounded"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-1 ">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border rounded text-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-[#D6A680] text-white rounded hover:bg-[#b8875f]"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Statistics */}
          <div className="flex-1 space-y-4">
            {orderStats.map((stat, index) => (
              <div
                key={index}
                className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-4 flex items-center gap-4`}
              >
                <div className="flex-shrink-0">
                  <Image
                    src={stat.icon}
                    alt={stat.label}
                    width={44}
                    height={44}
                  />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 font-advent">
                    {stat.count}
                  </div>
                  <div className="text-sm text-gray-600 font-advent">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
