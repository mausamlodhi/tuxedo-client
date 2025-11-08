import { useRef, useEffect, useCallback } from "react";

const useDebounce = (callback, delay = 300) => {
  const timeoutRef = useRef();

  const debouncedFunction = useCallback((...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return debouncedFunction;
};

export default useDebounce;
