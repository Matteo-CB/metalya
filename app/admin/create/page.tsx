"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createPost } from "@/app/actions/posts";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { CategorySelector } from "@/components/admin/category-selector";
import { EditorToolbar } from "@/components/admin/editor-toolbar";
import { Loader2, ArrowLeft, Eye, Edit3, Save, User, Mail } from "lucide-react";
import { cn, formatCategory } from "@/lib/utils";
import { Category } from "@prisma/client";

export default function CreatePostPage() {
  // --- ÉTATS DU FORMULAIRE ---
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // --- ÉTATS UI ---
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">(
    "split"
  );

  const insertText = (template: string) => {
    setContent((prev) => prev + template);
  };

  const toggleCategory = (cat: Category) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await createPost(formData);
        });
      }}
      className="flex min-h-screen flex-col bg-neutral-50"
    >
      {/* --- HEADER STICKY --- */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Retour</span>
            </Link>
            <span className="h-4 w-px bg-neutral-200" />
            <h1 className="font-serif text-xl font-medium text-neutral-900">
              Nouveau Récit
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle View (Desktop) */}
            <div className="hidden items-center rounded-lg border border-neutral-200 bg-neutral-50 p-1 md:flex">
              {(["edit", "split", "preview"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                    viewMode === mode
                      ? "bg-white shadow-sm text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-900"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Toggle View (Mobile) */}
            <button
              type="button"
              onClick={() =>
                setViewMode(viewMode === "edit" ? "preview" : "edit")
              }
              className="flex md:hidden items-center gap-2 rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-200"
              aria-label="Basculer la vue"
            >
              {viewMode === "preview" ? <Edit3 size={16} /> : <Eye size={16} />}
            </button>

            {/* AJOUT : Bouton Newsletter */}
            <Link
              href="/admin/newsletter"
              className="hidden sm:flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-sm"
              title="Rédiger une newsletter"
            >
              <Mail size={16} />
              <span className="hidden lg:inline">Newsletter</span>
            </Link>

            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-neutral-800 disabled:opacity-70 hover:shadow-md focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              {isPending ? "Publication..." : "Publier"}
            </button>
          </div>
        </div>
      </header>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-12 lg:gap-8">
        {/* COLONNE GAUCHE : PARAMÈTRES */}
        <aside
          className={cn(
            "space-y-6 lg:col-span-3",
            viewMode === "preview" ? "hidden" : "block"
          )}
        >
          <div className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Titre
              </label>
              <input
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'article..."
                className="w-full border-b border-neutral-200 bg-transparent py-2 font-serif text-xl font-medium outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Extrait SEO
              </label>
              <textarea
                name="excerpt"
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={4}
                placeholder="Description courte pour Google et les réseaux..."
                className="w-full resize-none rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm outline-none focus:border-neutral-900 focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Image Cover
              </label>
              <input
                name="coverImage"
                required
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Temps (min)
              </label>
              <input
                name="readingTime"
                type="number"
                value={readingTime}
                onChange={(e) => setReadingTime(Number(e.target.value))}
                className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            <CategorySelector selected={categories} onChange={toggleCategory} />
          </div>
        </aside>

        {/* COLONNE CENTRALE : ÉDITEUR */}
        <section
          className={cn(
            "flex flex-col rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden min-h-[600px]",
            viewMode === "split"
              ? "lg:col-span-5"
              : viewMode === "edit"
              ? "lg:col-span-9"
              : "hidden"
          )}
        >
          <EditorToolbar onInsert={insertText} />
          <textarea
            name="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 resize-none p-6 font-mono text-sm leading-relaxed outline-none focus:bg-neutral-50/30 transition-colors"
            placeholder="# Introduction... Écrivez votre histoire ici."
          />
          <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-2 text-xs text-neutral-400 flex justify-between">
            <span>Markdown activé</span>
            <span>{content.length} caractères</span>
          </div>
        </section>

        {/* COLONNE DROITE : PRÉVISUALISATION */}
        <section
          className={cn(
            "rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden",
            viewMode === "split"
              ? "lg:col-span-4"
              : viewMode === "preview"
              ? "lg:col-span-12"
              : "hidden"
          )}
        >
          <div className="h-full overflow-y-auto bg-white px-8 py-10 max-h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
            <article className="mx-auto max-w-2xl">
              <header className="mb-10 flex flex-col items-center text-center">
                <div className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
                  <span className="text-neutral-900 font-bold">
                    {categories.length > 0
                      ? formatCategory(categories[0])
                      : "CATÉGORIE"}
                  </span>
                  <span>•</span>
                  <span>{readingTime} min</span>
                </div>

                <h1 className="font-serif text-4xl font-medium leading-tight text-neutral-900 lg:text-5xl">
                  {title || (
                    <span className="text-neutral-300">Votre titre ici...</span>
                  )}
                </h1>

                <div className="mt-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                    <User size={20} className="text-neutral-400" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-neutral-900">
                      Vous
                    </span>
                    <span className="text-xs text-neutral-500">Admin</span>
                  </div>
                </div>
              </header>

              <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 shadow-sm">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Cover Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-neutral-400">
                    <span className="text-sm">Image de couverture</span>
                  </div>
                )}
              </div>

              {excerpt && (
                <p className="mb-10 text-xl leading-relaxed text-neutral-600 font-serif italic border-l-4 border-neutral-200 pl-4">
                  {excerpt}
                </p>
              )}

              <div className="prose prose-neutral prose-sm md:prose-base max-w-none">
                <MarkdownRenderer
                  content={content || "*Le contenu apparaîtra ici...*"}
                />
              </div>
            </article>
          </div>
        </section>
      </main>
    </form>
  );
}
