import Link from "next/link";
import Image from "next/image";
import { Post } from "@prisma/client";
import { cn, formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";

interface PostGridProps {
  posts: Post[];
  title?: string; // <--- Rendu optionnel
}

export function PostGrid({ posts, title }: PostGridProps) {
  return (
    <section className="mb-24">
      {/* On affiche le header seulement si un titre est fourni */}
      {title && (
        <div className="mb-10 flex items-end justify-between border-b border-neutral-200 pb-6">
          <h3 className="font-serif text-3xl font-medium text-neutral-900">
            {title}
          </h3>
          <Link
            href="/archive"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900"
          >
            Voir tout
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <FadeIn
            key={post.id}
            delay={index * 0.1}
            className={cn(
              "group flex flex-col gap-4",
              index === 0 ? "md:col-span-2 lg:col-span-2" : ""
            )}
          >
            {/* ... Le reste du contenu de la carte reste identique ... */}
            <Link
              href={`/posts/${post.slug}`}
              className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-neutral-100"
            >
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Link>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                <time dateTime={post.createdAt.toISOString()}>
                  {formatDate(post.createdAt)}
                </time>
                <span>•</span>
                <span>{post.readingTime} min</span>
              </div>
              <h4
                className={cn(
                  "font-serif font-medium leading-tight text-neutral-900 group-hover:underline decoration-neutral-300 underline-offset-4",
                  index === 0 ? "text-3xl" : "text-xl"
                )}
              >
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h4>
              <p className="line-clamp-2 text-sm leading-relaxed text-neutral-600">
                {post.excerpt}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
