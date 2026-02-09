'use client';

import { useState, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

interface AddSneakerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddSneakerModal({ isOpen, onClose }: AddSneakerModalProps) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Rating states
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
      alert('Bitte fülle alle Felder aus und wähle ein Bild');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Get upload URL
      const uploadUrl = await generateUploadUrl();

      // 2. Upload the image
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': image.type },
        body: image,
      });

      if (!result.ok) {
        throw new Error('Upload failed');
      }

      const { storageId } = await result.json();

      // 3. Save sneaker to database
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

      // 4. Reset form and close modal
      setName('');
      setBrand('');
      setComment('');
      setImage(null);
      setImagePreview(null);
      setRatingDesign(3);
      setRatingComfort(3);
      setRatingQuality(3);
      setRatingValue(3);
      onClose();
    } catch (error) {
      console.error('Error uploading sneaker:', error);
      alert('Fehler beim Hochladen. Bitte versuche es erneut.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background border-2 border-slate-200 dark:border-slate-800 rounded-lg p-8 w-full max-w-3xl mx-4 shadow-xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sneaker hinzufügen</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name and Brand in a row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block mb-2 font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Air Jordan 1"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-background"
                required
              />
            </div>

            {/* Brand Input */}
            <div>
              <label htmlFor="brand" className="block mb-2 font-medium">
                Marke
              </label>
              <input
                id="brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="z.B. Nike"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-background"
                required
              />
            </div>
          </div>

          {/* Comment Input */}
          <div>
            <label htmlFor="comment" className="block mb-2 font-medium">
              Kommentar
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Dein Kommentar..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-background resize-none"
              required
            />
          </div>

          {/* Rating Sliders */}
          <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-6">
            <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-300 mb-3">Bewertung</h3>
            
            {/* Ratings in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Design */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Design</label>
                  <span className="text-sm font-bold text-foreground">{ratingDesign}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={ratingDesign}
                  onChange={(e) => setRatingDesign(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-foreground"
                />
              </div>

              {/* Comfort */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Comfort</label>
                  <span className="text-sm font-bold text-foreground">{ratingComfort}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={ratingComfort}
                  onChange={(e) => setRatingComfort(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-foreground"
                />
              </div>

              {/* Quality */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Quality</label>
                  <span className="text-sm font-bold text-foreground">{ratingQuality}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={ratingQuality}
                  onChange={(e) => setRatingQuality(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-foreground"
                />
              </div>

              {/* Value for Money */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Value for Money</label>
                  <span className="text-sm font-bold text-foreground">{ratingValue}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={ratingValue}
                  onChange={(e) => setRatingValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-foreground"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 font-medium">Bild</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md p-4 cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  <span>Klicke um ein Bild hochzuladen</span>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className="bg-foreground text-background px-6 py-3 rounded-md hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
          >
            {isUploading ? 'Wird hochgeladen...' : 'Speichern'}
          </button>
        </form>
      </div>
    </div>
  );
}
