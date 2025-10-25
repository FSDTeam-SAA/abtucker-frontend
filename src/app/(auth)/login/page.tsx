"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useThem } from "@/hooks";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {data}=useThem()
  const logo= data?.data?.logo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
  

    if (res?.error) {
      setError("Invalid credentials. Please try again.");
    } else if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto">
      <div className="mt-[40px] flex justify-start">
        <div className="flex justify-center lg:justify-start">
          <Image src={logo ||`/logo.png`} alt="logo" width={100} height={100} />
        </div>
      </div>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-[40px] font-bold text-[#343A40] mb-2">
                Welcome!
              </h1>
              <p className="text-[#6C757D] leading-[150%] text-[16px] ">
                Sign in to manage the submissions.
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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 cursor-pointer" />
                    ) : (
                      <Eye className="h-5 w-5 cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex items-center justify-between">
                <div className="flex items-center cursor-pointer space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/reset-password"
                  className="text-sm text-[#9B5DE5] cursor-pointer hover:text-primary-hover"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#9B5DE5]  cursor-pointer hover:bg-primary-hover text-white"
              >
                {loading ? "Loading..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
