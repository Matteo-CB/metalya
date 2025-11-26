import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Post } from "@prisma/client";
import { FadeIn } from "@/components/ui/fade-in";

interface HeroPostProps {
  post: Post;
}

export function HeroPost({ post }: HeroPostProps) {
  return (
    <section className="relative mb-24 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      <FadeIn className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl lg:col-span-8">
        <Link
          href={`/posts/${post.slug}`}
          className="group block h-full w-full"
        >
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-50" />
        </Link>
      </FadeIn>

      <div className="flex flex-col justify-center lg:col-span-4">
        <FadeIn delay={0.2}>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-900">
                À la une
              </span>
              <span className="text-xs font-medium text-neutral-500">
                {post.readingTime} min de lecture
              </span>
            </div>

            <h2 className="font-serif text-4xl font-medium leading-tight text-neutral-900 lg:text-5xl">
              <Link
                href={`/posts/${post.slug}`}
                className="hover:underline decoration-neutral-300 underline-offset-4"
              >
                {post.title}
              </Link>
            </h2>

            <p className="line-clamp-3 text-lg leading-relaxed text-neutral-600">
              {post.excerpt}
            </p>

            <Link
              href={`/posts/${post.slug}`}
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-900"
            >
              Lire l'article
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
