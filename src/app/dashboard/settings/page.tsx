"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";
import { Upload, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useThem } from "@/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { themChange } from "@/lib/api";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/dashboard-header";

// Extended Theme interface to include all properties
interface ExtendedTheme {
  colors?: string | string[];
  logo?: string | null;
  backgroundColors?: string[];
  backgroundColor?: string[];
  heroImage?: string | null;
  catImage?: (string | null)[];
}
interface ExtendedTheme {
  colors?: string | string[];
  logo?: string | null;
  backgroundColors?: string[];
  backgroundColor?: string[];
  heroImage?: string | null;
  catImage?: (string | null)[];
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, updateTheme } = useTheme();
  const { data, isLoading, error } = useThem();
  const queryClient = useQueryClient();

  // Cast theme to extended type
  const extendedTheme = theme as ExtendedTheme;

  // State for colors
  const [color, setColor] = useState<string>(
    (Array.isArray(extendedTheme.colors)
      ? extendedTheme.colors[0]
      : extendedTheme.colors) || "#a855f7"
  );
  const [backgroundColor, setBackgroundColor] = useState<string>(
    extendedTheme.backgroundColors?.[0] ||
      extendedTheme.backgroundColor?.[0] ||
      "#ffffff"
  );
  const [backgroundColor2, setBackgroundColor2] = useState<string>(
    extendedTheme.backgroundColors?.[1] ||
      extendedTheme.backgroundColor?.[1] ||
      "#f3f4f6"
  );
  const [backgroundColor3, setBackgroundColor3] = useState<string>(
    extendedTheme.backgroundColors?.[2] ||
      extendedTheme.backgroundColor?.[2] ||
      "#e5e7eb"
  );

  // State for images
  const [logoPreview, setLogoPreview] = useState<string | null>(
    extendedTheme.logo || null
  );
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(
    extendedTheme.heroImage || null
  );
  const [catImagePreview, setCatImagePreview] = useState<(string | null)[]>(
    extendedTheme.catImage || [null, null]
  );

  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [agreed] = useState<boolean>(true);

  const logo = data?.data?.logo;

  // File states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [catImageFiles, setCatImageFiles] = useState<(File | null)[]>([
    null,
    null,
  ]);

  // Update state when theme changes
  useEffect(() => {
    const extended = theme as ExtendedTheme;
    setColor(
      (Array.isArray(extended.colors) ? extended.colors[0] : extended.colors) ||
        "#a855f7"
    );
    setBackgroundColor(
      extended.backgroundColors?.[0] ||
        extended.backgroundColor?.[0] ||
        "#ffffff"
    );
    setBackgroundColor2(
      extended.backgroundColors?.[1] ||
        extended.backgroundColor?.[1] ||
        "#f3f4f6"
    );
    setBackgroundColor3(
      extended.backgroundColors?.[2] ||
        extended.backgroundColor?.[2] ||
        "#e5e7eb"
    );
    setLogoPreview(extended.logo || null);
    setHeroImagePreview(extended.heroImage || null);
    setCatImagePreview(extended.catImage || [null, null]);
  }, [theme]);

  const themMutation = useMutation({
    mutationFn: (data: FormData) => themChange(data),
    mutationKey: ["them"],
    onSuccess: (response) => {
      toast.success(response.message || "Theme updated successfully");
      queryClient.invalidateQueries({ queryKey: ["them"] });
      if (response.success) {
        updateTheme({
          colors: [color],
          backgroundColors: [
            backgroundColor,
            backgroundColor2,
            backgroundColor3,
          ],
          logo: logoPreview || undefined,
          heroImage: heroImagePreview || undefined,
          catImage: catImagePreview.filter(
            (img): img is string => img !== null
          ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        setHasChanges(false);
        // Reset file states after successful save
        setLogoFile(null);
        setHeroImageFile(null);
        setCatImageFiles([null, null]);
      }
    },
    onError: (err: Error) => {
      console.error("Failed to update theme:", err);
      const errorMessage =
        (
          err as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ||
        err?.message ||
        "Failed to update theme";
      toast.error(errorMessage);
    },
  });

  const handleBackgroundColorChange = (
    index: number,
    newColor: string
  ): void => {
    switch (index) {
      case 0:
        setBackgroundColor(newColor);
        break;
      case 1:
        setBackgroundColor2(newColor);
        break;
      case 2:
        setBackgroundColor3(newColor);
        break;
    }
    setHasChanges(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo file size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setHasChanges(true);
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Hero image file size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }

      setHeroImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string);
        setHasChanges(true);
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCatImageUpload =
    (index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0];
      if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Cat image file size should be less than 5MB");
          return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload a valid image file");
          return;
        }

        const newCatImageFiles = [...catImageFiles];
        newCatImageFiles[index] = file;
        setCatImageFiles(newCatImageFiles);

        const reader = new FileReader();
        reader.onloadend = () => {
          const newPreviews = [...catImagePreview];
          newPreviews[index] = reader.result as string;
          setCatImagePreview(newPreviews);
          setHasChanges(true);
        };
        reader.onerror = () => {
          toast.error("Failed to read file");
        };
        reader.readAsDataURL(file);
      }
    };

  const handleSave = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the terms");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Always append colors
      formDataToSend.append("color", color);
      formDataToSend.append("backgroundColor", backgroundColor);
      formDataToSend.append("backgroundColor", backgroundColor2);
      formDataToSend.append("backgroundColor", backgroundColor3);

      // Only append logo if there's a new file to upload
      if (logoFile) {
        console.log("Appending logo file:", logoFile.name);
        formDataToSend.append("logo", logoFile);
      }

      // Only append heroImage if there's a new file to upload
      if (heroImageFile) {
        console.log("Appending heroImage file:", heroImageFile.name);
        formDataToSend.append("heroImage", heroImageFile);
      }

      // Only append catImage files if there are new files to upload
      const validCatImages = catImageFiles.filter(
        (file): file is File => file !== null
      );
      if (validCatImages.length > 0) {
        console.log(
          "Appending catImage files:",
          validCatImages.map((f) => f.name)
        );
        validCatImages.forEach((file) => {
          formDataToSend.append("catImage", file);
        });
      }

      // Debug: Log what's being sent
      console.log("=== FormData contents ===");
      for (const pair of formDataToSend.entries()) {
        console.log(
          `${pair[0]}:`,
          pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]
        );
      }
      console.log("=== End FormData ===");

      await themMutation.mutateAsync(formDataToSend);
    } catch (err) {
      console.error("Save error:", err);
      toast.error("An error occurred while saving");
    }
  };

  const handleCancel = (): void => {
    const extended = theme as ExtendedTheme;
    setColor(
      (Array.isArray(extended.colors) ? extended.colors[0] : extended.colors) ||
        "#a855f7"
    );
    setBackgroundColor(
      extended.backgroundColors?.[0] ||
        extended.backgroundColor?.[0] ||
        "#ffffff"
    );
    setBackgroundColor2(
      extended.backgroundColors?.[1] ||
        extended.backgroundColor?.[1] ||
        "#f3f4f6"
    );
    setBackgroundColor3(
      extended.backgroundColors?.[2] ||
        extended.backgroundColor?.[2] ||
        "#e5e7eb"
    );
    setLogoPreview(extended.logo || null);
    setHeroImagePreview(extended.heroImage || null);
    setCatImagePreview(extended.catImage || [null, null]);
    setLogoFile(null);
    setHeroImageFile(null);
    setCatImageFiles([null, null]);
    setHasChanges(false);
  };

  const handleDeleteLogo = (): void => {
    setLogoPreview(null);
    setLogoFile(null);
    setHasChanges(true);
  };

  const handleDeleteHeroImage = (): void => {
    setHeroImagePreview(null);
    setHeroImageFile(null);
    setHasChanges(true);
  };

  const handleDeleteCatImage = (index: number): void => {
    const newPreviews = [...catImagePreview];
    newPreviews[index] = null;
    setCatImagePreview(newPreviews);

    const newFiles = [...catImageFiles];
    newFiles[index] = null;
    setCatImageFiles(newFiles);
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading theme settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading theme data</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">
              Welcome back! Here&apos;s what&apos;s happening with your app
              today.
            </p>
          </div>
          <DashboardHeader />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Primary Color Selection */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Change Primary Color
            </h2>
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="primary-color-picker"
                  className="text-sm font-medium text-gray-700"
                >
                  Select Color
                </label>
                <input
                  id="primary-color-picker"
                  type="color"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-20 h-20 rounded-lg cursor-pointer border-2 border-gray-300"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Preview
                </span>
                <div
                  className="w-20 h-20 rounded-lg border-2 border-gray-200 flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-white font-medium text-sm">Aa</span>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {color.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Background Colors */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Background Colors
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <label className="text-sm text-gray-600">
                    Background {index + 1}
                  </label>
                  <input
                    type="color"
                    value={
                      [backgroundColor, backgroundColor2, backgroundColor3][
                        index
                      ]
                    }
                    onChange={(e) =>
                      handleBackgroundColorChange(index, e.target.value)
                    }
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <div className="text-xs text-gray-500">
                    {
                      [backgroundColor, backgroundColor2, backgroundColor3][
                        index
                      ]
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image Upload */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Change Hero Image
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="hero-image-upload"
                accept="image/*"
                onChange={handleHeroImageUpload}
                className="hidden"
              />
              <label
                htmlFor="hero-image-upload"
                className="cursor-pointer block"
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm mb-2">Upload hero image</p>
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm"
                >
                  +
                </button>
              </label>
              {heroImagePreview && (
                <div className="mt-4 relative">
                  <Image
                    src={heroImagePreview}
                    alt="Hero preview"
                    width={200}
                    height={100}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteHeroImage}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cat Images Upload */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Change Cat&apos;s Images
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[0, 1].map((index) => (
                <div
                  key={index}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
                >
                  <input
                    type="file"
                    id={`cat-image-upload-${index}`}
                    accept="image/*"
                    onChange={handleCatImageUpload(index)}
                    className="hidden"
                  />
                  <label
                    htmlFor={`cat-image-upload-${index}`}
                    className="cursor-pointer block"
                  >
                    <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-xs mb-2">
                      Cat Image {index + 1}
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-primary text-white hover:bg-primary-hover text-xs"
                    >
                      +
                    </button>
                  </label>
                  {catImagePreview[index] && (
                    <div className="mt-2 relative">
                      <Image
                        src={catImagePreview[index] as string}
                        alt={`Cat image ${index + 1} preview`}
                        width={100}
                        height={100}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteCatImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white hover:bg-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Change Logo
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <label htmlFor="logo-upload" className="cursor-pointer block">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm mb-2">Upload logo</p>
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm"
                >
                  +
                </button>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={!hasChanges || themMutation.isPending}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || themMutation.isPending}
              className="flex-1 bg-primary hover:bg-primary-hover"
            >
              {themMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Logo Preview */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Logo Preview
          </h2>
          <div className="relative aspect-square rounded-full border-4 border-cyan-200 overflow-hidden bg-white flex items-center justify-center">
            {logoPreview ? (
              <>
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-contain p-8"
                  width={200}
                  height={200}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("logo-upload")?.click()
                    }
                    className="p-2 rounded-lg bg-primary text-white hover:bg-primary-hover"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteLogo}
                    className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="bg-white p-4 rounded-xl transform -rotate-3 inline-block">
                  <div className="mt-[40px] flex justify-start">
                    <div className="flex justify-center lg:justify-start">
                      <Image
                        src={logo || `/logo2.svg`}
                        alt="logo"
                        width={800}
                        height={800}
                        className="max-w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
