import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { formatDate, formatCategory } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import { Article, WithContext } from "schema-dts";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowLeft, Calendar, Clock, User as UserIcon } from "lucide-react";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  });
  if (!post) return null;
  return post;
}

export async function generateMetadata(
  props: PostPageProps
): Promise<Metadata> {
  const params = await props.params;
  const post = await getPost(params.slug);
  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author.name || "Metalya Team"],
      images: [{ url: post.coverImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function PostPage(props: PostPageProps) {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post) notFound();

  const jsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.coverImage,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name || "Admin",
    },
    description: post.seoDesc || post.excerpt,
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="relative min-h-screen bg-neutral-50 pb-24 pt-8 md:pt-16">
        {/* --- AMBIANCE BACKGROUND --- */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[500px] overflow-hidden -z-10 pointer-events-none opacity-60">
          <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-indigo-100/50 blur-[120px] rounded-full mix-blend-multiply" />
          <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-amber-50/60 blur-[100px] rounded-full mix-blend-multiply" />
        </div>

        <article>
          <Container className="max-w-4xl">
            {/* --- NAVIGATION RETOUR --- */}
            <FadeIn>
              <Link
                href="/"
                className="group mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:text-neutral-900 md:mb-12"
              >
                <ArrowLeft
                  size={16}
                  className="transition-transform group-hover:-translate-x-1"
                />
                Retour
              </Link>
            </FadeIn>

            {/* --- HEADER ARTICLE --- */}
            <header className="mb-12 flex flex-col items-center text-center md:mb-16">
              <FadeIn delay={0.1}>
                <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-neutral-500">
                  {post.categories.length > 0 && (
                    <span className="text-indigo-600">
                      {formatCategory(post.categories[0])}
                    </span>
                  )}
                  <span className="h-1 w-1 rounded-full bg-neutral-300" />
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <time dateTime={post.createdAt.toISOString()}>
                      {formatDate(post.createdAt)}
                    </time>
                  </div>
                  <span className="h-1 w-1 rounded-full bg-neutral-300" />
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{post.readingTime} min</span>
                  </div>
                </div>

                <h1 className="font-serif text-4xl font-medium leading-[1.1] text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl text-balance">
                  {post.title}
                </h1>

                {/* Auteur */}
                <div className="mt-8 flex items-center justify-center gap-4 md:mt-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white p-1 shadow-sm">
                    {post.author.image ? (
                      <Image
                        src={post.author.image}
                        alt={post.author.name || "Auteur"}
                        width={48}
                        height={48}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="text-neutral-400" size={20} />
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-neutral-900">
                      {post.author.name || "L'Équipe Metalya"}
                    </span>
                    <span className="text-xs font-medium text-neutral-500">
                      Auteur & Éditeur
                    </span>
                  </div>
                </div>
              </FadeIn>
            </header>

            {/* --- IMAGE DE COUVERTURE --- */}
            <FadeIn delay={0.2} className="relative mb-16 md:mb-20">
              <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-xl shadow-neutral-200/50 md:aspect-[21/9] md:rounded-3xl">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                />
              </div>
            </FadeIn>

            {/* --- CONTENU --- */}
            <FadeIn delay={0.3}>
              <div className="mx-auto max-w-3xl">
                {/* Intro / Chapeau (Excerpt) */}
                {post.excerpt && (
                  <div className="mb-12 border-l-4 border-neutral-900 pl-6 md:pl-8">
                    <p className="font-serif text-xl font-medium leading-relaxed text-neutral-800 md:text-2xl italic">
                      {post.excerpt}
                    </p>
                  </div>
                )}

                {/* Corps de l'article avec le MarkdownRenderer optimisé */}
                <MarkdownRenderer content={post.content} />

                {/* Séparateur de fin */}
                <div className="mt-16 flex justify-center">
                  <div className="flex gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                  </div>
                </div>
              </div>
            </FadeIn>
          </Container>
        </article>
      </div>
    </>
  );
}
