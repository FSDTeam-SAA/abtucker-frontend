"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { QRCodeGenerator } from "@/components/qr-code";
import { useQuery } from "@tanstack/react-query";
import { Submission } from "@/lib/api";
import { Child } from "@/types/submition";
// import { image } from "@/lib/fackdata";
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
  // console.log('1 what is the problem',sidebarImage?.sideImage)

  const {
    data: datas,

    isLoading,
  } = useQuery({
    queryKey: ["submission"],
    queryFn: Submission,
  });
  // console.log("data", datas);
  const data = datas?.filter((item: Child) => item.status === "active");
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const transformedData = transformApiData(data);

      // ✅ Only update if data actually changed
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
      // Fallback to localStorage if no API data
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
      // If we have 3 or fewer items, just return all of them
      return moments;
    }

    // For more than 3 items, return 3 consecutive items starting from currentIndex
    return [
      moments[currentIndex % moments.length],
      moments[(currentIndex + 1) % moments.length],
      moments[(currentIndex + 2) % moments.length],
    ];
  };

  const displayMoments = getDisplayMoments();
  // const borderColors = [
  //   "border-purple-500",
  //   "border-pink-500",
  //   "border-cyan-500",
  // ];

  if (isLoading) {
    return <Loader />;
  }

  // if (error) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-600">
  //       <div className="text-white text-xl">Error loading moments</div>
  //     </div>
  //   );
  // }
  const bgColor = them?.data?.backgroundColor;
  // console.log(bgColor, "fghjk");
  const gradient = bgColor?.length
    ? `linear-gradient(135deg,${bgColor.join(", ")})`
    : "linear-gradient(135deg, #60a5fa, #06b6d4, #a855f7, #ec4899)";
  // console.log(gradient, "5");

  const catsImage = them?.data?.catImage[0];
  return (
    <div
      className="animated-gradient relative overflow-hidden h-screen bg-cover bg-center"
      style={{
        background: gradient,
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
      }}
    >
      <div
        className=" relative bg-cover bg-center h-screen flex flex-col"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        {/* Left Side Cats */}
        {/* Left Side Cats */}
        <div
          className="hidden md:flex absolute left-0 top-0 bottom-0 w-16 h-full bg-repeat-y bg-left"
          style={{
            backgroundImage: `url(${
              sidebarImage?.sideImage || "/leftside.png"
            })`,
            backgroundSize: "contain auto", // keeps width auto-scaled
            backgroundPosition: "left top",
            backgroundRepeat: "repeat-y",
            backgroundOrigin: "content-box",
            paddingTop: "20px",
          }}
        ></div>

        {/* Right Side Cats */}
        <div
          className="hidden md:flex absolute right-0 top-0 bottom-0 w-16 h-full bg-repeat-y bg-right"
          style={{
            backgroundImage: `url(${
              sidebarImage?.sideImage || "/leftside.png"
            })`,
            backgroundSize: "contain auto",
            backgroundPosition: "right top",
            backgroundRepeat: "repeat-y",
            backgroundOrigin: "content-box",
            paddingTop: "20px", 
          }}
        ></div>

        {/* 🔹 Section 1: Logo + QR Code */}
        <div className="flex justify-between items-center px-5 pt-5">
          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <Image
              src="/logo.png"
              alt="logo"
              width={100}
              height={100}
              className="md:relative md:left-48"
            />
          </div>

          {/* QR Code */}
          <div className="bg-white p-2 md:p-3 lg:p-4 mr-20 rounded-xl max-w-[150px] shadow-lg">
            <QRCodeGenerator
              url={
                typeof window !== "undefined"
                  ? `${window.location.origin}/submit`
                  : "/submit"
              }
              size={100}
            />
            <p className="text-center text-xs">Scan Here!</p>
          </div>
        </div>

        {/* 🔹 Section 2: Static 3-Item Grid */}
        <div className="relative z-10 mx-auto flex-1 flex items-center justify-center gap-7 -mt-40">
          {displayMoments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-14 justify-items-center w-full max-w-screen px-6 pb-20">
              {displayMoments.map((moment, index) => (
                <div
                  key={`${moment.id}-${index}`}
                  className={`flex flex-col items-center text-center relative transition-all duration-500 ease-in-out ${
                    index === 1
                      ? "scale-95 -mt-8 md:-mt-12 z-20"
                      : "scale-90 mt-8 md:mt-12 opacity-90"
                  }`}
                >
                  {/* Floating Cat */}
                  <div
                    className={`relative ${
                      index === 1
                        ? "w-[150px] aspect-square md:w-[190px] aspect-square"
                        : "w-[110px] h-[110px] md:w-[140px] md:h-[140px]"
                    } top-8 md:top-10 z-0`}
                  >
                    <Image
                      src={catsImage || "/cakey-hero4.png"}
                      alt="decoration"
                      fill
                      className="object-contain  w-full h-full"
                      priority
                    />
                  </div>

                  {/* Photo Card */}
                  <div
                    className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl border-8 ${
                      index === 1
                        ? "w-[370px] md:w-[480px] h-[460px] md:h-[560px]"
                        : "w-[320px] md:w-[420px] h-[420px] md:h-[520px]"
                    }`}
                    style={{
                      borderColor: bgColor?.[index % bgColor.length] || "#000",
                    }}
                  >
                    <Image
                      src={moment.photo || "/placeholder.svg"}
                      alt={`Moment by ${moment.childName}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>

                  {/* Quote Bubble */}
                  <div className="relative flex justify-center -mt-16 md:-mt-20 z-10">
                    <div
                      className={`relative flex flex-col items-center text-center ${
                        index === 1
                          ? "w-[350px] md:w-[440px]"
                          : "w-[300px] md:w-[380px]"
                      }`}
                    >
                      {(() => {
                        const quoteLength = moment.quote?.length || 0;
                        // background scale factor
                        const scale = Math.min(1 + quoteLength / 100, 1.4);

                        const textColors = [
                          "text-pink-600",
                          "text-blue-600",
                          "text-purple-600",
                        ];

                        return (
                          <div className="relative w-full">
                            {/* Background image scales */}
                            <div
                              className="transition-transform duration-300 origin-center"
                              style={{
                                transform: `scale(${scale})`,
                              }}
                            >
                              <Image
                                src="/text.png"
                                alt="text background"
                                width={440}
                                height={260}
                                className={`w-full h-auto select-none pointer-events-none `}
                                draggable={false}
                              />
                            </div>

                            {/* Text Layer - stays normal size */}
                            <div className="absolute inset-0 flex flex-col justify-center items-center px-5 md:px-8 text-center">
                              <p
                                className={`text-sm md:text-lg font-bold mb-2 leading-snug break-words max-w-[85%] ${
                                  textColors[index % textColors.length]
                                }`}
                              >
                                &ldquo;{moment.quote}&rdquo;
                              </p>
                              <p className="text-xs md:text-sm text-gray-700 font-medium">
                                - {moment.childName}{" "}
                                {moment.age > 0 ? `${moment.age}` : ""} Years
                                old
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                No moments yet!
              </h2>
              <p className="text-lg md:text-xl text-white">
                Scan the QR code to submit your first moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
