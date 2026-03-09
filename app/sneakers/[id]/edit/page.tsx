"use client";

import { useMutation, useQuery } from "convex/react";
import { ChevronLeft, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Header } from "../../../../components/Header";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function EditSneakerPage() {
  const params = useParams();
  const router = useRouter();
  const sneakerId = params.id as Id<"sneakers">;

  const sneaker = useQuery(api.sneakers.getSneakerById, { sneakerId });
  const currentUser = useQuery(api.users.getCurrentUser);
  const updateSneaker = useMutation(api.sneakers.updateSneaker);
  const generateUploadUrl = useMutation(api.sneakers.generateUploadUrl);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when sneaker loads
  useState(() => {
    if (sneaker && name === "") {
      setName(sneaker.name);
      setBrand(sneaker.brand);
      setDescription(sneaker.description || "");
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (sneaker === undefined || currentUser === undefined) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto p-8">
          <div className="flex min-h-100 items-center justify-center">
            <div className="text-lg text-slate-600">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  if (sneaker === null) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto p-8">
          <div className="flex min-h-100 items-center justify-center">
            <div className="text-lg text-slate-600">Sneaker not found</div>
          </div>
        </main>
      </div>
    );
  }

  if (!currentUser || sneaker.creatorId !== currentUser._id) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto p-8">
          <div className="flex min-h-100 items-center justify-center">
            <div className="text-lg text-slate-600">You are not authorized to edit this sneaker</div>
          </div>
        </main>
      </div>
    );
  }

  // Initialize form if not already done
  if (name === "" && sneaker) {
    setName(sneaker.name);
    setBrand(sneaker.brand);
    setDescription(sneaker.description || "");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !brand.trim()) {
      setError("Name and brand are required");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageStorageId: Id<"_storage"> | undefined;

      // Upload new image if provided
      if (newImage) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": newImage.type },
          body: newImage,
        });

        if (!result.ok) {
          throw new Error("Image upload failed");
        }

        const { storageId } = await result.json();
        imageStorageId = storageId;
      }

      await updateSneaker({
        sneakerId,
        name: name.trim(),
        brand: brand.trim(),
        description: description.trim(),
        imageStorageId,
      });
      router.push(`/sneakers/${sneakerId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        actionButton={{
          label: "Back",
          icon: ChevronLeft,
          href: `/sneakers/${sneakerId}`,
        }}
      />

      {/* Main Content */}
      <main className="container mx-auto max-w-3xl px-4 py-6 md:py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Edit Sneaker</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload - Featured */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Sneaker Image</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 transition-all hover:border-slate-400 hover:bg-slate-100/50"
              >
                {imagePreview ? (
                  <div className="relative flex h-64 w-full items-center justify-center bg-slate-50 p-6">
                    {/* Using native img instead of Next.js Image for local preview (data URL) before upload */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-full max-w-full rounded-lg object-contain shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-5" />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="rounded-md bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        Click to change
                      </span>
                    </div>
                  </div>
                ) : sneaker ? (
                  <div className="relative flex h-64 w-full items-center justify-center bg-slate-50 p-6">
                    <Image
                      src={sneaker.imageUrl}
                      alt={sneaker.name}
                      width={256}
                      height={256}
                      className="max-h-full max-w-full rounded-lg object-contain shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-5" />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="rounded-md bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        Click to change
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-10 text-slate-500">
                    <ImageIcon className="h-12 w-12" />
                    <span className="text-sm font-medium">Click to upload an image</span>
                    <span className="text-xs text-slate-400">PNG, JPG, WEBP, AVIF up to 10MB</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Name and Brand */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Air Jordan 1"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="brand" className="mb-2 block text-sm font-medium text-slate-700">
                  Brand
                </label>
                <input
                  id="brand"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Nike"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your sneakers..."
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push(`/sneakers/${sneakerId}`)}
                className="w-full rounded-lg bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
