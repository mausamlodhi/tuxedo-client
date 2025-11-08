import { i } from "framer-motion/m";

interface DashboardData {
    totalCustomers: APIEndPointInterface;
    
}

const DashboardData: DashboardData = {
    totalCustomers: { 
        url: '/dashboard', 
        method: 'GET' 
    },
     }


export default DashboardData;