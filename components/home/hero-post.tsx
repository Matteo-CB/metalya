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
    <section className="relative mb-24 grid grid-cols-1 gap-8 lg:mb-32 lg:grid-cols-12 lg:gap-16 lg:items-center">
      <FadeIn className="relative aspect-4/3 w-full overflow-hidden rounded-3xl shadow-xl shadow-neutral-200/50 md:aspect-video lg:col-span-8 lg:rounded-[2.5rem] group">
        <Link
          href={`/posts/${post.slug}`}
          className="block relative h-full w-full overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900/30"
          aria-label={`Lire l'article à la une : ${post.title}`}
        >
          <Image
            src={post.coverImage || "/placeholder.jpg"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />

          <div className="absolute inset-0 bg-linear-to-t from-neutral-900/40 via-neutral-900/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-900 shadow-sm backdrop-blur-md md:top-6 md:left-6 md:px-4 md:py-2 md:text-xs">
            <Sparkles size={14} className="text-amber-500 fill-amber-500" />
            <span>À la une</span>
          </div>
        </Link>
      </FadeIn>

      <div className="flex flex-col justify-center lg:col-span-4">
        <FadeIn delay={0.2}>
          <div className="relative space-y-6 md:space-y-8">
            <div className="absolute -left-8 top-0 hidden h-full w-px bg-linear-to-b from-transparent via-neutral-200 to-transparent lg:block" />

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest">
              <span className="text-indigo-600">
                {post.categories?.[0] || "Éditorial"}
              </span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span className="text-neutral-400">
                {post.readingTime} min de lecture
              </span>
            </div>

            <h2 className="font-serif text-3xl font-medium leading-tight tracking-tight text-neutral-900 md:text-4xl lg:text-5xl xl:text-6xl">
              <Link
                href={`/posts/${post.slug}`}
                className="decoration-neutral-300 decoration-2 underline-offset-4 transition-all hover:text-indigo-950 hover:decoration-indigo-300 hover:underline-offset-8"
              >
                {post.title}
              </Link>
            </h2>

            <p className="line-clamp-3 text-base leading-relaxed text-neutral-600 md:text-lg">
              {post.excerpt}
            </p>

            <Link
              href={`/posts/${post.slug}`}
              className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-neutral-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black rounded-lg"
            >
              Lire l&apos;article
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
