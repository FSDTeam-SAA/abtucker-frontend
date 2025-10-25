"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useThem } from "@/hooks";
import Link from "next/link";
import { Instagram } from "lucide-react";

export default function ThankYouPage() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  // const { width, height } = useWindowSize();
  const { data } = useThem();

  useEffect(() => {
    // Stop confetti after 2 minutes (120,000 milliseconds)
    const timer = setTimeout(() => setShowConfetti(false), 120000);
    return () => clearTimeout(timer);
  }, []);
  const catImage1 = data?.data.catImage[0];
  const catImage2 = data?.data.catImage[1];
  const color=data?.data?.color;
  return (
    <div className="min-h-screen bg-gray-300 relative overflow-hidden flex items-center justify-center p-4">
      {/* Full Body Confetti - Multiple layers for complete coverage */}
      {showConfetti && (
        <>
          {/* Base layer - Slow & Small confetti */}
          <Confetti
            width={1850}
            height={927}
            numberOfPieces={80}
            recycle={true}
            gravity={0.1}
            initialVelocityY={8}
            colors={[
              "#fbbf24",
              "#06b6d4",
              "#ec4899",
              "#a855f7",
              "#10b981",
              "#f97316",
            ]}
            drawShape={(ctx) => {
              // Small circles
              ctx.beginPath();
              ctx.arc(0, 5, 1.5, 0, 2 * Math.PI); // Even smaller radius
              ctx.fill();
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              pointerEvents: "none",
              zIndex: 20,
            }}
          />

          {/* Second layer - Slow small rectangles */}
          <Confetti
            width={1850}
            height={927}
            numberOfPieces={100}
            recycle={true}
            gravity={0.08} // Even slower
            initialVelocityY={6} // Even slower start
            colors={["#ef4444", "#8b5cf6", "#14b8a6", "#eab308", "#3b82f6"]}
            drawShape={(ctx) => {
              // Smaller rectangular shapes
              ctx.beginPath();
              ctx.rect(-1, -3, 2, 6); // Even smaller rectangle
              ctx.fill();
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              pointerEvents: "none",
              zIndex: 21,
            }}
          />

          {/* Third layer - Slow tiny dots */}
          <Confetti
            width={1850}
            height={927}
            numberOfPieces={120}
            recycle={true}
            gravity={0.06} // Slowest
            initialVelocityY={5} // Slowest start
            colors={[
              "#f87171",
              "#60a5fa",
              "#34d399",
              "#fbbf24",
              "#a78bfa",
              "#c084fc",
            ]}
            drawShape={(ctx) => {
              // Tiny dots
              ctx.beginPath();
              ctx.arc(0, 0, 0.8, 0, 2 * Math.PI); // Fixed: 2 * Math.PI for full circle
              ctx.fill();
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              pointerEvents: "none",
              zIndex: 22,
            }}
          />
        </>
      )}
      {/* Decorative cat characters */}
      <div
        className="absolute bottom-8 md:bottom-12 lg:-bottom-12 right-4 md:right-8 lg:-right-6 w-20 md:w-24 lg:w-32 h-20 md:h-30 lg:h-44"
        style={{ transform: "rotate(300deg)", zIndex: 50 }}
      >
        <Image
          src={catImage1 || "/openeye.png"}
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Success modal */}
      <div className="relative" style={{ zIndex: 60 }}>
        <div
          className="absolute -left-14 -top-13 z-0 p-6 sm:p-8 md:p-12 mx-4"
          style={{ transform: "rotate(-40deg)" }}
        >
          <Image
            src={catImage2 || "/openeye.png"}
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-50 bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 max-w-lg w-full mx-4 text-center">
          <div className="mb-4 md:mb-6 flex justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Thank You for Sharing!
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8">
            Your child&apos;s moment is being reviewed — it may appear live on
            the big screen soon!
          </p>
      
          <div className="flex justify-center  items-center gap-3 my-2 s p-2 ">
            <Link className=" hover:scale-[105%]" style={{
                  color: color,
                 
                }} href={'https://www.instagram.com/livefromsnacktime/'} target="_blank" rel="noopener noreferrer">
            
              <Instagram />
            </Link>
            <p className="text-[16px] hover:scale-[105%] ">
              <Link
              target="_blank"
              rel="noopener noreferrer"
                style={{
                  color: color,
                  border:color
                }}
                className="border-b-2 pb-1 "
                href={"https://www.instagram.com/livefromsnacktime/"}
              >
                @LiveFromSnackTime
              </Link>
            </p>
          </div>
          <button
            onClick={() => router.push("/display")}
            className="w-full py-3 md:py-4 bg-primary hover:bg-primary-hover cursor-pointer text-white font-bold text-lg md:text-xl rounded-xl md:rounded-2xl transition-colors shadow-lg"
          >
            Submit Another Moment
          </button>
        </div>
      </div>
    </div>
  );
}
