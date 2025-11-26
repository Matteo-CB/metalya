import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { PostGrid } from "@/components/home/post-grid";
import { FadeIn } from "@/components/ui/fade-in";
import { getCategoryBySlug } from "@/lib/categories";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 1. Génération SEO Dynamique
export async function generateMetadata(
  props: CategoryPageProps
): Promise<Metadata> {
  const params = await props.params;
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: "Catégorie Introuvable",
    };
  }

  return {
    title: category.title,
    description: category.description,
    openGraph: {
      title: `${category.title} | Metalya`,
      description: category.description,
      type: "website",
    },
  };
}

// 2. Le Composant Page
export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params;
  const category = getCategoryBySlug(params.slug);

  // Si l'URL est /category/nimporte-quoi, on renvoie une 404
  if (!category) {
    notFound();
  }

  // Récupération des articles liés à cette catégorie
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      // On filtre si le tableau de catégories contient l'Enum correspondant
      categories: {
        has: category.enum,
      },
    },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div className="flex flex-col pt-10 md:pt-16">
      <Container>
        {/* En-tête de catégorie animé */}
        <header className="mb-16 border-b border-neutral-200 pb-8 md:mb-24 md:pb-12">
          <FadeIn>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-px w-8 bg-neutral-900" />
              <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">
                Catégorie
              </span>
            </div>
            <h1 className="font-serif text-6xl font-medium tracking-tight text-neutral-950 sm:text-8xl">
              {category.title}
              <span className="text-neutral-300">.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-neutral-500 md:text-xl">
              {category.description}
            </p>
          </FadeIn>
        </header>

        {/* Liste des articles */}
        {posts.length > 0 ? (
          <PostGrid posts={posts} />
        ) : (
          <FadeIn className="py-20 text-center">
            <p className="text-lg text-neutral-500">
              Aucun article n'a encore été publié dans cette catégorie.
            </p>
          </FadeIn>
        )}
      </Container>
    </div>
  );
}
