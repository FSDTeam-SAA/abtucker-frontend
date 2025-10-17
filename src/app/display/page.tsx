"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { QRCodeGenerator } from "@/components/qr-code";

interface Moment {
  id: number;
  childName: string;
  quote: string;
  photo: string;
  timestamp: string;
}

export default function DisplayPage() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Load moments from localStorage
    const loadMoments = () => {
      const stored = localStorage.getItem("moments");
      if (stored) {
        const parsed = JSON.parse(stored);
        setMoments(parsed);
      }
    };

    loadMoments();

    // Reload every 10 seconds to check for new submissions
    const reloadInterval = setInterval(loadMoments, 10000);

    return () => clearInterval(reloadInterval);
  }, []);

  // useEffect(() => {
  //   if (moments.length === 0) return;

  //   // Rotate every 5 seconds
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prev) => (prev + 3) % moments.length);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [moments.length]);

  // Get 3 moments to display
  const displayMoments =
    moments.length > 0
      ? [
          moments[currentIndex % moments.length],
          moments[(currentIndex + 1) % moments.length],
          moments[(currentIndex + 2) % moments.length],
        ]
      : [];

  const borderColors = [
    "border-purple-500",
    "border-pink-500",
    "border-cyan-500",
  ];

  return (
    <div className="animated-gradient relative overflow-hidden max-h-screen bg-cover bg-center">
      <div
        className="relative bg-cover bg-center min-h-screen flex flex-col"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        {/* Decorative Sides */}
        <div
          className="hidden md:flex absolute left-0 top-0 bottom-0 w-16 "
          style={{ transform: "rotate(0deg)" }}
        >
          <Image src="/leftside.png" alt="left" width={1000} height={1000} />
        </div>

        <div
          className="hidden md:flex absolute right-0 top-0 bottom-0 w-8 md:w-12 lg:w-16 "
          style={{ transform: "rotate(180deg)" }}
        >
          <Image
            className=" relative"
            src="/leftside.png"
            alt="right"
            width={1000}
            height={1000}
          />
        </div>

        {/* 🔹 Section 1: Logo + QR Code */}
        <div className="flex justify-between items-center px-6 md:px-16 lg:px-24 pt-5">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="relative left-48"
          />

          {/* QR Code */}
          <div className="bg-white p-2 md:p-3 lg:p-4 rounded-xl shadow-lg">
            <QRCodeGenerator
              url={
                typeof window !== "undefined"
                  ? `${window.location.origin}/submit`
                  : "/submit"
              }
              size={100}
            />
          </div>
        </div>

       
        {/* 🔹 Section 2: Image Grid */}
        <div className="relative z-10 mx-auto flex-1 flex items-center justify-center -mt-10">
          {displayMoments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center w-full px-6 pb-20">
              {displayMoments.map((moment, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center relative"
                >
                  {/* Floating Cat */}
                  <div className="relative w-[150px] h-[150px] top-10">
                    <Image
                      src="/cakey-hero4.png"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Photo Card - fixed size */}
                  <div
                    className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl border-8 ${borderColors[index]} w-[486px] h-[600px]`}
                  >
                    <Image
                      src={moment.photo || "/placeholder.svg"}
                      alt={moment.childName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Quote Bubble - fixed size */}
                  <div className="relative flex justify-center bottom-20">
                    <div
                      className="relative flex flex-col justify-center items-center text-center bg-no-repeat bg-center bg-contain w-[350px] h-[230px] p-6"
                      style={{ backgroundImage: "url('/text.png')" }}
                    >
                      <p className="text-lg font-bold text-primary mb-2 px-4 leading-snug">
                        &rdquo;{moment.quote}&rdquo;
                      </p>
                      <p className="text-sm text-gray-700">
                        - {moment.childName}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center px-4">
              <h2 className="text-3xl font-bold text-white mb-4">
                No moments yet!
              </h2>
              <p className="text-xl text-white">
                Scan the QR code to submit your first moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
