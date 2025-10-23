'use client'
import DashboardHeader from '@/components/dashboard-header';
import { changeImageText } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';


const Page = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const changeImageTextMutation = useMutation({
    mutationKey: ['imagetext'],
    mutationFn: (data: FormData) => changeImageText(data),
    onSuccess: () => {
      toast.success('Display updated successfully!');
      formRef.current?.reset();
      setPreviewImage(null);
    },
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    changeImageTextMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Display Settings</h1>
              <p className="text-gray-600 mt-2">
                Customize your app&apos;s display content and sidebar image
              </p>
            </div>
            <DashboardHeader />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Question Input */}
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                  Display Question
                </label>
                <input
                  type="text"
                  name="question"
                  id="question"
                  placeholder="Enter the question you want to display..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sidebar Image
                </label>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  

                  {/* Upload Controls */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="sideImage" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          {/* <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p> */}
                        </div>
                        <input 
                          id="sideImage" 
                          name="sideImage" 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>

                    {/* <div className="text-sm text-gray-500">
                      <p>• Recommended size: 400x600px</p>
                      <p>• Formats: PNG, JPG, GIF</p>
                      <p>• Max file size: 10MB</p>
                    </div> */}
                  </div>
                  {/* Image Preview */}
                  <div className="flex flex-col items-center justify-center">
                    {previewImage ? (
                      <div className="relative w-full aspect-video max-w-md">
                        <Image
                          src={previewImage}
                          width={400}
                          height={400}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewImage(null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-full aspect-video max-w-md border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">No image selected</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => {
                    formRef.current?.reset();
                    setPreviewImage(null);
                  }}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Reset
                </button>
                
                <button
                  type="submit"
                  disabled={changeImageTextMutation.isPending}
                  className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  {changeImageTextMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Display'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Changes will be reflected immediately across your application
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;