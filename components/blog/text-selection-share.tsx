"use client";

import { useEffect, useState, useRef } from "react";
import { Twitter, Copy, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function TextSelectionShare() {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [show, setShow] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();

      if (!selection || selection.toString().trim().length === 0) {
        setShow(false);
        return;
      }

      const text = selection.toString().trim();
      if (text.length < 5 || text.length > 280) {
        setShow(false);
        return;
      }

      setSelectedText(text);

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY - 50,
      });
      setShow(true);
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);
    document.addEventListener("scroll", () => setShow(false));

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
      document.removeEventListener("scroll", () => setShow(false));
    };
  }, []);

  const handleShareTwitter = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = window.location.href;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `"${selectedText}"`
    )}&url=${encodeURIComponent(url)}&via=Metalyafr`;

    window.open(tweetUrl, "_blank");
    setShow(false);
    window.getSelection()?.removeAllRanges();
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(selectedText);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShow(false);
      window.getSelection()?.removeAllRanges();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {show && position && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-neutral-900 p-1.5 shadow-xl ring-1 ring-white/10"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          <button
            onClick={handleShareTwitter}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-neutral-700"
          >
            <Twitter size={14} className="text-sky-400" />
            <span className="hidden sm:inline">Tweeter</span>
          </button>

          <div className="h-4 w-px bg-neutral-700" />

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-neutral-700"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="hidden sm:inline">Copié !</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span className="hidden sm:inline">Copier</span>
              </>
            )}
          </button>

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-neutral-900" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
