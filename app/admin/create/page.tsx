"use client";

import { useState, useTransition } from "react";
import { createPost } from "@/app/actions/posts";
import { Category } from "@prisma/client";
import { cn } from "@/lib/utils";

import { PostHeader } from "@/components/admin/post-editor/post-header";
import { MarkdownEditor } from "@/components/admin/post-editor/markdown-editor";
import { LivePreview } from "@/components/admin/post-editor/live-preview";
import { PostSettings } from "@/components/admin/post-editor/post-settings";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

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
      className="flex min-h-screen flex-col bg-neutral-50/50"
    >
      <PostHeader
        isPending={isPending}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <main className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-12 lg:gap-8">
       
        <aside
          className={cn(
            "lg:col-span-3",
            viewMode === "preview" ? "hidden" : "block"
          )}
        >
          <div className="sticky top-24">
            <PostSettings
              title={title}
              setTitle={setTitle}
              excerpt={excerpt}
              setExcerpt={setExcerpt}
              coverImage={coverImage}
              setCoverImage={setCoverImage}
              readingTime={readingTime}
              setReadingTime={setReadingTime}
              categories={categories}
              toggleCategory={toggleCategory}
            />
          </div>
        </aside>

        <section
          className={cn(
            "flex flex-col transition-all duration-300",
            viewMode === "split"
              ? "lg:col-span-5"
              : viewMode === "edit"
              ? "lg:col-span-9"
              : "hidden"
          )}
        >
          <MarkdownEditor
            content={content}
            setContent={setContent}
            insertText={insertText}
          />
        </section>

        <section
          className={cn(
            "transition-all duration-300",
            viewMode === "split"
              ? "lg:col-span-4"
              : viewMode === "preview"
              ? "lg:col-span-12"
              : "hidden"
          )}
        >
          <div
            className={cn(
              "sticky top-24 h-[calc(100vh-120px)]",
              viewMode === "preview" && "h-auto"
            )}
          >
            <LivePreview
              title={title}
              excerpt={excerpt}
              coverImage={coverImage}
              readingTime={readingTime}
              content={content}
              categories={categories}
            />
          </div>
        </section>
      </main>
    </form>
  );
}
