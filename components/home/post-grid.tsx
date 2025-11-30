import Link from "next/link";
import Image from "next/image";
import { Post } from "@prisma/client";
import { cn, formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight } from "lucide-react";

interface PostGridProps {
  posts: Post[];
  title?: string;
}

export function PostGrid({ posts, title }: PostGridProps) {
  return (
    <section className="mb-24" aria-label={title || "Liste des articles"}>
      {title && (
        <div className="mb-8 flex items-end justify-between border-b border-neutral-200 pb-6 md:mb-12">
          <h3 className="font-serif text-3xl font-medium tracking-tight text-neutral-900 md:text-4xl">
            {title}
          </h3>
          <Link
            href="/category/actualites"
            className="group hidden items-center gap-1 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 sm:flex"
          >
            Voir tout
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <FadeIn
            key={post.id}
            delay={index * 0.05}
            className={cn(
              "group flex flex-col gap-4",

              index === 0 ? "sm:col-span-2 lg:col-span-2" : ""
            )}
          >
            <article className="flex h-full flex-col">
              <Link
                href={`/posts/${post.slug}`}
                className="relative mb-4 aspect-16/10 w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-sm transition-all duration-500 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900/20"
                aria-label={`Lire : ${post.title}`}
              >
                <Image
                  src={post.coverImage || "/placeholder.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
              </Link>

              <div className="flex flex-1 flex-col gap-3">
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  <time dateTime={post.createdAt.toISOString()}>
                    {formatDate(post.createdAt)}
                  </time>
                  <span className="h-0.5 w-0.5 rounded-full bg-neutral-300" />
                  <span>{post.readingTime} min</span>
                </div>

                <h4
                  className={cn(
                    "font-serif font-medium leading-tight text-neutral-900 transition-colors group-hover:text-neutral-700",
                    index === 0 ? "text-2xl md:text-3xl" : "text-xl"
                  )}
                >
                  <Link href={`/posts/${post.slug}`}>
                    <span className="bg-linear-to-r from-neutral-900 to-neutral-900 bg-size-[0%_1px] bg-bottom-left bg-no-repeat transition-all duration-300 group-hover:bg-size-[100%_1px]">
                      {post.title}
                    </span>
                  </Link>
                </h4>

                <p className="line-clamp-2 text-sm leading-relaxed text-neutral-600 md:text-base">
                  {post.excerpt}
                </p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
