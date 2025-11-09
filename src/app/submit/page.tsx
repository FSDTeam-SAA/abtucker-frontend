"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { formSubmission } from "@/lib/api";
import { useSideText, useThem } from "@/hooks";
import Link from "next/link";
// import { image } from "@/lib/fackdata";

export default function SubmitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    childName: "",
    age: null as number | null,
    email: "",
    quote: "",
    photos: null as File | null,
    serial: "123",
  });
  
  const [isHovered, setIsHovered] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { data } = useThem();
  // quistion text or side image fetch
  const { data: sidebarImage } = useSideText();
  console.log("1 what is the problem", sidebarImage?.question);
  const logo = data?.data?.logo;
  console.log(data?.data);
  //  const catImage1=data?.data.catImage[0];
  const catImage2 = data?.data.catImage[1] || data?.data.catImage[0];
  const color = data?.data?.color;

  const formMutation = useMutation({
    mutationKey: ["submission"],
    mutationFn: (data: FormData) => formSubmission(data),
    onSuccess: () => {
      router.push("/thank-you");
    },
    onError: () => {
      console.log("error");
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, photos: file }));

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setUploading(true);
    try {
      const formDataToSent = new FormData();
      formDataToSent.append("childName", formData.childName);
      formDataToSent.append("age", String(formData.age));
      formDataToSent.append("quote", formData.quote);
      formDataToSent.append("serial", formData.serial);
      formDataToSent.append("email", formData.email);

      if (formData.photos) {
        formDataToSent.append("photos", formData.photos);
      }
      await formMutation.mutateAsync(formDataToSent);
      // Store in localStorage if needed
      // localStorage.setItem("submission", JSON.stringify(formData));
    } catch (error) {
      console.error("Submission failed", error);
      // Optionally show an error message to the user
    } finally {
      setUploading(false);
    }
  };

  const isFormValid =
    formData.childName && formData.quote && formData.photos && agreed;

  console.log("100", catImage2);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* First image moved to bottom */}
      <div
        className="absolute -bottom-3 md:-bottom-10 -left-2 w-20 md:w-28 lg:w-32 h-20 md:h-28 lg:h-32"
        style={{
          transform: "rotate(45deg)",
        }}
      >
        <Image
          src={catImage2 || "/formbottom.png"}
          alt="bottom"
          fill
          className="object-cover w-full h-full"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16 min-h-screen flex flex-col items-center justify-center">
        <div className="mb-6 md:mb-8">
          <div className="flex justify-center lg:justify-start w-auto h-[140px]">
            <Image
              src={logo || `/logo.png`}
              alt="logo"
              width={140}
              height={140}
              className="object-contain w-auto h-full"
            />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-3 md:mb-4 text-center text-balance px-4">
          Fill out a quick submission form
        </h1>
        <p className="text-base sm:text-lg text-[#343A40] mb-8 md:mb-12 text-center  text-balance px-4 md:px-0">
          Send us your funniest kid quotes, photos, and moments to display live
          on the big screen! We may feature quotes on the{" "}
          {/* <Link
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: color }}
            href={"https://www.livefromsnacktime.com/"}
            >
            </Link>{" "} */}
          @livefromsnacktime{" "}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              color: color,
              borderBottom: `2px solid ${isHovered ? color : "transparent"}`,
              paddingBottom: "4px",
              transition: "border-color 0.3s ease",
            }}
            href={"https://www.instagram.com/livefromsnacktime/"}
          >
            Instagram
          </Link>{" "}
          {/* <Link
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: color }}
            href={"https://www.facebook.com/livefromsnacktime/"}
          >
          </Link>{" "} */}
          Facebook , and{" "}
          {/* <Link
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: color }}
            href={"https://x.com/LiveFromSnackTi"}
          ></Link> */}
          X accounts!&rdquo;
        </p>

        <div className="w-full max-w-6xl p-6 sm:p-8 md:p-12 relative z-40">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
          >
            {/* Left column - Text inputs */}
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                  Your child&apos;s first name?
                </label>
                <input
                  type="text"
                  value={formData.childName}
                  onChange={(e) =>
                    setFormData({ ...formData, childName: e.target.value })
                  }
                  placeholder="Your child name"
                  className="outline-none w-full px-4 md:px-6 py-3 md:py-4 border-2 border-gray-300 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary text-base md:text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                  Your child&apos;s age?
                </label>
                <input
                  type="number"
                  value={formData.age ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      age: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  placeholder="Your child age"
                  className="outline-none w-full px-4 md:px-6 py-3 md:py-4 border-2 border-gray-300 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary text-base md:text-lg 
                            [&::-webkit-inner-spin-button]:appearance-none 
                            [&::-webkit-outer-spin-button]:appearance-none 
                            [appearance:textfield]"
                />
              </div>
              <div>
                <label className="block text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                  Enter Your Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Your Email"
                  className="outline-none w-full px-4 md:px-6 py-3 md:py-4 border-2 border-gray-300 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary text-base md:text-lg"
                />
              </div>

              <div>
                <label className="block text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                  {sidebarImage?.question}
                </label>
                <textarea
                  value={formData.quote}
                  onChange={(e) =>
                    setFormData({ ...formData, quote: e.target.value })
                  }
                  placeholder="Write your message here..."
                  className="w-full z-50 h-24 md:h-32 px-4 md:px-6 py-3 md:py-4 border-2 border-gray-300 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary resize-none text-base md:text-lg"
                  required
                />
              </div>
            </div>

            {/* Right column - Photo upload and submit */}
            <div className="space-y-4 md:space-y-6 relative z-50">
              <div className="shadow-[-1px_-4px_18px_3px_rgba(0,_0,_0,_0.1)] p-5 rounded-2xl bg-white">
                <div>
                  <label className="block text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                    Upload Photo
                  </label>

                  {/* Fixed: Entire drop zone is now clickable */}
                  <label className="block cursor-pointer">
                    <div className="border-2 md:border-4 border-dashed border-gray-300 rounded-xl md:rounded-2xl p-6 md:p-12 text-center hover:border-primary transition-colors">
                      {formData.photos ? (
                        <div className="relative">
                          <Image
                            src={preview || "/placeholder.svg"}
                            width={300}
                            height={300}
                            alt="Preview"
                            className="w-full h-48 md:h-64 object-cover rounded-lg md:rounded-xl mb-4"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setFormData({ ...formData, photos: null });
                              setPreview(null);
                            }}
                            className="text-red-500 hover:text-red-700 font-semibold text-sm md:text-base"
                          >
                            Remove Photo
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="mb-4">
                            <svg
                              className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-600 mb-4 text-sm md:text-base">
                            Choose the files you want to upload from your Photo
                          </p>
                          {/* <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-primary hover:bg-primary-hover text-white rounded-lg md:rounded-xl transition-colors">
                            <svg
                              className="w-5 h-5 md:w-6 md:h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </div> */}
                        </>
                      )}
                    </div>

                    {/* Hidden file input - now properly connected to the label */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="sr-only"
                      required
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-start gap-2 md:gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 md:w-5 md:h-5 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                  />
                  <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    I agree that by submitting a quote, I am allowing Live From
                    Snack Time to post it on their social accounts as well as
                    any marketing, promotional or merchandising materials in the
                    future, including but not limited to books, postcards,
                    clothing, and all additional merchandising opportunities
                    without attribution.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || uploading || formMutation.isPending}
                className="w-full py-3 md:py-4 bg-primary hover:bg-primary-hover cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg md:text-xl rounded-xl md:rounded-2xl transition-colors shadow-lg"
              >
                {uploading || formMutation.isPending
                  ? "Submitting..."
                  : "Submit"}
              </button>

              {/* Image positioned below the card */}
              <div
                className="absolute -top-24 md:-top-26 -right-28 md:-right-28 w-[200px] md:w-[200px] lg:w-[200px] h-[200px] md:h-[200px] lg:h-[200px] !-z-10"
                style={{ transform: "rotate(35deg)" }}
              >
                <Image
                  src={catImage2 || "/openeye.png"}
                  alt="decoration"
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
