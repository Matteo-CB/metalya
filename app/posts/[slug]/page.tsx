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
import {
  ArrowLeft,
  Calendar,
  Clock,
  User as UserIcon,
  ChevronRight,
  Globe,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { auth } from "@/auth";
import { UserRole, PostStatus } from "@prisma/client";
import { PostActions } from "@/components/admin/post-actions";
import { RelatedPosts } from "@/components/blog/related-posts";
import { StickyShare } from "@/components/blog/sticky-share";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ShareButton } from "@/components/blog/share-button";
import { ReadingProgressBar } from "@/components/blog/progress-bar";
import { CommentSection } from "@/components/blog/comment-section";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { AudioPlayer } from "@/components/blog/audio-player";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { status: PostStatus.PUBLISHED },
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
    },
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
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name || "Metalya Team"],
      images: [{ url: post.coverImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
    other: {
      amphtml: `${SITE_URL}/web-stories/${post.slug}`,
    },
  };
}

export default async function PostPage(props: PostPageProps) {
  const params = await props.params;
  const post = await getPost(params.slug);
  const session = await auth();
  const isAdmin = session?.user?.role === UserRole.ADMIN;

  if (!post) notFound();

  const isUpdated =
    post.updatedAt.getTime() - post.createdAt.getTime() > 24 * 60 * 60 * 1000;

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

  const authorName = post.author.name || "L'Équipe Metalya";
  const authorBio =
    post.author.bio ||
    "Rédacteur pour Metalya. Passionné par l'intersection entre technologie, culture et société.";
  const authorImage = post.author.image;

  const categorySlug = post.categories[0]?.toLowerCase() || "actualites";
  const categoryName = formatCategory(post.categories[0] || "ACTUALITES");
  const breadcrumbItems = [
    { name: "Accueil", item: SITE_URL },
    { name: categoryName, item: `${SITE_URL}/category/${categorySlug}` },
    { name: post.title, item: `${SITE_URL}/posts/${post.slug}` },
  ];

  const postUrl = `${SITE_URL}/posts/${post.slug}`;

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={breadcrumbItems} />
      <ReadingProgressBar />
      <StickyShare url={postUrl} title={post.title} />

      <div className="relative min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 pb-24">
        <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

        <article>
          <div className="sticky top-0 z-40 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md transition-all">
            <Container className="flex h-16 items-center justify-between">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 transition-colors group-hover:bg-neutral-200">
                  <ArrowLeft
                    size={14}
                    className="transition-transform group-hover:-translate-x-0.5"
                  />
                </div>
                <span className="hidden sm:inline">Retour à l'accueil</span>
              </Link>

              <div className="flex items-center gap-3">
                {isAdmin && <PostActions postId={post.id} />}
                <div className="flex items-center gap-2 border-l border-neutral-200 pl-3 ml-2">
                  <ShareButton
                    title={post.title}
                    text={post.excerpt}
                    url={postUrl}
                  />
                </div>
              </div>
            </Container>
          </div>

          <div className="pt-12 md:pt-20">
            <Container className="max-w-5xl">
              <FadeIn className="text-center" priority>
                <div className="mb-8 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
                  <Link href="/" className="hover:text-neutral-900">
                    Metalya
                  </Link>
                  <ChevronRight size={10} />
                  {post.categories.length > 0 && (
                    <Link
                      href={`/category/${post.categories[0].toLowerCase()}`}
                      className="text-indigo-600 hover:underline hover:decoration-indigo-200 hover:underline-offset-4"
                    >
                      {formatCategory(post.categories[0])}
                    </Link>
                  )}
                </div>

                <h1 className="mx-auto max-w-4xl font-serif text-4xl font-medium leading-[1.15] tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl text-balance">
                  {post.title}
                </h1>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-y border-neutral-100 py-6 text-sm text-neutral-500 md:mt-12">
                  <Link
                    href={`/author/${post.author.id}`}
                    className="group flex items-center gap-3 transition-opacity hover:opacity-80"
                  >
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 group-hover:border-indigo-200 transition-colors">
                      {authorImage ? (
                        <Image
                          src={authorImage}
                          alt={authorName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <UserIcon size={20} className="text-neutral-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                        {authorName}
                      </span>
                      <span className="text-xs">Auteur</span>
                    </div>
                  </Link>

                  <div className="hidden h-8 w-px bg-neutral-200 sm:block" />

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      {isUpdated ? (
                        <>
                          <RefreshCw size={16} className="text-emerald-600" />
                          <time
                            dateTime={post.updatedAt.toISOString()}
                            className="font-medium text-emerald-700"
                          >
                            Mis à jour le {formatDate(post.updatedAt)}
                          </time>
                        </>
                      ) : (
                        <>
                          <Calendar size={16} className="text-neutral-400" />
                          <time dateTime={post.createdAt.toISOString()}>
                            {formatDate(post.createdAt)}
                          </time>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-neutral-400" />
                      <span>{post.readingTime} min de lecture</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </Container>

            <div className="mt-12 w-full sm:mt-16 lg:mt-20">
              {/* IMAGE ÉGALEMENT PRIORITAIRE */}
              <FadeIn delay={0} priority>
                <Container className="max-w-6xl px-0 sm:px-6 lg:px-8">
                  <div className="relative aspect-4/3 w-full overflow-hidden sm:rounded-4xl shadow-xl md:aspect-21/9">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-[2s] hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1400px"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-4xl" />
                  </div>
                  <figcaption className="mt-3 text-center text-xs text-neutral-400 italic">
                    Image de couverture • Metalya
                  </figcaption>
                </Container>
              </FadeIn>
            </div>

            <Container className="max-w-7xl">
              <div className="mt-16 md:mt-24 flex flex-col lg:flex-row lg:gap-12">
                <div className="flex-1 max-w-3xl mx-auto">
                  <FadeIn delay={0.2}>
                    <AudioPlayer text={post.content} />
                    {post.excerpt && (
                      <div className="mb-14 text-xl font-medium leading-relaxed text-neutral-600 md:text-2xl lg:leading-9">
                        <p className="first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-bold first-letter:text-neutral-900 first-letter:leading-[0.8]">
                          {post.excerpt}
                        </p>
                      </div>
                    )}

                    <div className="prose prose-lg prose-neutral md:prose-xl max-w-none prose-headings:font-serif prose-headings:font-medium prose-p:leading-8 prose-p:text-neutral-600 prose-a:text-indigo-600 prose-a:no-underline prose-a:transition-colors hover:prose-a:text-indigo-800 hover:prose-a:underline hover:prose-a:decoration-2 prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-2 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:not-italic prose-blockquote:text-indigo-900">
                      <MarkdownRenderer content={post.content} />
                    </div>
                  </FadeIn>
                </div>

                <TableOfContents content={post.content} />
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="my-20 flex flex-col items-center justify-center gap-8 border-t border-b border-neutral-100 py-12">
                  <p className="text-sm font-bold uppercase tracking-widest text-neutral-400">
                    Partager cet article
                  </p>
                  <div className="flex items-center gap-4">
                    <ShareButton
                      title={post.title}
                      text={post.excerpt}
                      url={postUrl}
                    />
                  </div>
                </div>

                <div className="mb-24 rounded-3xl bg-neutral-50 p-8 sm:p-10">
                  <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
                      {authorImage ? (
                        <Image
                          src={authorImage}
                          alt={authorName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                          <UserIcon size={32} className="text-neutral-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-neutral-900">
                        <Link
                          href={`/author/${post.author.id}`}
                          className="hover:text-indigo-600 transition-colors"
                        >
                          Écrit par {authorName}
                        </Link>
                      </h3>
                      <p className="mt-2 text-neutral-600 leading-relaxed">
                        {authorBio}
                      </p>
                    </div>
                  </div>
                </div>

                <CommentSection postId={post.id} comments={post.comments} />

                <div className="mt-12 relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-12 text-center shadow-2xl md:px-12 md:py-16">
                  <div className="absolute top-0 left-0 -mt-10 -ml-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-[100px]" />
                  <div className="absolute bottom-0 right-0 -mb-10 -mr-10 h-64 w-64 rounded-full bg-rose-500/20 blur-[100px]" />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-300 backdrop-blur-md">
                      <Sparkles size={14} className="text-yellow-400" />
                      <span>Création Web & Design</span>
                    </div>

                    <h3 className="mb-4 font-serif text-3xl font-medium text-white md:text-4xl">
                      Vous aimez ce site ?
                    </h3>
                    <p className="mb-8 max-w-lg text-lg text-neutral-400">
                      Ce chef-d'œuvre numérique a été conçu et développé par{" "}
                      <strong className="text-white">DLK Digital Agency</strong>
                      . Offrez à votre entreprise la présence en ligne qu'elle
                      mérite.
                    </p>

                    <a
                      href="https://dlkdigitalagency.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-neutral-950 transition-all hover:bg-neutral-200 hover:scale-105 active:scale-95"
                    >
                      <Globe size={18} />
                      Lancer mon projet
                      <ChevronRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </Container>
          </div>

          {post.categories[0] && (
            <RelatedPosts
              currentPostId={post.id}
              category={post.categories[0]}
            />
          )}
        </article>
      </div>
    </>
  );
}
