

import { User } from "../../types"


export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("current-user")
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function setStoredUser(user: User | null) {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem("current-user", JSON.stringify(user))
  } else {
    localStorage.removeItem("current-user")
  }
}

export function isAuthenticated(): boolean {
  return getStoredUser() !== null
}
