"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutGrid, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { setStoredUser, getStoredUser } from "@/lib/auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Image from "next/image"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const user = getStoredUser()

  const handleLogout = () => {
    setStoredUser(null)
    router.push("/login")
  }

  const navItems = [
    {
      href: "/dashboard",
      label: "Answer's Submissions",
      icon: LayoutGrid,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <div className="bg-white p-3 rounded-xl shadow-md transform -rotate-3 inline-block">
           <div className="mt-[40px] flex justify-start">
                   <div className="flex justify-center lg:justify-start">
                     <Image src={`/logo.png`} alt="logo" width={100} height={100} />
                   </div>
                 </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center">Are You Sure?</DialogTitle>
            <DialogDescription className="text-center">Are you sure you want to log out?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2">
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
