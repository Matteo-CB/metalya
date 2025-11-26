import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Post } from "@prisma/client";
import { FadeIn } from "@/components/ui/fade-in";

interface HeroPostProps {
  post: Post;
}

export function HeroPost({ post }: HeroPostProps) {
  return (
    <section className="relative mb-32 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16 items-center">
      {/* Image Hero avec effet de profondeur */}
      <FadeIn className="relative aspect-[16/10] w-full overflow-hidden rounded-[2.5rem] shadow-2xl lg:col-span-8 group">
        <Link
          href={`/posts/${post.slug}`}
          className="block h-full w-full overflow-hidden"
        >
          <Image
            src={post.coverImage || "/placeholder.jpg"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
          />

          {/* Overlay Gradient Magique */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />

          {/* Badge flottant */}
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-neutral-900 shadow-lg flex items-center gap-2">
            <Sparkles size={14} className="text-yellow-500 fill-yellow-500" />À
            la une
          </div>
        </Link>
      </FadeIn>

      {/* Contenu Textuel */}
      <div className="flex flex-col justify-center lg:col-span-4">
        <FadeIn delay={0.2}>
          <div className="space-y-8 relative">
            {/* Élément décoratif */}
            <div className="absolute -left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-neutral-200 to-transparent hidden lg:block" />

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                {post.categories?.[0] || "Éditorial"}
              </span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                {post.readingTime} min de lecture
              </span>
            </div>

            <h2 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-neutral-900 lg:text-5xl xl:text-6xl">
              <Link
                href={`/posts/${post.slug}`}
                className="decoration-neutral-300 decoration-2 underline-offset-8 hover:text-indigo-900 hover:decoration-indigo-300 transition-all"
              >
                {post.title}
              </Link>
            </h2>

            <p className="line-clamp-4 text-lg leading-relaxed text-neutral-600">
              {post.excerpt}
            </p>

            <Link
              href={`/posts/${post.slug}`}
              className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-neutral-900 mt-4"
            >
              Lire l&apos;article complet
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white transition-all group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white group-hover:scale-110">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
