"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Copy, ExternalLink, Download } from "lucide-react";
import { Post } from "@prisma/client";

interface PinterestCardProps {
  post: Post;
  siteUrl: string;
}

export function PinterestCard({ post, siteUrl }: PinterestCardProps) {
  const [copied, setCopied] = useState(false);

  const postUrl = `${siteUrl}/posts/${post.slug}`;

  // Formatage intelligent pour Pinterest
  const generateDescription = () => {
    const keywords = post.keywords
      .map((k) => `#${k.replace(/\s+/g, "")}`)
      .join(" ");
    const category = post.categories[0] ? `#${post.categories[0]}` : "";

    return `${post.title}\n\n${post.excerpt}\n\nLire l'article complet ici : ${postUrl}\n\n${category} ${keywords} #Metalya`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateDescription());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!post.coverImage) return;
    try {
      const response = await fetch(post.coverImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pinterest-${post.slug}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      window.open(post.coverImage, "_blank");
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200 transition-all hover:ring-2 hover:ring-red-500 hover:shadow-xl hover:shadow-red-500/10">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <Image
          src={post.coverImage || "/placeholder.jpg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={handleDownload}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
            title="Télécharger l'image"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-red-600">
            {post.categories[0] || "General"}
          </span>
          <span className="text-xs font-medium text-neutral-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h3 className="mb-2 font-serif text-lg font-bold leading-tight text-neutral-900">
          {post.title}
        </h3>

        <div className="relative mt-auto pt-4">
          <div className="mb-4 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-500 ring-1 ring-neutral-200">
            <p className="line-clamp-3 font-mono">{generateDescription()}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-bold text-white transition-all hover:bg-neutral-800 active:scale-95"
            >
              {copied ? (
                <>
                  <Check size={16} /> Copié
                </>
              ) : (
                <>
                  <Copy size={16} /> Copier Texte
                </>
              )}
            </button>
            <a
              href="https://www.pinterest.com/pin-builder/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-100 hover:border-red-300 active:scale-95"
            >
              Poster <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
