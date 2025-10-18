'use client'

import { useQuery } from "@tanstack/react-query";
import { them } from "./lib/api";

export const useThem = () => {
  return useQuery({
    queryKey: ["them"],
    queryFn: async () => {
      const res = await them();
      return res?.data;
    },
  });
};

