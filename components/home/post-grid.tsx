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
    <section className="mb-24">
      {title && (
        <div className="mb-12 flex items-end justify-between border-b border-neutral-200 pb-6">
          <h3 className="font-serif text-4xl font-medium tracking-tight text-neutral-900">
            {title}
          </h3>
          <Link
            href="/archive"
            className="group flex items-center gap-1 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Voir tout
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <FadeIn
            key={post.id}
            delay={index * 0.05}
            className={cn(
              "group flex flex-col gap-4",
              index === 0 ? "md:col-span-2 lg:col-span-2" : ""
            )}
          >
            <Link
              href={`/posts/${post.slug}`}
              className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <Image
                src={post.coverImage || "/placeholder.jpg"} // Fallback image
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
            </Link>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-xs font-semibold tracking-wide text-neutral-500">
                <time dateTime={post.createdAt.toISOString()}>
                  {formatDate(post.createdAt)}
                </time>
                <span className="h-1 w-1 rounded-full bg-neutral-300" />
                <span>{post.readingTime} min</span>
              </div>

              <h4
                className={cn(
                  "font-serif font-medium leading-tight text-neutral-900 transition-colors group-hover:text-neutral-700",
                  index === 0 ? "text-3xl md:text-4xl" : "text-xl"
                )}
              >
                <Link href={`/posts/${post.slug}`}>
                  <span className="bg-gradient-to-r from-neutral-900 to-neutral-900 bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-all duration-300 group-hover:bg-[length:100%_1px]">
                    {post.title}
                  </span>
                </Link>
              </h4>

              <p className="line-clamp-2 text-base leading-relaxed text-neutral-600 md:text-lg">
                {post.excerpt}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
