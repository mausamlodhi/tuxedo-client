'use client'
import Header from "@/components/admin/header";
import SideBar from "@/components/admin/sidebar";
import { selectAuthData } from "../../redux/slice/auth.slice";
import { useSelector } from "react-redux";

const AdminLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const authData = useSelector(selectAuthData);
    const theme = authData?.admin?.theme;
    return <>
        <div className={`min-h-screen ${theme?'bg-[#0000000F]':'bg-gray-800'}`}>
            <div className=" lg:ml-62 ">
                <div className="">
                    <Header />
                </div>
                <SideBar />
                {children}
            </div>
        </div>
    </>
}

export default AdminLayout;