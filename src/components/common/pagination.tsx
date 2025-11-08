import React from 'react';
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectAuthData } from '@/app/redux/slice/auth.slice';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const authData = useSelector(selectAuthData);
  const theme = authData?.admin?.theme; // boolean

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    console.log("Page dataa : ",currentPage,totalPages);
    

    return pages;
  };

  // 🎨 Shared classes with theme applied
  const baseBtn = `px-3 py-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed`;
  const btnTheme = theme
    ? "bg-[#F1F1F1] text-[#2D333C] hover:bg-blue-500 hover:text-white"
    : "bg-[#2D333C] text-[#C1C1C1] hover:bg-blue-500 hover:text-white";

  const pageBtn = `w-9 h-9 rounded-full flex items-center justify-center font-medium transition-colors`;

  return (
  <div
  className={`flex justify-end items-center space-x-1 p-4 rounded-sm ${
    theme
      ? "bg-[#FFFFFF] text-[#2D333C]"
      : "bg-gray-700 text-[#C1C1C1] border border-[#0000000F]"
  }`}
>
      {/* First Page */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`cursor-pointer ${baseBtn} ${btnTheme}`}
      >
        <ChevronsLeft size={18} />
      </button>

      {/* Previous Page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`cursor-pointer ${baseBtn} ${btnTheme}`}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Numbers */}
      {getVisiblePages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`cursor-pointer ${pageBtn} ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : theme
                ? "bg-[#F1F1F1] text-[#2D333C] hover:bg-blue-500 hover:text-white"
                : "bg-[#2D333C] text-[#C1C1C1] hover:bg-blue-500 hover:text-white"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`cursor-pointer ${baseBtn} ${btnTheme}`}
      >
        <ChevronRight size={16} />
      </button>

      {/* Last Page */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`cursor-pointer ${baseBtn} ${btnTheme}`}
      >
        <ChevronsRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
