'use client';

import { useState, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useRouter } from 'next/navigation';

export default function AddSneakerPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [comment, setComment] = useState('');
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
      alert('Please fill out all fields and select an image');
      return;
    }

    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();

      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': image.type },
        body: image,
      });

      if (!result.ok) {
        throw new Error('Upload failed');
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

      router.push('/');
    } catch (error) {
      console.error('Error uploading sneaker:', error);
      alert('Upload error. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => router.push('/')}
            className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
          <h1 className="flex-1 text-2xl font-bold text-center text-slate-900">Add Sneaker</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload - Featured */}
            <div>
              <label className="block mb-3 font-semibold text-slate-900 text-lg">Sneaker Image</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 cursor-pointer hover:border-slate-400 transition-all bg-white hover:bg-slate-50 group"
              >
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-96 object-contain rounded-lg" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 bg-slate-900 px-4 py-2 rounded-lg text-sm">
                        Click to change
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-12 text-slate-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-16 h-16"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                    <span className="text-lg font-medium">Click to upload an image</span>
                    <span className="text-sm text-slate-400">PNG, JPG up to 10MB</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required
              />
            </div>

            {/* Name and Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-semibold text-slate-900">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Air Jordan 1"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all text-slate-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="brand" className="block mb-2 font-semibold text-slate-900">
                  Brand
                </label>
                <input
                  id="brand"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Nike"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block mb-2 font-semibold text-slate-900">
                Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about these sneakers..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all resize-none text-slate-900"
                required
              />
            </div>

            {/* Ratings */}
            <div className="space-y-6 border-t border-slate-200 pt-8">
              <h3 className="font-bold text-xl text-slate-900">Rate Your Sneakers</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Design */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-3">
                    <label className="font-semibold text-slate-900">Design</label>
                    <span className="text-xl font-bold text-slate-900">{ratingDesign}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={ratingDesign}
                    onChange={(e) => setRatingDesign(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Comfort */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-3">
                    <label className="font-semibold text-slate-900">Comfort</label>
                    <span className="text-xl font-bold text-slate-900">{ratingComfort}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={ratingComfort}
                    onChange={(e) => setRatingComfort(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Quality */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-3">
                    <label className="font-semibold text-slate-900">Quality</label>
                    <span className="text-xl font-bold text-slate-900">{ratingQuality}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={ratingQuality}
                    onChange={(e) => setRatingQuality(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Value for Money */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-3">
                    <label className="font-semibold text-slate-900">Value for Money</label>
                    <span className="text-xl font-bold text-slate-900">{ratingValue}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={ratingValue}
                    onChange={(e) => setRatingValue(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 bg-slate-200 text-slate-900 px-6 py-4 rounded-lg hover:bg-slate-300 transition-colors font-semibold text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 bg-slate-900 text-white px-6 py-4 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-md"
              >
                {isUploading ? 'Uploading...' : 'Save Sneaker'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
