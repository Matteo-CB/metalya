"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all",
        copied
          ? "bg-emerald-500/20 text-emerald-400"
          : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
      )}
    >
      {copied ? (
        <>
          <Check size={12} />
          Copié
        </>
      ) : (
        <>
          <Copy size={12} />
          Copier
        </>
      )}
    </button>
  );
}
