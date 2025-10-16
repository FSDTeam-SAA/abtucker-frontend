"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { Theme } from "../../types"


interface ThemeContextType {
  theme: Theme
  updateTheme: (theme: Partial<Theme>) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const DEFAULT_THEME: Theme = {
  colors: ["#a855f7", "#d8b4fe"],
  logo: null,
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME)

  useEffect(() => {
    const stored = localStorage.getItem("app-theme")
    if (stored) {
      try {
        setTheme(JSON.parse(stored))
      } catch (e) {
        console.error("[v0] Failed to parse theme:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (theme.colors.length >= 2) {
      document.documentElement.style.setProperty("--color-primary", theme.colors[0])
      document.documentElement.style.setProperty("--color-primary-hover", theme.colors[0])
      document.documentElement.style.setProperty("--color-secondary", theme.colors[1])
    }
  }, [theme])

  const updateTheme = (updates: Partial<Theme>) => {
    const newTheme = { ...theme, ...updates }
    setTheme(newTheme)
    localStorage.setItem("app-theme", JSON.stringify(newTheme))
  }

  return <ThemeContext.Provider value={{ theme, updateTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
