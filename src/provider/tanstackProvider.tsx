"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface TanstackProviderProps {
  children: React.ReactNode;
}

const TanstackProvider = ({ children }: TanstackProviderProps) => {
  const [queryclient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryclient}>{children}</QueryClientProvider>
  );
};

export default TanstackProvider;
