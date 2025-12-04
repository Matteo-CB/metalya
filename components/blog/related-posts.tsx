import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Category, PostStatus } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

interface RelatedPostsProps {
  currentPostId: string;
  category: Category;
}

export async function RelatedPosts({
  currentPostId,
  category,
}: RelatedPostsProps) {
  const posts = await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED, // Correction ici
      categories: { has: category },
      id: { not: currentPostId },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  if (posts.length === 0) return null;

  return (
    <section className="border-t mt-16 border-neutral-200 bg-neutral-50/50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        <FadeIn>
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Sparkles size={16} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-neutral-900 md:text-3xl">
              Dans la même thématique
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="group flex flex-col gap-4 transition-transform hover:-translate-y-1"
              >
                <Link
                  href={`/posts/${post.slug}`}
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-200"
                >
                  <Image
                    src={post.coverImage || "/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    <time dateTime={post.createdAt.toISOString()}>
                      {formatDate(post.createdAt)}
                    </time>
                    <span>•</span>
                    <span>{post.readingTime} min</span>
                  </div>

                  <h4 className="font-serif text-lg font-medium leading-snug text-neutral-900 group-hover:text-indigo-600 transition-colors">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h4>

                  <Link
                    href={`/posts/${post.slug}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-neutral-900"
                  >
                    Lire l'article
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
