"use client";

import Image from "next/image";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { Category } from "@prisma/client";
import { formatCategory } from "@/lib/utils";
import { User } from "lucide-react";

interface LivePreviewProps {
  title: string;
  excerpt: string;
  coverImage: string;
  readingTime: number;
  content: string;
  categories: Category[];
}

export function LivePreview({
  title,
  excerpt,
  coverImage,
  readingTime,
  content,
  categories,
}: LivePreviewProps) {
  return (
    <div className="h-full overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="bg-neutral-50 px-4 py-2 text-center text-[10px] font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100">
        Aperçu Mobile & Desktop
      </div>
      <div className="px-8 py-12 md:px-12">
        <article className="mx-auto max-w-2xl">
          {/* Header Article */}
          <header className="mb-10 flex flex-col items-center text-center">
            <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
              <span className="text-neutral-900">
                {categories.length > 0
                  ? formatCategory(categories[0])
                  : "CATÉGORIE"}
              </span>
              <span>•</span>
              <span>{readingTime} min</span>
            </div>

            <h1 className="font-serif text-4xl font-medium leading-tight text-neutral-900 lg:text-5xl">
              {title || (
                <span className="text-neutral-200">Votre Titre...</span>
              )}
            </h1>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200">
                <User size={20} className="text-neutral-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-neutral-900">
                  L'Équipe Metalya
                </span>
                <span className="text-xs font-medium text-neutral-500">
                  Admin
                </span>
              </div>
            </div>
          </header>

          {/* Image */}
          <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-sm">
            {coverImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={coverImage}
                alt="Cover Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-400 text-sm font-medium">
                Image de couverture
              </div>
            )}
          </div>

          {/* Intro */}
          {excerpt && (
            <p className="mb-10 border-l-4 border-neutral-900 pl-6 text-xl font-medium leading-relaxed text-neutral-700 italic">
              {excerpt}
            </p>
          )}

          {/* Contenu */}
          <div className="prose prose-neutral prose-lg max-w-none">
            <MarkdownRenderer
              content={
                content || "*Commencez à écrire pour voir le résultat...*"
              }
            />
          </div>
        </article>
      </div>
    </div>
  );
}
