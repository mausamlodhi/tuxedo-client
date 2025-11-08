import { FileSearch } from "lucide-react"; 
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthData } from '@/app/redux/slice/auth.slice';
import Image from "next/image";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void; 
  onChange?: (value: string) => void; 
  debounceTime?: number; 
  searchOnEnter?: boolean; 
  value?: string; 
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  onChange,
  debounceTime = 300,
  searchOnEnter = false,
  value
}) => {
  const authData = useSelector(selectAuthData);
  const theme = authData?.admin?.theme;
  const [input, setInput] = useState<string>(value || "");
  const [debouncedInput, setDebouncedInput] = useState<string>(input);

  
  useEffect(() => {
    if (value !== undefined) setInput(value);
  }, [value]);


  useEffect(() => {
    if (searchOnEnter) return;
    const timer = setTimeout(() => {
      setDebouncedInput(input);
    }, debounceTime);
    return () => clearTimeout(timer);
  }, [input, debounceTime, searchOnEnter]);

  
  useEffect(() => {
    if (!searchOnEnter && onSearch) {
      onSearch(debouncedInput);
    }
  }, [debouncedInput, onSearch, searchOnEnter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (value === undefined) setInput(val); 
    if (onChange) onChange(val);
    if (!searchOnEnter && !onChange && !onSearch) {
      console.warn("SearchBar: No search handler provided.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchOnEnter && e.key === "Enter" && onSearch) {
      onSearch(input);
    }
  };

  return (
   <div className="relative w-full py-1.5">
  
  
    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <Image
        src="/assets/SVG/icons/search.svg"
        alt="Search"
        width={18}
        height={18}
        className="sm:w-5 sm:h-5 w-4 h-4 opacity-70"
      />
    </div>
  

  <input
    type="text"
    placeholder={placeholder}
    value={input}
    onChange={handleChange}
    onKeyDown={handleKeyDown}
    className={`w-full sm:w-64 h-10
      ${theme 
        ? "bg-[#FFFFFF] border border-[#363F4A] text-[#313A46] placeholder-gray-500" 
        : "bg-[#363F4A] border border-[#8392a3] text-gray-200 placeholder-gray-400"} 
      rounded-lg pl-10 pr-4 py-2
      focus:outline-none focus:ring-2 focus:ring-blue-500`}
  />
</div>


  );
};

export default SearchBar;
