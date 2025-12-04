"use client";

import { useState, useEffect } from "react";
import {
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
  Check,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyShareProps {
  url: string;
  title: string;
}

export function StickyShare({ url, title }: StickyShareProps) {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}`,
      color: "hover:bg-black hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      color: "hover:bg-[#0077b5] hover:text-white",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      color: "hover:bg-[#1877f2] hover:text-white",
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "fixed z-40 transition-all duration-500 ease-out",
        "bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-xl backdrop-blur-md border border-neutral-200/50 lg:hidden",
        "lg:left-8 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:flex-col lg:px-2 lg:py-4 lg:bg-transparent lg:shadow-none lg:border-none lg:translate-x-0",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none lg:opacity-0 lg:-translate-x-10"
      )}
    >
      <span className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-neutral-400 writing-vertical-rl rotate-180 mb-4">
        Partager
      </span>

      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm border border-neutral-100 transition-all hover:scale-110 hover:-translate-y-1 lg:shadow-md",
            link.color
          )}
          aria-label={`Partager sur ${link.name}`}
        >
          <link.icon size={18} />
        </a>
      ))}

      <button
        onClick={copyToClipboard}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm border border-neutral-100 transition-all hover:scale-110 hover:-translate-y-1 hover:bg-neutral-900 hover:text-white lg:shadow-md"
        aria-label="Copier le lien"
      >
        {copied ? <Check size={18} /> : <LinkIcon size={18} />}
      </button>

      <button
        className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white shadow-sm transition-all active:scale-95"
        onClick={() => {
          if (navigator.share) {
            navigator.share({ title, url });
          }
        }}
      >
        <Share2 size={18} />
      </button>
    </div>
  );
}
