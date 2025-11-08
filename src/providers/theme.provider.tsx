'use client'

import { selectAuthData, toggleThemeAction } from '@/app/redux/slice/auth.slice'
import { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type Theme = boolean // true = light, false = dark (default)

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const authData = useSelector(selectAuthData);
  const [theme, setTheme] = useState<Theme>(false); // default dark (false)

  // sync with redux auth data
  useEffect(() => {
    if (authData?.admin?.theme !== undefined) {
      setTheme(authData.admin.theme);
    }
  }, [authData?.admin?.theme]);

  const toggleTheme = () => {
    dispatch(toggleThemeAction(!authData.admin.theme));
  };

  // load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme') === 'true'
    if (saved) {
      setTheme(true) // true = light
      document.documentElement.classList.add('light')
    }
  }, []);

  // apply theme change
  useEffect(() => {
    if (theme) {
      // light mode
      document.documentElement.classList.add('light')
    } else {
      // dark mode (default)
      document.documentElement.classList.remove('light')
    }
    localStorage.setItem('theme', String(theme))
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
