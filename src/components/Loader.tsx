"use client";

import React from "react";

const Loader = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy text-white overflow-hidden">
      {/* Spinning ring with glow */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-white animate-spin drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"></div>
        <div className="absolute inset-2 rounded-full bg-white/20 blur-md"></div>
      </div>

      {/* Floating text animation */}
      <div className="text-2xl font-semibold animate-bounce">{message}</div>
    </div>
  );
};

export default Loader;
