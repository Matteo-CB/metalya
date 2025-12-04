"use client";

import { Share2, Check, Copy } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } catch (error) {
        console.log("Partage annulé");
      }
    } else {
      // Fallback pour Desktop : Copier dans le presse-papier
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-all hover:border-neutral-900 hover:text-neutral-900 active:scale-95"
      aria-label="Partager cet article"
      title="Partager"
    >
      {copied ? (
        <Check size={16} className="text-green-600" />
      ) : (
        <Share2 size={16} />
      )}
    </button>
  );
}
