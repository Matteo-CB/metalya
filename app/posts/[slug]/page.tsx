import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { formatDate } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import { Article, WithContext } from "schema-dts";

// CORRECTION : params est maintenant une Promise
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
  const params = await props.params; // <--- AWAIT OBLIGATOIRE
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
  const params = await props.params; // <--- AWAIT OBLIGATOIRE
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
      <article className="pb-20 pt-10">
        <Container>
          <header className="mb-12 flex flex-col items-center text-center">
            <div className="mb-6 flex items-center gap-2 text-sm font-medium text-neutral-500">
              <time dateTime={post.createdAt.toISOString()}>
                {formatDate(post.createdAt)}
              </time>
              <span>•</span>
              <span>{post.readingTime} min de lecture</span>
            </div>
            <h1 className="max-w-4xl font-serif text-5xl font-medium leading-tight text-neutral-900 md:text-6xl lg:text-7xl">
              {post.title}
            </h1>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-neutral-900">
                  {post.author.name}
                </span>
                <span className="text-xs text-neutral-500">
                  Auteur & Éditeur
                </span>
              </div>
            </div>
          </header>

          <div className="relative mb-16 aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 shadow-sm">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="prose prose-neutral prose-lg text-justify font-serif leading-loose text-neutral-800 prose-headings:font-sans prose-headings:font-bold prose-a:text-neutral-900 prose-img:rounded-lg">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
