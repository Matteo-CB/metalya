import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { PostGrid } from "@/components/home/post-grid";
import { FadeIn } from "@/components/ui/fade-in";
import { User as UserIcon } from "lucide-react";
import { PostStatus } from "@prisma/client";

interface AuthorPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getAuthor(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      posts: {
        where: { status: PostStatus.PUBLISHED }, // CORRECTION ICI
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
    },
  });
  if (!user) return null;
  return user;
}

export async function generateMetadata(
  props: AuthorPageProps
): Promise<Metadata> {
  const params = await props.params;
  const author = await getAuthor(params.id);
  if (!author) return {};

  return {
    title: `${author.name} - Auteur sur Metalya`,
    description:
      author.bio ||
      `Découvrez les articles et analyses de ${author.name} sur Metalya.`,
    openGraph: {
      title: `${author.name} | Metalya`,
      description: author.bio || `Profil auteur de ${author.name}`,
      images: author.image ? [{ url: author.image }] : [],
    },
  };
}

export default async function AuthorPage(props: AuthorPageProps) {
  const params = await props.params;
  const author = await getAuthor(params.id);

  if (!author) notFound();

  return (
    <div className="min-h-screen bg-neutral-50 pt-16 pb-24">
      <div className="relative h-64 w-full bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 blur-[120px] rounded-full" />
      </div>

      <Container>
        <FadeIn className="-mt-20 relative z-10 mb-16">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-40 w-40 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
              {author.image ? (
                <Image
                  src={author.image}
                  alt={author.name || "Auteur"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-400">
                  <UserIcon size={64} />
                </div>
              )}
            </div>

            <h1 className="mt-6 font-serif text-4xl font-bold text-neutral-900">
              {author.name}
            </h1>

            {author.bio && (
              <p className="mt-4 max-w-lg text-lg text-neutral-600 leading-relaxed">
                {author.bio}
              </p>
            )}

            <div className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-400">
              <span>{author.posts.length} Articles publiés</span>
            </div>
          </div>
        </FadeIn>

        {author.posts.length > 0 ? (
          <FadeIn delay={0.2}>
            <div className="border-t border-neutral-200 pt-12">
              <PostGrid posts={author.posts} title="Publications récentes" />
            </div>
          </FadeIn>
        ) : (
          <div className="text-center py-12 text-neutral-500">
            Aucun article publié pour le moment.
          </div>
        )}
      </Container>
    </div>
  );
}
