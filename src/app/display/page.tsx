"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { QRCodeGenerator } from "@/components/qr-code";
import { useQuery } from "@tanstack/react-query";
import { Submission } from "@/lib/api";
import { Child } from "@/types/submition";
import { useSideText, useThem } from "@/hooks";
import Loader from "@/components/Loader";

interface Moment {
  id: number | string;
  childName: string;
  quote: string;
  photo: string;
  timestamp: string;
  age: number;
}
interface ApiItem {
  _id?: string;
  childName?: string;
  age?: number;
  quote?: string;
  photos?: string[];
  createdAt?: string;
}

// Transform API response to Moment format
function transformApiData(apiData: ApiItem[]): Moment[] {
  if (!apiData || !Array.isArray(apiData)) return [];
  console.log(apiData, "api data");
  return apiData.map((item, index) => ({
    id: item._id || index,
    childName: item.childName || "Unknown",
    quote: item.quote || "No quote available",
    photo: item.photos?.[0] || "/display.jpg",
    timestamp: item.createdAt || new Date().toISOString(),
    age: item.age || 0,
  }));
}

export default function DisplayPage() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: them } = useThem();
  const { data: sidebarImage } = useSideText();

  const { data: datas, isLoading } = useQuery({
    queryKey: ["submission"],
    queryFn: Submission,
  });

  const data = datas?.filter((item: Child) => item.status === "active");

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const transformedData = transformApiData(data);

      setMoments((prev) => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(transformedData);
        if (prevStr !== newStr) {
          localStorage.setItem("moments", newStr);
          return transformedData;
        }
        return prev;
      });
    } else {
      const stored = localStorage.getItem("moments");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setMoments(parsed);
        } catch (err) {
          console.error("Error parsing localStorage data:", err);
        }
      }
    }
  }, [data]);

  // Auto-rotate every 10 seconds
  useEffect(() => {
    if (moments.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % moments.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [moments.length]);

  // Get 3 consecutive moments to display
  const getDisplayMoments = () => {
    if (moments.length === 0) return [];

    if (moments.length <= 3) {
      return moments;
    }

    return [
      moments[currentIndex % moments.length],
      moments[(currentIndex + 1) % moments.length],
      moments[(currentIndex + 2) % moments.length],
    ];
  };

  const displayMoments = getDisplayMoments();

  if (isLoading) {
    return <Loader />;
  }

  const bgColor = them?.data?.backgroundColor;
  const gradient = bgColor?.length
    ? `linear-gradient(135deg,${bgColor.join(", ")})`
    : "linear-gradient(135deg, #60a5fa, #06b6d4, #a855f7, #ec4899)";

  const catsImage = them?.data?.catImage[0];

  return (
    <div
      className="animated-gradient relative overflow-hidden w-screen h-screen bg-cover bg-center"
      style={{
        background: gradient,
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
      }}
    >
      <div
        className="relative bg-cover bg-center w-full h-full flex flex-col"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        {/* Sidebars */}
        {/* <div
          className="hidden md:flex absolute left-0 top-0 bottom-0 w-16 h-full bg-repeat-y bg-left"
          style={{
            backgroundImage: `url(${
              sidebarImage?.sideImage || "/leftside.png"
            })`,
            backgroundSize: "contain",
          }}
        >

        </div> */}

        {/* <div
          className="hidden md:flex absolute right-0 top-0 bottom-0 w-16 h-full bg-repeat-y bg-right"
          style={{
            backgroundImage: `url(${
              sidebarImage?.sideImage || "/leftside.png"
            })`,
            backgroundSize: "contain",
          }}
        ></div> */}

        {/* Header Section */}
        <div className="flex justify-between items-center px-5 pt-5">
          {/* Logo */}
          <div className="flex-1 flex justify-start -mt-4">
            <Image
              src="/logo.png"
              alt="logo"
              width={100}
              height={100}
              className="md:relative md:left-48 drop-shadow-sm"
              priority
            />
          </div>

          {/* QR Code */}
          <div className="bg-white p-2 md:p-3 mr-20 rounded-xl max-w-[140px] shadow-lg border border-white/20">
            <QRCodeGenerator
              url={
                typeof window !== "undefined"
                  ? `${window.location.origin}/submit`
                  : "/submit"
              }
              size={110}
            />
            <p className="text-center text-[10px] text-gray-600 mt-1 font-medium">Scan Here!</p>
          </div>
        </div>

        {/* Main Content - Percentage-based Cards */}
        <div className="relative z-10 mx-auto flex-1 flex items-center justify-center w-full px-6 pb-20 ">
          {displayMoments.length > 0 ? (
            <div className="flex items-center justify-center w-full gap-4 xl:gap-8 2xl:gap-12">
              {displayMoments.map((moment, index) => {
                const isCenter = index === 1;
                const isfirst=index ===0;
                const islast=index===2

                return (
                  <div
                    key={`${moment.id}-${index}`}
                    className={`flex flex-col items-center text-center relative transition-all duration-700 ease-in-out w-[30%] xl:w-[28%] 2xl:w-[26%] ${
                      isCenter ? "z-30 -mt-24 md:-mt-28" : "z-10 -mt-4 md:-mt-8"
                    }`}
                  >
                    {/* Floating Cat - Responsive based on container */}
                    <div className="relative w-[25%] aspect-square top-4 md:top-6 lg:-mt-24  z-0 mt-2 lg:top-0">
                      <Image
                        src={catsImage || "/cakey-hero4.png"}
                        alt="decoration"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>

                    {/* Photo Card - Full-Bleed & Head-Prioritized (Zero White Space) */}
                    <div
                      className={`relative bg-white rounded-[1.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] border-[12px] border-white overflow-hidden transition-all duration-700 ease-in-out ${
                        isCenter ? "scale-105" : "scale-95 opacity-90"
                      } aspect-[3/4] w-full max-h-[55vh] md:max-h-[60vh] lg:max-h-[65vh]`}
                    >
                      <Image
                        src={moment.photo || "/placeholder.svg"}
                        alt={`Moment by ${moment.childName}`}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                      
                      {/* Subtle Vignette for Premium Depth */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/10" />
                    </div>

                    {/* Quote Bubble - Adjusted for no cropping */}
                    <div className="relative flex justify-center -mt-12 md:-mt-16 z-10 w-full">
                      <div className="relative flex flex-col items-center text-center w-[85%] lg:w-[80%]">
                        {(() => {
                          const quoteLength = moment.quote?.length || 0;
                          const scale = Math.min(1 + quoteLength / 120, 1.25);
                          const textColors = [
                            "text-pink-600",
                            "text-blue-600",
                            "text-purple-600",
                          ];

                          return (
                            <div className="relative w-full lg:w-[90%]">
                              {/* Background image scales */}
                              <div
                                className="transition-transform duration-300 origin-center"
                                style={{ transform: `scale(${scale})` }}
                              >
                                <Image
                                  src="/text.png"
                                  alt="text background"
                                  width={400}
                                  height={240}
                                  className="w-full h-auto select-none pointer-events-none"
                                  draggable={false}
                                  priority
                                />
                              </div>

                              {/* Text Layer */}
                              <div className="absolute inset-0 flex flex-col justify-center items-center px-6 pb-4 text-center">
                                <p
                                  className={`font-bold leading-tight break-words max-w-[82%] ${
                                    textColors[index % textColors.length]
                                  } text-[10px] sm:text-sm md:text-[10px] lg:text-sm xl:text-lg 2xl:text-xl`}
                                  style={{
                                    lineHeight: "1.1",
                                  }}
                                >
                                  &ldquo;{moment.quote}&rdquo;
                                </p>
                                <p className="text-gray-900 font-bold mt-1 text-[8px] sm:text-[10px] md:text-[8px] lg:text-xs xl:text-base 2xl:text-lg opacity-80">
                                  - {moment.childName}{" "}
                                  {moment.age > 0 ? `${moment.age}` : ""}y
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center px-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                No moments yet!
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-white">
                Scan the QR code to submit your first moment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add CSS for gradient animation and aspect ratio */}
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Ensure aspect ratio works consistently */
        .aspect-\\[3\\/4\\] {
          aspect-ratio: 3/4;
        }
      `}</style>
    </div>
  );
}
