import Link from "next/link";
import Image from "next/image";
import { QRCodeGenerator } from "@/components/qr-code";

export default function HomePage() {
  return (
    <div className=" animated-gradient relative overflow-hidden max-h-screen bg-cover bg-center">
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
          className="hidden lg:block absolute -top-3 p-1 left-0 xl:left-0 w-16 md:w-20 lg:w-44 h-16 md:h-20 lg:h-44 "
          style={{ transform: "rotate(0deg)" }}
        >
          <Image
            src="/displaytopleft.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="hidden lg:block absolute bottom-1 m-0 left-2 xl:left-0 w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 "
          style={{ transform: "rotate(0deg)" }}
          // style={{ animationDuration: "4s", animationDelay: "1s" }}
        >
          <Image
            src="/displayleftbottom.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="hidden lg:block absolute top-0 right-0 xl:right-0 w-20 md:w-24 lg:w-28 h-20 md:h-24 lg:h-28"
          style={{ transform: "rotate(0deg)" }}
        >
          <Image
            src="/displayrighttop.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div className="relative z-10 px-[196px] mx-auto  py-8 md:py-12 lg:py-16 min-h-screen ">
          <div className="flex flex-col  md:flex-row  gap-8 md:gap-12 lg:gap-16 items-center w-full  mx-auto">
            {/* Left column */}
            <div className="w-full md:w-[65%]">
              <div className="mx-auto">
                <h1 className="text-[35px] lg:text-[55px]  font-normal  text-[#343A40] mb-4 md:mb-6 font-coiny leading-[150%]">
                  Share Your Favorite Moment!
                </h1>
                <p className="text-lg sm:text-xl ml-8 md:text-2xl text-[#343A40]  md:w-[80%] font-semibold text-center">
                  Submit your child&apos;s funniest quotes or photos and see
                  them live on the big screen.
                </p>
              </div>

              <div className="">
                <div className=" max-w-[756px] max-h-[760px] object-cover">
                  <Image
                    src="/displayleft.png"
                    alt="Characters"
                    width={1000}
                    height={1000}
                    className=" w-full h-full"
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-[35%] flex flex-col justify-center items-center">
              <div className="flex justify-center lg:justify-start">
                <Image src={`/logo.png`} alt="log" width={100} height={100} />
              </div>
              <div className="relative bg-white rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl max-w-md w-full">
                <div className=" bg-white p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border-2 md:border-4 border-gray-200 mb-4 md:mb-6">
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

                <div
                  className="hidden lg:block absolute -bottom-14 -right-10 xl:-right-26 w-20 md:w-24 lg:w-[200px] h-20 md:h-24 lg:h-[200px] "
                  // style={{ animationDuration: "4s", animationDelay: "1.5s" }}
                >
                  <Image
                    src="/cakey-hero4.png"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
