"use client";
// import Link from "next/link";clear
import Image from "next/image";
import { QRCodeGenerator } from "@/components/qr-code";
import { useThem } from "@/hooks";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";

export default function HomePage() {
  const { data } = useThem();
  const [scanSize, setScanSize] = useState(300);

  const logo = data?.data?.logo;
  const catImage1 = data?.data?.catImage?.[0];
  const catImage2 = data?.data?.catImage?.[1];
  const heroImage = data?.data?.heroImage;
  const bgColor = data?.data?.backgroundColor;
  const color = data?.data?.color;

  const gradient = bgColor?.length
    ? `linear-gradient(135deg,${bgColor.join(", ")})`
    : "linear-gradient(135deg, #60a5fa, #06b6d4, #a855f7, #ec4899)";

  // Responsive QR code sizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1530) setScanSize(450);
      else if (window.innerWidth >= 1200) setScanSize(350);
      else if (window.innerWidth >= 1024) setScanSize(350);
      else if (window.innerWidth >= 768) setScanSize(320);
      else setScanSize(280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="relative overflow-hidden bg-cover xl:h-screen flex justify-between items-center bg-center"
      style={{
        backgroundImage: gradient,
        backgroundSize: "400% 400%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        animation: "gradientShift 15s ease infinite",
      }}
    >
      {/* Gradient Animation */}
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
      `}</style>

      {/* Subtle background overlay */}
      <div className="absolute inset-0 bg-cover bg-center opacity-40">
        <Image src="/bg.png" alt="background" fill className="object-cover" />
      </div>

      {/* Floating decorative images */}
      <div className=" lg:block absolute -top-10 -left-10 xl:-left-16 w-32 xl:w-44 h-32 xl:h-44 rotate-[135deg] z-30">
        <Image
          src={catImage2 || "/openeye.png"}
          alt="cat-decor-1"
          fill
          className="object-cover"
        />
      </div>

      {/* bottom left  */}
      <div className=" lg:block absolute -bottom-16 -left-12 xl:-left-20 w-36 xl:w-56 h-36 xl:h-56 rotate-[50deg] z-30">
        <Image
          src={catImage1 || "/openeye.png"}
          alt="cat-decor-2"
          fill
          className="object-cover"
        />
      </div>

      {/* top right  */}
      <div className=" lg:block absolute -top-12 -right-10 xl:-right-16 w-36 xl:w-56 h-36 xl:h-56 rotate-[-120deg] z-30">
        <Image
          src={catImage2 || "/openeye.png"}
          alt="cat-decor-3"
          fill
          className="object-cover"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col-reverse xl:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Left Section */}
          <div className="w-full xl:w-[64%] flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-[30px] sm:text-[40px] md:text-[45px] font-coiny text-[#343A40] leading-tight mb-4 sm:mb-6">
              Share your favorite moments!
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-[#343A40]  ">
              {/* Submit your child&apos;s funniest quotes or photos and see them
              live on the big screen. */}
              Scan to share your child&apos;s funny and heartwarming quotes and
              photos throughout the show — they might be featured on the big
              screen!
            </p>

            <div className="w-full max-w-[720px] mx-auto">
              <Image
                src={heroImage || "/displayleft.png"}
                alt="Hero"
                width={720}
                height={560}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full xl:w-[36%] flex flex-col items-center gap-6">
            {/* Logo */}
            <div className="w-28 sm:w-32 md:w-36">
              <Image
                src={logo || "/logo.png"}
                alt="Logo"
                width={150}
                height={150}
                className="mx-auto"
              />
            </div>

            {/* QR Card */}
            <div className="relative bg-white rounded-2xl md:rounded-3xl pb-6 sm:pb-8 md:pb-10 shadow-2xl w-full max-w-sm xl:max-w-full flex flex-col items-center text-center">
              <div className="bg-transparent rounded-2xl p-2 sm:p-2   mb-2">
                <QRCodeGenerator
                  url={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/submit`
                      : "/submit"
                  }
                  size={scanSize}
                />
              </div>

              <p className="text-base sm:text-lg md:text-lg xl:text-xl w-[80%] text-center font-semibold text-gray-900">
                Share your show day magic by scanning here!
              </p>

              {/* <Link
                href="/submit"
                className="mt-4 sm:mt-6 text-primary hover:text-primary-hover underline text-sm sm:text-base"
              >
                Or click here to submit
              </Link> */}

              {/* Bottom floating cat */}
              <div className="hidden lg:block absolute -bottom-16 -right-24 w-32 xl:w-48 h-32 xl:h-48 z-20">
                <Image
                  src={catImage1 || "/cakey-hero4.png"}
                  alt="cat-bottom"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex justify-between items-center gap-3 mt-4 shadow-xl p-2 rounded-xl bg-white">
              <Link
                style={{
                  color: color,
                }}
                className=""
                href={"https://www.instagram.com/livefromsnacktime/"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-6 h-6" />
              </Link>
              {/* <Image
                src={"/insta.svg"}
                alt="insta"
                width={24}
                height={24}
                className="object-cover w-[24px] h-[24px] cursor-pointer"
              /> */}
              <p className="text-[14px]">
                Follow{" "}
                <Link
                  style={{
                    color: color,
                  }}
                  className=""
                  href={"https://www.instagram.com/livefromsnacktime/"}
                >
                  @LiveFromSnackTime
                </Link>{" "}
                for more quotes!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
