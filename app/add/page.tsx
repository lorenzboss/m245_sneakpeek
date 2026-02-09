"use client";

import { useMutation } from "convex/react";
import { ChevronLeft, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Header } from "../../components/Header";
import { api } from "../../convex/_generated/api";

export default function AddSneakerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [ratingDesign, setRatingDesign] = useState(3);
  const [ratingComfort, setRatingComfort] = useState(3);
  const [ratingQuality, setRatingQuality] = useState(3);
  const [ratingValue, setRatingValue] = useState(3);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.sneakers.generateUploadUrl);
  const addSneaker = useMutation(api.sneakers.addSneaker);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !brand || !comment || !image) {
      alert("Please fill out all fields and select an image");
      return;
    }

    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": image.type },
        body: image,
      });

      if (!result.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await result.json();

      await addSneaker({
        name,
        brand,
        comment,
        imageStorageId: storageId,
        ratingDesign,
        ratingComfort,
        ratingQuality,
        ratingValue,
      });

      router.push("/");
    } catch (error) {
      console.error("Error uploading sneaker:", error);
      alert("Upload error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        actionButton={{
          label: "Back",
          icon: ChevronLeft,
          href: "/",
        }}
      />

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl px-2 py-8 md:px-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">Create New Sneaker</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload - Featured */}
            <div>
              <label className="mb-3 block text-lg font-semibold text-slate-900">Sneaker Image</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-white transition-all hover:border-slate-400 hover:bg-slate-50"
              >
                {imagePreview ? (
                  <div className="relative flex h-80 w-full items-center justify-center bg-slate-50 p-8">
                    {/* Using native img instead of Next.js Image for local preview (data URL) before upload */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-full max-w-full rounded-lg object-contain shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-10" />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Click to change
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-12 text-slate-500">
                    <ImageIcon className="h-16 w-16" />
                    <span className="text-lg font-medium">Click to upload an image</span>
                    <span className="text-sm text-slate-400">PNG, JPG, WEBP, AVIF up to 10MB</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                onChange={handleImageChange}
                className="hidden"
                required
              />
            </div>

            {/* Name and Brand */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block font-semibold text-slate-900">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Air Jordan 1"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-all outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="brand" className="mb-2 block font-semibold text-slate-900">
                  Brand
                </label>
                <input
                  id="brand"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Nike"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-all outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  required
                />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="mb-2 block font-semibold text-slate-900">
                Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about these sneakers..."
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-all outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>

            {/* Ratings */}
            <div className="space-y-6 border-t border-slate-200 pt-8">
              <h3 className="text-xl font-bold text-slate-900">Rate Your Sneakers</h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Design */}
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-3 flex justify-between">
                    <label className="font-semibold text-slate-900">Design</label>
                    <span className="text-xl font-bold text-slate-900">{ratingDesign}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={ratingDesign}
                    onChange={(e) => setRatingDesign(Number(e.target.value))}
                    className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-slate-900"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Comfort */}
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-3 flex justify-between">
                    <label className="font-semibold text-slate-900">Comfort</label>
                    <span className="text-xl font-bold text-slate-900">{ratingComfort}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={ratingComfort}
                    onChange={(e) => setRatingComfort(Number(e.target.value))}
                    className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-slate-900"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Quality */}
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-3 flex justify-between">
                    <label className="font-semibold text-slate-900">Quality</label>
                    <span className="text-xl font-bold text-slate-900">{ratingQuality}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={ratingQuality}
                    onChange={(e) => setRatingQuality(Number(e.target.value))}
                    className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-slate-900"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Value for Money */}
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-3 flex justify-between">
                    <label className="font-semibold text-slate-900">Value for Money</label>
                    <span className="text-xl font-bold text-slate-900">{ratingValue}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={ratingValue}
                    onChange={(e) => setRatingValue(Number(e.target.value))}
                    className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-slate-900"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex-1 rounded-lg bg-slate-200 px-4 py-4 text-lg font-semibold text-slate-900 transition-colors hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 rounded-lg bg-slate-900 px-4 py-4 text-lg font-semibold text-white shadow-md transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Save Sneaker"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
