"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useThem } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetPassword, verifyOTP } from "@/lib/api";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { data, isLoading, error } = useThem();
  const email = searchParams.get("email");

  const logo = data?.data?.logo;

  // Timer effect with cleanup
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Reset password mutation for resending code
  const resetPasswordMutation = useMutation({
    mutationFn: (email: string) => resetPassword(email),
    onSuccess: () => {
      toast.success(`Verification code sent to ${email}`);
      setTimer(30);
    },
    onError: (error: Error) => {
      toast.error(`Failed to send code: ${error.message}`);
    },
  });

  // Verify code mutation
  const verifyCodeMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOTP({ email, otp }),
    onSuccess: () => {
      toast.success("Verification successful!");
      router.push(`/create-password?email=${encodeURIComponent(email || "")}`);
    },
    onError: (error: Error) => {
      toast.error(`Verification failed: ${error.message}`);
      // Clear code on error for better UX
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    if (value.length > 1) {
      // Handle paste event
      const pastedDigits = value.split("").slice(0, 6 - index);
      const newCode = [...code];
      pastedDigits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);

      // Focus next empty input or last input
      const nextEmptyIndex = newCode.findIndex(
        (digit, i) => i >= index && digit === ""
      );
      const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
      inputRefs.current[focusIndex]?.focus();
    } else {
      // Single digit input
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
      
      // Auto-submit when all digits are filled
      if (value && index === 5) {
        const fullCode = newCode.join("");
        if (fullCode.length === 6 && email) {
          verifyCodeMutation.mutate({ email, otp: fullCode });
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      } else if (code[index]) {
        // Clear current input but stay focused
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").split("").slice(0, 6);

    if (digits.length === 6) {
      const newCode = [...digits];
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCode();
  };

  const submitCode = () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      inputRefs.current[code.findIndex(digit => digit === "")]?.focus();
      return;
    }

    if (!email) {
      toast.error("Email not found. Please try again.");
      return;
    }

    verifyCodeMutation.mutate({ email, otp: verificationCode });
  };

  const handleResend = () => {
    if (!email) {
      toast.error("Email not found. Please try again.");
      return;
    }
    if (timer > 0) {
      toast.error(`Please wait ${timer} seconds before resending`);
      return;
    }
    resetPasswordMutation.mutate(email);
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          Error loading verification page
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (

    
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="mt-10 flex justify-center">
            <Image
              src={logo || "/logo.png"}
              alt="logo"
              width={100}
              height={100}
              priority
              className="object-contain"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Account
            </h1>
            <p className="text-gray-600">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium text-gray-900">
                {email || "your email"}
              </span>{" "}
              to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2 justify-center">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 focus:border-primary transition-colors"
                  disabled={verifyCodeMutation.isPending}
                  aria-label={`Digit ${index + 1} of verification code`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  <path strokeWidth={2} d="M12 6v6l4 2" />
                </svg>
                <span>
                  {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0 || resetPasswordMutation.isPending}
                className="text-primary hover:text-primary/80 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {resetPasswordMutation.isPending ? "Sending..." : "Resend Code"}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5"
              disabled={
                verifyCodeMutation.isPending || 
                code.join("").length !== 6 ||
                !email
              }
            >
              {verifyCodeMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  
  );
}