"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useThem } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/lib/api";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { data } = useThem();
  const resetPassWordMutaiton=useMutation({
    mutationFn:(email:string)=>resetPassword(email),
    onSuccess:(data)=>{
      toast.success(`wow nice ${data}`)
          router.push(`/verify?email=${email}`);

    },
    onError:(error)=>{
      toast.error(`oh no .What's Wrong ${error}`)
    }
  })

  const logo = data?.data?.logo;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetPassWordMutaiton.mutate(email)
  };

  return (
    <section className="container mx-auto">
      <div className="mt-[40px] flex justify-start">
        <div className="flex justify-center lg:justify-start">
          <Image src={logo||`/logo.png`} alt="logo" width={100} height={100} />
        </div>
      </div>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        {" "}
        {/* Changed this line */}
        <div className="w-full max-w-md">
          {" "}
          {/* Added this wrapper */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Reset Your Password
              </h1>
              <p className="text-gray-600">
                Enter your email address and we&apos;ll send you code to reset
                your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer bg-primary hover:bg-primary-hover text-white"
              >
                Send Code
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
