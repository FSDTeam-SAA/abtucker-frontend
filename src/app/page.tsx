import Link from "next/link";
import Image from "next/image";
import { QRCodeGenerator } from "@/components/qr-code";

export default function HomePage() {
  return (
    <div className=" animated-gradient relative overflow-hidden min-h-screen bg-cover bg-center">
      <div
        className="relative bg-cover bg-center min-h-screen"
        style={{
          backgroundImage: "url('/bg.png')",
        }}
      >
        {/* Left color bars */}
        {/* <div className="hidden md:flex absolute left-0 top-0 bottom-0 w-8 md:w-12 lg:w-16 flex-col justify-around">
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <div
        key={`left-${i}`}
        className="h-8 md:h-10 lg:h-12 rounded-r-full"
        style={{
          backgroundColor: [
            "#fbbf24",
            "#06b6d4",
            "#ec4899",
            "#a855f7",
            "#fbbf24",
            "#06b6d4",
            "#ec4899",
            "#a855f7",
          ][i],
          width: "100%",
        }}
      />
    ))}
  </div> */}

        {/* Other page content here */}

        {/* <div
        className="hidden md:flex absolute left-0 top-0 bottom-0 w-8 md:w-12 lg:w-16 flex-col justify-around bg-cover bg-center"
        
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={`left-${i}`}
            className="h-8 md:h-10 lg:h-12 rounded-r-full opacity-90"
            style={{
              backgroundColor: [
                "#fbbf24",
                "#06b6d4",
                "#ec4899",
                "#a855f7",
                "#fbbf24",
                "#06b6d4",
                "#ec4899",
                "#a855f7",
              ][i],
              width: "100%",
            }}
          />
        ))}
      </div> */}

        <div
          className="hidden lg:block absolute -top-14 left-0 xl:-left-16 w-16 md:w-20 lg:w-44 h-16 md:h-20 lg:h-44 "

            style={{ transform: "rotate(120deg)" }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2f6c33af1f8a8ee9f7da7bac84e51dadd071f06e-f3FGWtHN77aR1cBdKFSbevp3apueYj.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="hidden lg:block absolute -bottom-8 -left-2 xl:-left-12 w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 "
            style={{ transform: "rotate(75deg)" }}
          // style={{ animationDuration: "4s", animationDelay: "1s" }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d63ff10c36fef72d4f3b4f7994dffff7a544932b-3bngXNHCxGoxcHSS9mTjCw6h48yen3.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="hidden lg:block absolute -top-8 right-20 xl:-right-7 w-20 md:w-24 lg:w-28 h-20 md:h-24 lg:h-28"
          style={{ transform: "rotate(220deg)" }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/71f48d9af0ca5ff930879a0c27670141f4c7ab86%20%281%29-f4r828EAqHgYZpQoHx34re5iHrCpdk.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="hidden lg:block absolute bottom-16 right-20 xl:right-52 w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 "
          // style={{ animationDuration: "4s", animationDelay: "1.5s" }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2f6c33af1f8a8ee9f7da7bac84e51dadd071f06e-f3FGWtHN77aR1cBdKFSbevp3apueYj.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16 min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center w-full max-w-7xl mx-auto">
            {/* Left column */}
            <div className="space-y-6 md:space-y-8">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 text-balance">
                  Share Your Favorite Moment!
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-800 text-balance">
                  Submit your child&apos;s funniest quotes or photos and see them
                  live on the big screen.
                </p>
              </div>

              <div className="flex justify-center lg:justify-start">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/54a4969aea1d3868ab7ae3e3c187382d3faf1170-vUrvAQbx8r3ygNZOSjtuuqbIXXuVjl.png"
                    alt="Characters"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center lg:justify-start">
                <Image src={`/logo.png`} alt="log" width={100} height={100} />
              </div>
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl max-w-md w-full">
                <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border-2 md:border-4 border-gray-200 mb-4 md:mb-6">
                  <QRCodeGenerator
                    url={
                      typeof window !== "undefined"
                        ? `${window.location.origin}/submit`
                        : "/submit"
                    }
                    size={300}
                  />
                </div>
                <p className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 text-balance">
                  Share your show day magic by Scanning Here!
                </p>

                {/* For demo purposes, also add a direct link */}
                <Link
                  href="/submit"
                  className="mt-4 md:mt-6 block text-center text-base md:text-lg text-primary hover:text-primary-hover underline"
                >
                  Or click here to submit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
