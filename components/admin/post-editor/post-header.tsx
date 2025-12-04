"use client";

import Link from "next/link";
import { ArrowLeft, Eye, Edit3, Save, Loader2, Send, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostHeaderProps {
  isPending: boolean;
  viewMode: "edit" | "preview" | "split";
  setViewMode: (mode: "edit" | "preview" | "split") => void;
}

export function PostHeader({
  isPending,
  viewMode,
  setViewMode,
}: PostHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 px-6 py-4 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white transition-colors group-hover:border-neutral-900 group-hover:text-neutral-900">
              <ArrowLeft size={14} />
            </div>
            <span className="hidden font-serif sm:inline">Retour</span>
          </Link>
          <span className="h-6 w-px bg-neutral-200" />
          <div>
            <h1 className="font-serif text-lg font-bold text-neutral-900">
              Éditeur
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center rounded-lg border border-neutral-200 bg-neutral-50 p-1 md:flex">
            {(["edit", "split", "preview"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all",
                  viewMode === mode
                    ? "bg-white text-neutral-900 shadow-sm ring-1 ring-black/5"
                    : "text-neutral-500 hover:text-neutral-900"
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setViewMode(viewMode === "edit" ? "preview" : "edit")
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 md:hidden"
          >
            {viewMode === "preview" ? <Edit3 size={18} /> : <Eye size={18} />}
          </button>

          <Link
            href="/admin/newsletter"
            className="hidden h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 sm:flex"
          >
            <Mail size={16} />
            <span>Newsletter</span>
          </Link>

          <button
            type="submit"
            name="action"
            value="draft"
            disabled={isPending}
            className="hidden h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 disabled:opacity-70 sm:flex"
          >
            <Save size={16} />
            <span>Brouillon</span>
          </button>

          <button
            type="submit"
            name="action"
            value="publish"
            disabled={isPending}
            className="flex h-10 items-center gap-2 rounded-full bg-neutral-900 px-6 text-sm font-bold text-white transition-all hover:bg-neutral-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Send size={16} />
            )}
            <span className="hidden sm:inline">Publier</span>
          </button>
        </div>
      </div>
    </header>
  );
}
