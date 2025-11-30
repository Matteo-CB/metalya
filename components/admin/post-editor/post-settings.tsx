"use client";

import { Category } from "@prisma/client";
import { CategorySelector } from "@/components/admin/category-selector";
import { uploadImage } from "@/app/actions/media";
import { useState, useTransition } from "react";
import { Loader2, Upload } from "lucide-react";

interface PostSettingsProps {
  title: string;
  setTitle: (v: string) => void;
  excerpt: string;
  setExcerpt: (v: string) => void;
  coverImage: string;
  setCoverImage: (v: string) => void;
  readingTime: number;
  setReadingTime: (v: number) => void;
  categories: Category[];
  toggleCategory: (c: Category) => void;
}

export function PostSettings({
  title,
  setTitle,
  excerpt,
  setExcerpt,
  coverImage,
  setCoverImage,
  readingTime,
  setReadingTime,
  categories,
  toggleCategory,
}: PostSettingsProps) {
  const [isUploading, startUpload] = useTransition();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    startUpload(async () => {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadImage(formData);
      setCoverImage(url);
    });
  };

  return (
    <div className="space-y-8 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="font-serif text-lg font-medium text-neutral-900">
          Détails
        </h3>
        <p className="text-xs text-neutral-500">
          Ces informations sont cruciales pour le SEO.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Titre
          </label>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Le titre de votre histoire..."
            className="w-full border-b border-neutral-200 bg-transparent py-2 font-serif text-xl text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Extrait (SEO)
          </label>
          <textarea
            name="excerpt"
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={4}
            placeholder="Une courte description qui apparaîtra sur Google et les réseaux sociaux..."
            className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm leading-relaxed text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Image de couverture
          </label>
          <div className="flex gap-2">
            <input
              name="coverImage"
              required
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
            />
            <label className="flex cursor-pointer items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              {isUploading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Upload size={18} />
              )}
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Temps de lecture (min)
          </label>
          <input
            name="readingTime"
            type="number"
            value={readingTime}
            onChange={(e) => setReadingTime(Number(e.target.value))}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <CategorySelector selected={categories} onChange={toggleCategory} />
      </div>
    </div>
  );
}
