import React from 'react';
import { Eye, Trash2 } from 'lucide-react';

interface Order {
  orderId: string;
  itemPhoto: string;
  productName: string;
  orderDate: string;
  customerName: string;
  eventDate: string;
  orderStatus: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
}

interface OrderRowProps {
  order: Order;
  theme:boolean | object;
  onView: (orderId: string) => void;
  onDelete: (orderId: string) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, onView, onDelete,theme }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return "bg-yellow-600";
      case 'confirmed':
        return "bg-blue-600";
      case 'delivered':
        return  "bg-green-600";
      case 'cancelled':
        return 'bg-red-400 ';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <tr className={`${theme?"hover:bg-[#0000000F] text-[#2D333C] border-[#C1C1C1]":"hover:bg-[#2D333C] border-[#0000000F] text-[#C1C1C1]"}  transition-colors border-b-2`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
        {order.orderId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-600">
          <img
            src={order.itemPhoto}
            alt={order.productName}
            className="w-full h-full object-cover"
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm max-w-xs truncate">
        {order.productName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm ">
        {order.orderDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm ">
        {order.customerName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {order.eventDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium ${getStatusColor(
            order.orderStatus
          )}`}
        >
          {order.orderStatus}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onView(order.orderId)}
             className="p-1 sm:p-2  rounded  flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-green-400/20"
            title="View Order"
          >
           <img
        src="/assets/SVG/icons/eye.svg"
        alt="View"
        className="cursor-pointer"
      />
          </button>
          <button
            onClick={() => onDelete(order.orderId)}
           className="p-1 sm:p-2 rounded  flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-red-400/20"
            title="Delete Order"
          >
            <img
        src="/assets/SVG/icons/trash.svg"
        alt="Delete"
        className="cursor-pointer"
      />
          </button>
        </div>
      </td>
    </tr>
  );
};

const ActiveOrders = ({theme}:{theme:boolean | object}) => {
  const orders: Order[] = [
    {
      orderId: '#524562',
      itemPhoto: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      productName: 'Contrast Shawl Jacket Tuxe...',
      orderDate: '04 July, 2025',
      customerName: 'Gail C. Anderson',
      eventDate: '15 July, 2025',
      orderStatus: 'Pending'
    },
    {
      orderId: '#524563',
      itemPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      productName: 'Contrast Shawl Jacket Tuxe...',
      orderDate: '04 July, 2025',
      customerName: 'Gail C. Anderson',
      eventDate: '15 July, 2025',
      orderStatus: 'Confirmed'
    },
    {
      orderId: '#524564',
      itemPhoto: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      productName: 'Contrast Shawl Jacket Tuxe...',
      orderDate: '04 July, 2025',
      customerName: 'Gail C. Anderson',
      eventDate: '15 July, 2025',
      orderStatus: 'Delivered'
    },
    {
      orderId: '#524565',
      itemPhoto: 'https://images.unsplash.com/photo-1583743089695-4b2637969ba5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      productName: 'Contrast Shawl Jacket Tuxe...',
      orderDate: '04 July, 2025',
      customerName: 'Gail C. Anderson',
      eventDate: '15 July, 2025',
      orderStatus: 'Cancelled'
    },
    {
      orderId: '#524566',
      itemPhoto: 'https://images.unsplash.com/photo-1566479179817-b46b9e23ad6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      productName: 'Contrast Shawl Jacket Tuxe...',
      orderDate: '04 July, 2025',
      customerName: 'Gail C. Anderson',
      eventDate: '15 July, 2025',
      orderStatus: 'Pending'
    }
  ];

  const handleViewOrder = (orderId: string) => {
    console.log('View order:', orderId);
    // Add your view logic here
  };

  const handleDeleteOrder = (orderId: string) => {
    console.log('Delete order:', orderId);
    // Add your delete logic here
  };

  const handleViewAll = () => {
    console.log('View all orders');
    // Add your navigation logic here
  };

  return (
    <div className={`rounded-lg mt-16 p-6 ${theme?"bg-[#FFFFFF]":"bg-[#313A46]"}`}>
      {/* Header */}
      <div className="flex items-center justify-between   mb-6">
        <h3 className={`text-lg ${theme?"text-[#2D333C]":"text-[#FFFFFF]"}`}>Active Orders</h3>
        <button
          onClick={handleViewAll}
          className={`px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-colors text-sm font-medium  ${theme?"text-[#2D333C]":"text-[#FFFFFF]"}`}
        >
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className={`${theme?"bg-[#0000000F] text-[#2D333C]":"bg-[#2D333C] text-[#FFFFFF]"} text-[14px]`}>
              <th className="px-6 py-3 text-left font-medium tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left font-medium tracking-wider">
                Item Photo
              </th>
              <th className="px-6 py-3 text-left font-medium tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left font-medium tracking-wider">
                Order Date
              </th>
              <th className="px-6 py-3 text-left font-medium tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left font-medium tracking-wider">
                Event Date
              </th>
              <th className="px-6 py-3 text-left font-medium tracking-wider">
                Order Status
              </th>
              <th className="px-6 py-3 text-left font-medium tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {orders.map((order, index) => (
              <OrderRow
                theme={theme}
                key={index}
                order={order}
                onView={handleViewOrder}
                onDelete={handleDeleteOrder}
              />
            ))}
          </tbody>
        </table>
      </div>

      
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default ActiveOrders;