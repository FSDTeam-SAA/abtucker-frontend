"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
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

interface ExtendedTheme {
  colors?: string | string[];
  logo?: string | null;
  backgroundColors?: string[];
  backgroundColor?: string[];
  heroImage?: string | null;
  catImage?: (string | null)[];
}

// Constants
const DEFAULT_COLORS = {
  primary: "#a855f7",
  backgrounds: ["#ffffff", "#f3f4f6", "#e5e7eb", "#d1d5db"]
};

const FILE_VALIDATION = {
  maxSize: 5 * 1024 * 1024,
  types: ["image/"]
} as const;

// Custom hooks
const useThemeState = (theme: ExtendedTheme) => {
  const [color, setColor] = useState<string>(DEFAULT_COLORS.primary);
  const [backgroundColors, setBackgroundColors] = useState<string[]>([...DEFAULT_COLORS.backgrounds]);
  const [imagePreviews, setImagePreviews] = useState({
    logo: null as string | null,
    heroImage: null as string | null,
    catImages: [null, null] as (string | null)[]
  });
  const [files, setFiles] = useState({
    logo: null as File | null,
    heroImage: null as File | null,
    catImages: [null, null] as (File | null)[]
  });

  // Initialize state from theme
  useEffect(() => {
    const extended = theme as ExtendedTheme;
    
    setColor(
      (Array.isArray(extended.colors) ? extended.colors[0] : extended.colors) || DEFAULT_COLORS.primary
    );

    const themeBackgrounds = extended.backgroundColors || extended.backgroundColor;
    // Ensure we always have exactly 4 background colors
    if (themeBackgrounds?.length) {
      const colors = [...themeBackgrounds];
      // Pad with defaults if less than 4
      while (colors.length < 4) {
        colors.push(DEFAULT_COLORS.backgrounds[colors.length]);
      }
      setBackgroundColors(colors.slice(0, 4));
    } else {
      setBackgroundColors([...DEFAULT_COLORS.backgrounds]);
    }

    setImagePreviews({
      logo: extended.logo || null,
      heroImage: extended.heroImage || null,
      catImages: extended.catImage || [null, null]
    });
  }, [theme]);

  const updateBackgroundColor = useCallback((index: number, newColor: string) => {
    setBackgroundColors(prev => {
      const newColors = [...prev];
      newColors[index] = newColor;
      return newColors;
    });
  }, []);

  const updateImage = useCallback((type: 'logo' | 'heroImage' | 'catImages', file: File | null, preview: string | null, index?: number) => {
    if (type === 'catImages' && index !== undefined) {
      setImagePreviews(prev => ({
        ...prev,
        catImages: prev.catImages.map((img, i) => i === index ? preview : img)
      }));
      setFiles(prev => ({
        ...prev,
        catImages: prev.catImages.map((f, i) => i === index ? file : f)
      }));
    } else {
      setImagePreviews(prev => ({ ...prev, [type]: preview }));
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  }, []);

  const deleteImage = useCallback((type: 'logo' | 'heroImage' | 'catImages', index?: number) => {
    updateImage(type, null, null, index);
  }, [updateImage]);

  const resetState = useCallback((newTheme: ExtendedTheme) => {
    const extended = newTheme;
    
    setColor(
      (Array.isArray(extended.colors) ? extended.colors[0] : extended.colors) || DEFAULT_COLORS.primary
    );

    const themeBackgrounds = extended.backgroundColors || extended.backgroundColor;
    // Ensure we always have exactly 4 background colors
    if (themeBackgrounds?.length) {
      const colors = [...themeBackgrounds];
      while (colors.length < 4) {
        colors.push(DEFAULT_COLORS.backgrounds[colors.length]);
      }
      setBackgroundColors(colors.slice(0, 4));
    } else {
      setBackgroundColors([...DEFAULT_COLORS.backgrounds]);
    }

    setImagePreviews({
      logo: extended.logo || null,
      heroImage: extended.heroImage || null,
      catImages: extended.catImage || [null, null]
    });

    setFiles({
      logo: null,
      heroImage: null,
      catImages: [null, null]
    });
  }, []);

  return {
    color,
    setColor,
    backgroundColors,
    updateBackgroundColor,
    imagePreviews,
    files,
    updateImage,
    deleteImage,
    resetState
  };
};

const useFileHandler = () => {
  const validateFile = useCallback((file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return false;
    }
    return true;
  }, []);

  const readFileAsDataURL = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }, []);

  return { validateFile, readFileAsDataURL };
};

// Sub-components
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading theme settings...</p>
    </div>
  </div>
);

const ErrorState = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <p className="text-red-600 mb-4">Error loading theme data</p>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  </div>
);

const ImageUploader: React.FC<{
  label: string;
  preview: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  accept?: string;
  aspectRatio?: string;
  showEditButton?: boolean;
}> = ({ label, preview, onUpload, onDelete, accept = "image/*", aspectRatio = "aspect-auto", showEditButton = false }) => (
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
    <input
      type="file"
      id={`${label.toLowerCase().replace(/\s+/g, '-')}-upload`}
      accept={accept}
      onChange={onUpload}
      className="hidden"
    />
    <label
      htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}-upload`}
      className="cursor-pointer block"
    >
      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-600 text-sm mb-2">Upload {label.toLowerCase()}</p>
      <button
        type="button"
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm"
      >
        +
      </button>
    </label>
    {preview && (
      <div className="mt-4 relative">
        <Image
          src={preview}
          alt={`${label} preview`}
          width={200}
          height={100}
          className={`w-full h-32 object-cover rounded ${aspectRatio}`}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {showEditButton && (
            <button
              type="button"
              onClick={() => document.getElementById(`${label.toLowerCase().replace(/\s+/g, '-')}-upload`)?.click()}
              className="p-1 rounded-full bg-primary text-white hover:bg-primary-hover"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="p-1 rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    )}
  </div>
);

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, updateTheme } = useTheme();
  const { data, isLoading, error } = useThem();
  const queryClient = useQueryClient();

  const {
    color,
    setColor,
    backgroundColors,
    updateBackgroundColor,
    imagePreviews,
    files,
    updateImage,
    deleteImage,
    resetState
  } = useThemeState(theme);

  const { validateFile, readFileAsDataURL } = useFileHandler();
  const [hasChanges, setHasChanges] = useState(false);

  // Memoized theme data for API call
  const themeData = useMemo(() => ({
    colors: [color],
    backgroundColors,
    logo: imagePreviews.logo || undefined,
    heroImage: imagePreviews.heroImage || undefined,
    catImage: imagePreviews.catImages.filter((img): img is string => img !== null),
  }), [color, backgroundColors, imagePreviews]);

  const themMutation = useMutation({
    mutationFn: (formData: FormData) => themChange(formData),
    mutationKey: ["them"],
    onSuccess: (response) => {
      toast.success(response.message || "Theme updated successfully");
      queryClient.invalidateQueries({ queryKey: ["them"] });
      
      if (response.success) {
        updateTheme(themeData);
        setHasChanges(false);
        resetState(theme);
      }
    },
    onError: (err: Error) => {
      console.error("Failed to update theme:", err);
      const errorMessage = (
        err as { response?: { data?: { message?: string } } }
      )?.response?.data?.message || err.message || "Failed to update theme";
      toast.error(errorMessage);
    },
  });

  // File upload handlers
  const createFileUploadHandler = useCallback((type: 'logo' | 'heroImage' | 'catImages', index?: number) => 
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!validateFile(file)) return;

      try {
        const preview = await readFileAsDataURL(file);
        updateImage(type, file, preview, index);
        setHasChanges(true);
      } catch {
        toast.error("Failed to read file");
      }
    },
    [validateFile, readFileAsDataURL, updateImage]
  );

  const handleSave = useCallback(async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      
      // Append colors
      formData.append("color", color);
      backgroundColors.forEach(bgColor => {
        formData.append("backgroundColor", bgColor);
      });

      // Append files if they exist
      if (files.logo) formData.append("logo", files.logo);
      if (files.heroImage) formData.append("heroImage", files.heroImage);
      
      files.catImages.forEach(file => {
        if (file) formData.append("catImage", file);
      });

      await themMutation.mutateAsync(formData);
    } catch (err) {
      console.error("Save error:", err);
      toast.error("An error occurred while saving");
    }
  }, [color, backgroundColors, files, themMutation]);

  const handleCancel = useCallback(() => {
    resetState(theme);
    setHasChanges(false);
  }, [resetState, theme]);

  // Effect to track changes
  useEffect(() => {
    const currentTheme = theme as ExtendedTheme;
    const hasColorChanged = color !== ((Array.isArray(currentTheme.colors) ? currentTheme.colors[0] : currentTheme.colors) || DEFAULT_COLORS.primary);
    
    const currentBackgrounds = currentTheme.backgroundColors || currentTheme.backgroundColor || DEFAULT_COLORS.backgrounds;
    const hasBackgroundsChanged = backgroundColors.some((bg, i) => bg !== (currentBackgrounds[i] || DEFAULT_COLORS.backgrounds[i]));
    
    const hasImagesChanged = 
      imagePreviews.logo !== currentTheme.logo ||
      imagePreviews.heroImage !== currentTheme.heroImage ||
      imagePreviews.catImages.some((img, i) => img !== (currentTheme.catImage?.[i] || null));

    setHasChanges(hasColorChanged || hasBackgroundsChanged || hasImagesChanged);
  }, [color, backgroundColors, imagePreviews, theme]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  const logo = data?.data?.logo;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">
              Welcome back! Here&apos;s what&apos;s happening with your app today.
            </p>
          </div>
          <DashboardHeader />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Primary Color Selection */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Change Primary Color
            </h2>
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="primary-color-picker" className="text-sm font-medium text-gray-700">
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
                <span className="text-sm font-medium text-gray-700">Preview</span>
                <div
                  className="w-20 h-20 rounded-lg border-2 border-gray-200 flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-white font-medium text-sm">Aa</span>
                </div>
                <div className="text-xs text-gray-500 text-center">{color.toUpperCase()}</div>
              </div>
            </div>
          </div>

          {/* Background Colors */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Background Colors (4 Colors)
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {backgroundColors.map((bgColor, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <label className="text-sm text-gray-600 font-medium">BG {index + 1}</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => {
                      updateBackgroundColor(index, e.target.value);
                      setHasChanges(true);
                    }}
                    className="w-16 h-16 rounded cursor-pointer border-2 border-gray-300"
                  />
                  <div className="text-xs text-gray-500 text-center break-all">{bgColor}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image Upload */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Change Hero Image
            </h2>
            <ImageUploader
              label="hero image"
              preview={imagePreviews.heroImage}
              onUpload={createFileUploadHandler('heroImage')}
              onDelete={() => deleteImage('heroImage')}
            />
          </div>

          {/* Cat Images Upload */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Change Cat Images
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {imagePreviews.catImages.map((preview, index) => (
                <ImageUploader
                  key={index}
                  label={`cat image ${index + 1}`}
                  preview={preview}
                  onUpload={createFileUploadHandler('catImages', index)}
                  onDelete={() => deleteImage('catImages', index)}
                  aspectRatio="aspect-square"
                />
              ))}
            </div>
          </div>

          {/* Logo Upload */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Change Logo
            </h2>
            <ImageUploader
              label="logo"
              preview={imagePreviews.logo}
              onUpload={createFileUploadHandler('logo')}
              onDelete={() => deleteImage('logo')}
            />
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
            style={{
              backgroundColor: color
            }}
              onClick={handleSave}
              disabled={!hasChanges || themMutation.isPending}
              className="flex-1 bg-primary hover:bg-primary-hover"
            >
              {themMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Logo Preview */}
        <div className="bg-white p-6 rounded-lg shadow  h-fit">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Logo Preview
          </h2>
          <div style={
            { 
              borderColor: color
            }
          } className="relative aspect-square rounded-full border-4  overflow-hidden bg-white flex items-center justify-center">
            {imagePreviews.logo ? (
              <>
                <Image
                  src={imagePreviews.logo}
                  alt="Logo preview"
                  className="w-full h-full object-contain p-8"
                  width={200}
                  height={200}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById("logo-upload")?.click()}
                    className="p-2 rounded-lg bg-primary text-white hover:bg-primary-hover"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteImage('logo')}
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