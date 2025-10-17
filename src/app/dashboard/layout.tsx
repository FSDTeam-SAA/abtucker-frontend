"use client";

import type React from "react";

import { AuthGuard } from "@/components/auth-guard";
import { ThemeProvider } from "@/lib/theme-context";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthGuard>
        <div className="flex min-h-screen bg-gray-50">
          <DashboardSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </AuthGuard>
    </ThemeProvider>
  );
}
