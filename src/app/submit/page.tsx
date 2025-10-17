"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SubmitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    childName: "",
    childAge: "",
    quote: "",
    photo: null as string | null,
  });
  const [agreed, setAgreed] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setUploading(true);

    // Store in localStorage
    const submissions = JSON.parse(localStorage.getItem("moments") || "[]");
    const newSubmission = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toISOString(),
    };
    submissions.push(newSubmission);
    localStorage.setItem("moments", JSON.stringify(submissions));

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push("/thank-you");
  };

  const isFormValid =
    formData.childName && formData.quote && formData.photo && agreed;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* First image moved to bottom */}
      <div
        className="absolute -bottom-3 md:-bottom-8 left-2 md:left-2 w-20 md:w-28 lg:w-32 h-20 md:h-28 lg:h-32"
        style={{
          transform: "rotate(50deg)",
        }}
      >
        <Image
          src="/formbottom.png"
          alt="bottom"
          fill
          className="object-contain"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16 min-h-screen flex flex-col items-center justify-center">
        <div className="mb-6 md:mb-8">
          <div className="flex justify-center lg:justify-start">
            <Image src={`/logo.png`} alt="logo" width={100} height={100} />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-3 md:mb-4 text-center text-balance px-4">
          Fill out a quick submission form
        </h1>
        <p className="text-base sm:text-lg text-[#343A40] mb-8 md:mb-12 text-center max-w-3xl text-balance px-4">
          Scan the QR code and submit your child&apos;s funniest quotes, photos,
          and moments—live on the big screen!
        </p>

        <div className="w-full max-w-6xl p-6 sm:p-8 md:p-12 relative">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
          >
            {/* Left column - Text inputs */}
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                  Your child&apos;s name?
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
                  value={formData.childAge}
                  onChange={(e) =>
                    setFormData({ ...formData, childAge: e.target.value })
                  }
                  placeholder="Your child age"
                  className="outline-none w-full px-4 md:px-6 py-3 md:py-4 border-2 border-gray-300 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary text-base md:text-lg"
                />
              </div>

              <div>
                <label className="block text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                  What did your child say, before/during/after the show that
                  made you laugh or smile?
                </label>
                <textarea
                  value={formData.quote}
                  onChange={(e) =>
                    setFormData({ ...formData, quote: e.target.value })
                  }
                  placeholder="Write your message here..."
                  className="w-full h-24 md:h-32 px-4 md:px-6 py-3 md:py-4 border-2 border-gray-300 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary resize-none text-base md:text-lg"
                  required
                />
              </div>
            </div>

            {/* Right column - Photo upload and submit */}
            <div className="space-y-4 md:space-y-6 relative z-50 ">
              <div className=" shadow-[-1px_-4px_18px_3px_rgba(0,_0,_0,_0.1)] p-5 rounded-2xl bg-white">
                <div>
                  <label className="block text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                    Upload Photo
                  </label>
                  <div className="border-2 md:border-4 border-dashed border-gray-300 rounded-xl md:rounded-2xl p-6 md:p-12 text-center hover:border-primary transition-colors">
                    {formData.photo ? (
                      <div className="relative">
                        <Image
                          src={formData.photo || "/placeholder.svg"}
                          width={300}
                          height={300}
                          alt="Preview"
                          className="w-full h-48 md:h-64 object-cover rounded-lg md:rounded-xl mb-4"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, photo: null })
                          }
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
                        <label className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-primary hover:bg-primary-hover text-white rounded-lg md:rounded-xl cursor-pointer transition-colors">
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
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            required
                          />
                        </label>
                      </>
                    )}
                  </div>
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
                disabled={!isFormValid || uploading}
                className="w-full py-3 md:py-4 bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg md:text-xl rounded-xl md:rounded-2xl transition-colors shadow-lg"
              >
                {uploading ? "Submitting..." : "Submit"}
              </button>

              {/* Image positioned below the card */}
              <div
                className="absolute -top-24 md:-top-26 -right-28 md:-right-28 w-[200px] md:w-[200px] lg:w-[200px] h-[200px] md:h-[200px] lg:h-[200px] !-z-10"
                style={{ transform: "rotate(30deg)" }}
              >
                <Image
                  src="/formright.png"
                  alt="ghjkl"
                  width={100}
                  height={100}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
