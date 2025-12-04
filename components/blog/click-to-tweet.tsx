"use client";

import { Twitter } from "lucide-react";

interface ClickToTweetProps {
  quote: string;
}

export function ClickToTweet({ quote }: ClickToTweetProps) {
  const handleTweet = () => {
    const text = encodeURIComponent(`"${quote}" via @Metalyafr`);
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
  };

  return (
    <div className="my-10 relative overflow-hidden rounded-2xl bg-indigo-50 p-8 md:p-10">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-indigo-100 opacity-50 blur-2xl" />
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-indigo-200 opacity-50 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <blockquote className="font-serif text-xl font-medium italic text-indigo-900 md:text-2xl leading-relaxed">
          &ldquo;{quote}&rdquo;
        </blockquote>

        <button
          onClick={handleTweet}
          className="group flex shrink-0 items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
        >
          <Twitter
            size={18}
            className="transition-transform group-hover:rotate-12"
          />
          Tweeter
        </button>
      </div>
    </div>
  );
}
