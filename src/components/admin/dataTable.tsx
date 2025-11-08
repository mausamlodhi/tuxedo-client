


import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useSelector } from 'react-redux';
import { selectAuthData } from '@/app/redux/slice/auth.slice';

interface TableItem {
  id: number;
  [key: string]: any;
}

interface TableHeader {
  key: string;
  label: string;
  type?: "text" | "image" | "badge" | string;
}

interface DataTableProps {
  items: any;
  headers: TableHeader[];
  onView: (id: number) => void;
  onEdit: (data: any) => void;
  onDelete: (id: number) => void;
  showEdit?: boolean;
  showView?: boolean;
  showDelete?: boolean;
  loading?: boolean; // NEW
}

const DataTable: React.FC<DataTableProps> = ({
  items,
  headers,
  showEdit = true,
  showView = true,
  showDelete = true,
  loading = false,
  onView,
  onEdit,
  onDelete,
}) => {
  const authData = useSelector(selectAuthData);
  const theme = authData?.admin?.theme; // boolean

  const getBadgeClasses = (badgeType: string) => {
    switch (badgeType) {
      case "wedding":
        return "bg-yellow-600";
         case "pending":
        return "bg-yellow-600";
      case "single":
        return "bg-blue-600";
        case "completed":
        return "bg-blue-600";
      case "promo | confirmed":
        return "bg-green-600";
        case "confirmed":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
  className={`overflow-x-auto py-0 [&::-webkit-scrollbar]:h-1
    [&::-webkit-scrollbar-thumb]:bg-slate-500
    [&::-webkit-scrollbar-thumb]:rounded-full 
    [&::-webkit-scrollbar-track]:bg-slate-800
    ${theme 
      ? "text-[#2D333C] border border-none" 
      : "bg-grey-700 text-[#C1C1C1] border border-[#0000000F]"
    }`}
>
  <table className="min-w-[600px] w-full">
    <thead>
      <tr
        className={`${
          theme ? "bg-[#0000000F] text-[#2D333C]" : "bg-[#2D333C] text-[#FFFFFF]"
        } text-[14px]`}
      >
        {headers.map((header) => (
          <th
            key={header.key}
            className="px-6 py-3 text-left text-xs font-advent uppercase tracking-wider"
          >
            {header.label}
          </th>
        ))}
        {(showEdit || showView || showDelete) && (
          <th className="px-0 py-3 text-left text-xs font-advent uppercase tracking-wider">
            Action
          </th>
        )}
      </tr>
    </thead>

    <tbody>
      {items.map((item:any) => (
        <tr
          key={item.id}
          className={`transition-colors border-b-1 ${
            theme
              ? "bg-[#FFFFFF] hover:bg-[#0000000F] text-[#2D333C] border-[#C1C1C1]"
              : "hover:bg-[#2D333C] text-[#C1C1C1] border-[#C1C1C1]"
          }`}
        >
          {headers.map((header) => {
            switch (header.type) {
              case "image":
                return (
                  <td key={header.key} className="px-6 py-4">
                    <div className="w-8 h-8 overflow-hidden rounded bg-gray-600">
                      <img
                        src={item[header.key]}
                        alt={item.description || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                );
              case "badge":
                return (
                  <td key={header.key} className="px-6 py-4">
                    {item[header.key] && typeof item[header.key] === "object" ? (
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${getBadgeClasses(
                          item[header.key].type
                        )}`}
                      >
                        {item[header.key].label}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                );
              default:
                return (
                  <td key={header.key} className="px-6 py-4 truncate">
                    {item[header.key]}
                  </td>
                );
            }
          })}

          {(showEdit || showView || showDelete) && (
            <td className="px-2 py-1">
              <div className="flex space-x-2">
                {showView && (
                  <button
                    onClick={() => onView(item.id)}
                    className="p-1 sm:p-2 rounded flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-green-400/20"
                    title="View"
                  >
                    <img
                      src="/assets/SVG/icons/eye.svg"
                      alt="View"
                      className="cursor-pointer"
                    />
                  </button>
                )}
                {showEdit && (
                  <button
                    onClick={() => onEdit(item.id)}
                    className="p-1 sm:p-2 rounded flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-stone-600/20"
                    title="Edit"
                  >
                    <img
                      src="/assets/SVG/icons/edit1.svg"
                      alt="Edit"
                      className="cursor-pointer"
                    />
                  </button>
                )}
                {showDelete && (
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1 sm:p-2 rounded flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-red-400/20"
                    title="Delete"
                  >
                    <img
                      src="/assets/SVG/icons/trash.svg"
                      alt="Delete"
                      className="cursor-pointer"
                    />
                  </button>
                )}
              </div>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default DataTable;
