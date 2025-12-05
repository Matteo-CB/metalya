import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { PostGrid } from "@/components/home/post-grid";
import { FadeIn } from "@/components/ui/fade-in";
import { User as UserIcon } from "lucide-react";
import { PostStatus, UserRole } from "@prisma/client";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ProfilePage, WithContext } from "schema-dts";
import { Pagination } from "@/components/ui/pagination";

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";
const POSTS_PER_PAGE = 6;

interface AuthorPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

function getRoleLabel(role: UserRole) {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Administrateur";
    case "ADMIN":
      return "Administrateur";
    case "REDACTEUR":
      return "Rédacteur";
    case "USER":
    default:
      return "Utilisateur";
  }
}

async function getAuthorData(id: string, page: number = 1) {
  const author = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      email: true,
      role: true,
    },
  });

  if (!author) return null;

  const totalPosts = await prisma.post.count({
    where: {
      authorId: id,
      status: PostStatus.PUBLISHED,
    },
  });

  const posts = await prisma.post.findMany({
    where: {
      authorId: id,
      status: PostStatus.PUBLISHED,
    },
    orderBy: { createdAt: "desc" },
    include: { author: true },
    take: POSTS_PER_PAGE,
    skip: (page - 1) * POSTS_PER_PAGE,
  });

  return { author, posts, totalPosts };
}

export async function generateMetadata(
  props: AuthorPageProps
): Promise<Metadata> {
  const params = await props.params;
  const data = await getAuthorData(params.id, 1);

  if (!data || !data.author) return {};
  const { author } = data;
  const roleLabel = getRoleLabel(author.role);

  return {
    title: `${author.name} - ${roleLabel} sur Metalya`,
    description:
      author.bio ||
      `Découvrez le profil de ${
        author.name
      }, ${roleLabel.toLowerCase()} sur Metalya.`,
    openGraph: {
      title: `${author.name} | Metalya`,
      description:
        author.bio || `Profil ${roleLabel.toLowerCase()} de ${author.name}`,
      images: author.image ? [{ url: author.image }] : [],
      type: "profile",
      url: `${SITE_URL}/author/${author.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AuthorPage(props: AuthorPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const currentPage = Number(searchParams.page) || 1;

  const data = await getAuthorData(params.id, currentPage);

  if (!data || !data.author) notFound();

  const { author, posts, totalPosts } = data;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }

  const categories = Array.from(new Set(posts.flatMap((p) => p.categories)));
  const roleLabel = getRoleLabel(author.role);

  const jsonLd: WithContext<ProfilePage> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: author.name || "Membre Metalya",
      description: author.bio || `Profil de ${author.name}.`,
      image: author.image || `${SITE_URL}/logo.png`,
      url: `${SITE_URL}/author/${author.id}`,
      jobTitle: roleLabel,
      worksFor: {
        "@type": "Organization",
        name: "Metalya",
        url: SITE_URL,
      },
      knowsAbout: categories.map((cat) => ({
        "@type": "Thing",
        name: cat,
      })),
      interactionStatistic: [
        {
          "@type": "InteractionCounter",
          interactionType: {
            "@type": "WriteAction",
            name: "Write",
          },
          userInteractionCount: totalPosts,
        },
      ],
    },
  };

  const breadcrumbItems = [
    { name: "Accueil", item: SITE_URL },
    {
      name: `${roleLabel} : ${author.name}`,
      item: `${SITE_URL}/author/${author.id}`,
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={breadcrumbItems} />

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

              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 uppercase tracking-wide">
                  {roleLabel}
                </span>
              </div>

              {categories.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              {author.bio && (
                <p className="mt-6 max-w-lg text-lg text-neutral-600 leading-relaxed">
                  {author.bio}
                </p>
              )}

              <div className="mt-8 flex items-center gap-8 border-t border-neutral-200 pt-8">
                <div className="flex flex-col">
                  <span className="font-serif text-3xl font-bold text-neutral-900">
                    {totalPosts}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                    Articles
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>

          {posts.length > 0 ? (
            <FadeIn delay={0.2}>
              <div className="mt-12 border-t border-neutral-200 pt-12">
                <h2 className="mb-12 text-center font-serif text-2xl font-bold text-neutral-900">
                  Publications Récentes
                </h2>

                <PostGrid posts={posts} />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={`/author/${author.id}`}
                />
              </div>
            </FadeIn>
          ) : (
            <div className="text-center py-24 text-neutral-500">
              <p>Aucun article publié pour le moment.</p>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
