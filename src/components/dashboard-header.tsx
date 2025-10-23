'use client'
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

export default function DashboardHeader() {
    const {data:session} = useSession()
    console.log(session)
  return (
    <div className="flex items-center gap-3">
      <Image
        width={40}
        height={40}
        src={`/user.jpg`}
        alt={session?.user?.name || "User"}
        className="w-10 h-10 rounded-full"
      />
      <div>
        <div className="font-semibold text-gray-900">
          {session?.user?.name || "Olivia Rhye"}
        </div>
        <div className="text-sm text-gray-600">
          {session?.user?.email || "olivia@untitledui.com"}
        </div>
      </div>
    </div>
  );
}
