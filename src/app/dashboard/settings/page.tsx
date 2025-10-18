"use client";

import type React from "react";

import { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";
import { Check, Upload, Edit2, Trash2 } from "lucide-react";
import { getStoredUser } from "@/lib/auth";
import Image from "next/image";

const COLOR_PRESETS = [
  { id: "purple", colors: ["#a855f7", "#d8b4fe"], label: "Purple" },
  { id: "pink", colors: ["#ec4899", "#fbcfe8"], label: "Pink" },
  { id: "cyan", colors: ["#06b6d4", "#a5f3fc"], label: "Cyan" },
];

export default function SettingsPage() {
  const user = getStoredUser();
  const { theme, updateTheme } = useTheme();
  const [selectedColors, setSelectedColors] = useState(theme.colors);
  const [logoPreview, setLogoPreview] = useState(theme.logo);
  const [hasChanges, setHasChanges] = useState(false);

  const handleColorSelect = (colors: string[]) => {
    setSelectedColors(colors);
    setHasChanges(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateTheme({ colors: selectedColors, logo: logoPreview });
    setHasChanges(false);
  };

  const handleCancel = () => {
    setSelectedColors(theme.colors);
    setLogoPreview(theme.logo);
    setHasChanges(false);
  };

  const handleDeleteLogo = () => {
    setLogoPreview(null);
    setHasChanges(true);
  };

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
          <div className="flex items-center gap-3">
            <Image
              width={40}
              height={40}
              src="/placeholder.svg?height=40&width=40"
              alt={user?.name || "User"}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-semibold text-gray-900">
                {user?.name || "Olivia Rhye"}
              </div>
              <div className="text-sm text-gray-600">
                {user?.email || "olivia@untitledui.com"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Change Color
            </h2>
            <div className="flex gap-4">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleColorSelect(preset.colors)}
                  className="relative p-4 border-2 rounded-lg hover:border-gray-400 transition-colors"
                  style={{
                    borderColor:
                      selectedColors[0] === preset.colors[0] &&
                      selectedColors[1] === preset.colors[1]
                        ? preset.colors[0]
                        : "#e5e7eb",
                  }}
                >
                  {selectedColors[0] === preset.colors[0] &&
                    selectedColors[1] === preset.colors[1] && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  <div className="flex gap-2">
                    <div
                      className="w-12 h-12 rounded"
                      style={{ backgroundColor: preset.colors[0] }}
                    />
                    <div
                      className="w-12 h-12 rounded"
                      style={{ backgroundColor: preset.colors[1] }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Change Logo
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Browse and chose the files you want to upload from your Photo
                </p>
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white hover:bg-primary-hover"
                >
                  +
                </button>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={!hasChanges}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex-1 bg-primary hover:bg-primary-hover"
            >
              Save Changes
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Logo Preview
          </h2>
          <div className="relative aspect-square rounded-full border-4 border-cyan-200 overflow-hidden bg-white flex items-center justify-center">
            {logoPreview ? (
              <>
                <Image
                  src={logoPreview || "/placeholder.svg"}
                  alt="Logo preview"
                  className="w-full h-full object-contain p-8"
                  width={200}
                  height={200}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="p-2 rounded-lg bg-primary text-white hover:bg-primary-hover">
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleDeleteLogo}
                    className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="bg-white p-4 rounded-xl  transform -rotate-3 inline-block">
                  <div className="mt-[40px] flex justify-start">
                          <div className="flex justify-center lg:justify-start">
                            <Image src={`/logo2.svg`} alt="logo" width={800} height={800}  />
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
