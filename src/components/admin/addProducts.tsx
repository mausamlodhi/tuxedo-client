

'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface AddProductButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  theme?: boolean | object;
}

const AddProductButton: React.FC<AddProductButtonProps> = ({
  label = "Add Product",
  onClick = () => console.log('Add Product clicked'),
  className = "",
  theme
}) => {
  return (
    <button
      onClick={onClick}
      className={`${theme ? "bg-blue-600" : "border-1 border-[#485568] bg-[#313A46] hover:bg-gray-700"} text-[#FFFFFF] cursor-pointer font-medium py-3 px-5 rounded-lg flex items-center space-x-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
    >
      <Plus size={20} />
      <span>{label}</span>
    </button>
  );
};

export default AddProductButton;
