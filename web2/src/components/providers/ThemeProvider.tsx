'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('tamirhanem-theme') as Theme | null
    if (stored && stored !== theme) {
      setTheme(stored)
      document.documentElement.classList.toggle('light', stored === 'light')
      document.documentElement.classList.toggle('dark', stored === 'dark')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('tamirhanem-theme', next)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
