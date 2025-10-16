"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ThankYouPage() {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-300 relative overflow-hidden flex items-center justify-center p-4">
      {/* Confetti */}
      {showConfetti && (
        <>
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}px`,
                backgroundColor: ["#fbbf24", "#06b6d4", "#ec4899", "#a855f7", "#10b981", "#f97316"][
                  Math.floor(Math.random() * 6)
                ],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                animation: "confettiFall linear infinite",
              }}
            />
          ))}
        </>
      )}

      {/* Decorative cat characters */}
      <div
        className="absolute top-8 md:top-12 lg:top-16 left-4 md:left-8 lg:left-16 w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 animate-bounce"
        style={{ animationDuration: "3s" }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/71f48d9af0ca5ff930879a0c27670141f4c7ab86%20%281%29-f4r828EAqHgYZpQoHx34re5iHrCpdk.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div
        className="absolute bottom-8 md:bottom-12 lg:bottom-16 right-4 md:right-8 lg:right-16 w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 animate-bounce"
        style={{ animationDuration: "4s", animationDelay: "1s" }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2f6c33af1f8a8ee9f7da7bac84e51dadd071f06e-f3FGWtHN77aR1cBdKFSbevp3apueYj.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Success modal */}
      <div className="relative z-10 bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 max-w-lg w-full mx-4 text-center">
        <div className="mb-4 md:mb-6 flex justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          Thank You for Sharing!
        </h1>

        <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8">
          Your child&apos;s moment is being reviewed — it may appear live on the big screen soon!
        </p>

        <button
          onClick={() => router.push("/submit")}
          className="w-full py-3 md:py-4 bg-primary hover:bg-primary-hover text-white font-bold text-lg md:text-xl rounded-xl md:rounded-2xl transition-colors shadow-lg"
        >
          Submit Another Moment
        </button>
      </div>
    </div>
  )
}
