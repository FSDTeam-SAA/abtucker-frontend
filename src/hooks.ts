'use client'

import { useQuery } from "@tanstack/react-query";
import { imageText, them } from "./lib/api";

export const useThem = () => {
  return useQuery({
    queryKey: ["them"],
    queryFn: async () => {
      const res = await them();
      return res?.data;
    },
  });
};


//display


export const useSideText=()=>{
  return useQuery({
    queryKey:['imagetext'],
    queryFn:async()=>{
      const res = await imageText();
      console.log('11',res)
      return res;
    }
  })
}
