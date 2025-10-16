"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Moment {
  id: number
  childName: string
  quote: string
  photo: string
  timestamp: string
}

export default function DisplayPage() {
  const [moments, setMoments] = useState<Moment[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Load moments from localStorage
    const loadMoments = () => {
      const stored = localStorage.getItem("moments")
      if (stored) {
        const parsed = JSON.parse(stored)
        setMoments(parsed)
      }
    }

    loadMoments()

    // Reload every 10 seconds to check for new submissions
    const reloadInterval = setInterval(loadMoments, 10000)

    return () => clearInterval(reloadInterval)
  }, [])

  useEffect(() => {
    if (moments.length === 0) return

    // Rotate every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 3) % moments.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [moments.length])

  // Get 3 moments to display
  const displayMoments =
    moments.length > 0
      ? [
          moments[currentIndex % moments.length],
          moments[(currentIndex + 1) % moments.length],
          moments[(currentIndex + 2) % moments.length],
        ]
      : []

  const borderColors = ["border-purple-500", "border-pink-500", "border-cyan-500"]

  return (
    <div className="min-h-screen animated-gradient relative overflow-hidden">
      <div className="hidden md:flex absolute left-0 top-0 bottom-0 w-8 md:w-12 lg:w-16 flex-col justify-around">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={`left-${i}`}
            className="h-8 md:h-10 lg:h-12 rounded-r-full"
            style={{
              backgroundColor: ["#fbbf24", "#06b6d4", "#ec4899", "#a855f7", "#fbbf24", "#06b6d4", "#ec4899", "#a855f7"][
                i
              ],
              width: "100%",
            }}
          />
        ))}
      </div>

      <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-8 md:w-12 lg:w-16 flex-col justify-around">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={`right-${i}`}
            className="h-8 md:h-10 lg:h-12 rounded-l-full"
            style={{
              backgroundColor: ["#fbbf24", "#06b6d4", "#ec4899", "#a855f7", "#fbbf24", "#06b6d4", "#ec4899", "#a855f7"][
                i
              ],
              width: "100%",
            }}
          />
        ))}
      </div>

      <div className="absolute top-4 md:top-8 left-4 md:left-16 lg:left-24 z-20">
        <div className="bg-white p-2 md:p-3 lg:p-4 rounded-xl md:rounded-2xl shadow-lg transform -rotate-3">
          <div className="text-center">
            <div className="text-red-500 font-bold text-base md:text-xl lg:text-2xl">LIVE</div>
            <div className="text-cyan-500 font-bold text-base md:text-xl lg:text-2xl">FROM</div>
            <div className="text-orange-500 font-bold text-base md:text-xl lg:text-2xl">SNACK</div>
            <div className="text-orange-500 font-bold text-base md:text-xl lg:text-2xl">TIME</div>
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="absolute top-4 md:top-8 right-4 md:right-16 lg:right-24 z-20 bg-white p-2 md:p-3 lg:p-4 rounded-xl md:rounded-2xl shadow-lg">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abtucker__Client_File_.png-K4JxK2E6tSYxO3KYL6iDgN2tpkdIIV.jpeg"
          alt="QR Code"
          width={150}
          height={150}
          className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32"
        />
      </div>

      <div
        className="hidden lg:block absolute top-24 left-1/4 w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 animate-bounce"
        style={{ animationDuration: "3s" }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d63ff10c36fef72d4f3b4f7994dffff7a544932b-3bngXNHCxGoxcHSS9mTjCw6h48yen3.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div
        className="hidden lg:block absolute top-32 right-1/4 w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 animate-bounce"
        style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/71f48d9af0ca5ff930879a0c27670141f4c7ab86%20%281%29-f4r828EAqHgYZpQoHx34re5iHrCpdk.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-20 md:py-24 lg:py-32 min-h-screen flex items-center justify-center">
        {displayMoments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 w-full max-w-7xl">
            {displayMoments.map((moment, index) => (
              <div key={moment.id} className="flex flex-col items-center animate-in fade-in duration-500">
                {/* Cat character above card */}
                <div
                  className="relative w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mb-3 md:mb-4 animate-bounce"
                  style={{ animationDuration: `${3 + index * 0.5}s` }}
                >
                  <Image
                    src={
                      [
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2f6c33af1f8a8ee9f7da7bac84e51dadd071f06e-f3FGWtHN77aR1cBdKFSbevp3apueYj.png",
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/71f48d9af0ca5ff930879a0c27670141f4c7ab86%20%281%29-f4r828EAqHgYZpQoHx34re5iHrCpdk.png",
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d63ff10c36fef72d4f3b4f7994dffff7a544932b-3bngXNHCxGoxcHSS9mTjCw6h48yen3.png",
                      ][index] || "/placeholder.svg"
                    }
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Photo card */}
                <div
                  className={`relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 md:border-6 lg:border-8 ${borderColors[index]} transform hover:scale-105 transition-transform`}
                >
                  <div className="aspect-[3/4] relative">
                    <img
                      src={moment.photo || "/placeholder.svg"}
                      alt={moment.childName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Speech bubble quote */}
                <div className="mt-4 md:mt-6 lg:mt-8 relative">
                  <div className="speech-bubble max-w-sm">
                    <p className="text-base md:text-lg lg:text-xl font-bold text-primary mb-2 text-center">
                      &rdquo;{moment.quote}&rdquo;
                    </p>
                    <p className="text-xs md:text-sm text-gray-700 text-center">- {moment.childName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">No moments yet!</h2>
            <p className="text-lg md:text-xl lg:text-2xl text-white">Scan the QR code to submit your first moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
