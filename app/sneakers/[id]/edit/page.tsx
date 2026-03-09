"use client";

import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
            <div className="text-lg text-slate-600">Sneaker nicht gefunden</div>
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
            <div className="text-lg text-slate-600">Du bist nicht berechtigt, diesen Sneaker zu bearbeiten</div>
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
      setError("Name und Marke sind erforderlich");
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
          throw new Error("Bild-Upload fehlgeschlagen");
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
      setError(err instanceof Error ? err.message : "Fehler beim Aktualisieren");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto max-w-2xl p-8">
        <Link
          href={`/sneakers/${sneakerId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Zurück
        </Link>

        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-3xl font-bold text-slate-900">Sneaker bearbeiten</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Bild</label>
              <div className="space-y-3">
                {/* Current or Preview Image */}
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-100">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Vorschau" className="h-full w-full object-cover" />
                  ) : sneaker ? (
                    <Image src={sneaker.imageUrl} alt={sneaker.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="size-12 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                >
                  {imagePreview ? "Anderes Bild wählen" : "Neues Bild hochladen"}
                </button>
                {!imagePreview && (
                  <p className="text-sm text-slate-500">
                    Optional: Lade ein neues Bild hoch, um das aktuelle zu ersetzen
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 focus:outline-none"
                placeholder="z.B. Air Jordan 1 Retro High"
                required
              />
            </div>

            <div>
              <label htmlFor="brand" className="mb-2 block text-sm font-semibold text-slate-700">
                Marke *
              </label>
              <input
                id="brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 focus:outline-none"
                placeholder="z.B. Nike"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">
                Beschreibung
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 focus:outline-none"
                placeholder="Beschreibe den Sneaker..."
              />
            </div>

            {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:bg-slate-400"
              >
                {isSubmitting ? "Speichern..." : "Speichern"}
              </button>
              <Link
                href={`/sneakers/${sneakerId}`}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-center font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-50"
              >
                Abbrechen
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
