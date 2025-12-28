"use client";

import { Category } from "@prisma/client";
import { CategorySelector } from "@/components/admin/category-selector";
import { uploadImage } from "@/app/actions/media";
import { useState, useTransition } from "react";

interface PostSettingsProps {
  title: string;
  setTitle: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
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
  slug,
  setSlug,
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

  // Petit helper pour nettoyer le slug à la volée si l'utilisateur le tape
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-") // Remplace les caractères spéciaux par des tirets
      .replace(/-+/g, "-"); // Évite les doubles tirets
    setSlug(val);
  };

  return (
    <div className="space-y-8 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="font-serif text-lg font-medium text-neutral-900">
          Configuration
        </h3>
        <p className="text-xs text-neutral-500">
          Optimisation pour les moteurs de recherche.
        </p>
      </div>

      <div className="space-y-6">
        {/* TITRE */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Titre de l'article
          </label>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Le titre de votre histoire..."
            className="w-full border-b border-neutral-200 bg-transparent py-2 font-serif text-xl text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors"
          />
        </div>

        {/* SLUG (URL) - AJOUTÉ */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            URL personnalisée (Slug)
          </label>
          <div className="flex items-center gap-2 border-b border-neutral-200 py-2 focus-within:border-neutral-900 transition-colors">
            <span className="text-xs text-neutral-400 shrink-0">/posts/</span>
            <input
              name="slug"
              required
              value={slug}
              onChange={handleSlugChange}
              placeholder="mon-super-article"
              className="w-full bg-transparent font-mono text-sm text-neutral-600 placeholder:text-neutral-300 focus:outline-none"
            />
          </div>
          <p className="text-[10px] text-neutral-400">
            Laissez vide pour générer automatiquement depuis le titre.
          </p>
        </div>

        {/* EXTRAIT */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Description courte
          </label>
          <textarea
            name="excerpt"
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={4}
            placeholder="Ce texte apparaîtra sur Google et les partages..."
            className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm leading-relaxed text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* IMAGE */}
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
              className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none transition-all"
            />
            <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 hover:border-neutral-300">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              {isUploading ? (
                // SVG Spinner Loader
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                // SVG Upload Icon
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              )}
            </label>
          </div>
        </div>

        {/* TEMPS DE LECTURE */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Temps de lecture (min)
          </label>
          <input
            name="readingTime"
            type="number"
            value={readingTime}
            onChange={(e) => setReadingTime(Number(e.target.value))}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none transition-all"
          />
        </div>

        {/* CATEGORIES */}
        <CategorySelector selected={categories} onChange={toggleCategory} />
      </div>
    </div>
  );
}
