import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { PostGrid } from "@/components/home/post-grid";
import { FadeIn } from "@/components/ui/fade-in";
import { getCategoryBySlug } from "@/lib/categories";
import { Home, Sparkles, ArrowLeft, BookOpen } from "lucide-react";

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

  // Si l'URL est invalide
  if (!category) {
    notFound();
  }

  // Récupération des articles liés à cette catégorie
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      categories: {
        has: category.enum,
      },
    },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div className="relative min-h-screen flex flex-col pt-8 md:pt-16 overflow-hidden">
      {/* --- BACKGROUND AMBIANT --- */}
      {/* Subtils orbes de lumière pour donner de la profondeur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[600px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neutral-200/40 blur-[120px] rounded-full mix-blend-multiply opacity-70" />
        <div className="absolute top-[-100px] right-1/4 w-[400px] h-[400px] bg-indigo-50/60 blur-[100px] rounded-full mix-blend-multiply opacity-60" />
      </div>

      <Container>
        {/* --- FIL D'ARIANE (BREADCRUMB) --- */}
        <FadeIn>
          <nav
            aria-label="Fil d'ariane"
            className="mb-8 flex items-center gap-2 text-xs font-medium text-neutral-500 md:mb-12"
          >
            <Link
              href="/"
              className="flex items-center gap-1 transition-colors hover:text-neutral-900"
            >
              <Home size={14} />
              Accueil
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-900 font-bold uppercase tracking-wide">
              {category.label}
            </span>
          </nav>
        </FadeIn>

        {/* --- HEADER CATÉGORIE --- */}
        <header className="mb-16 border-b border-neutral-200/60 pb-12 md:mb-24 md:pb-16">
          <FadeIn delay={0.1}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg shadow-neutral-900/20">
                <Sparkles size={14} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                Exploration Thématique
              </span>
            </div>

            <h1 className="font-serif text-5xl font-medium tracking-tight text-neutral-950 sm:text-7xl md:text-8xl">
              {category.title}
              <span className="text-neutral-300">.</span>
            </h1>

            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <p className="max-w-2xl text-lg text-neutral-500 md:text-xl leading-relaxed text-balance">
                {category.description}
              </p>

              <div className="flex items-center gap-2 text-sm font-medium text-neutral-400">
                <BookOpen size={18} />
                <span>
                  {posts.length} {posts.length > 1 ? "Articles" : "Article"}
                </span>
              </div>
            </div>
          </FadeIn>
        </header>

        {/* --- LISTE DES ARTICLES --- */}
        {posts.length > 0 ? (
          <PostGrid posts={posts} />
        ) : (
          <FadeIn className="py-20 text-center">
            <div className="mx-auto max-w-md rounded-3xl border border-dashed border-neutral-200 bg-neutral-50/50 p-12">
              <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm border border-neutral-100 text-neutral-300">
                <BookOpen size={32} />
              </div>
              <h3 className="font-serif text-2xl font-medium text-neutral-900 mb-2">
                C'est un peu calme ici...
              </h3>
              <p className="text-neutral-500 mb-8 leading-relaxed">
                Nos rédacteurs travaillent sur les prochains articles de cette
                catégorie. Revenez très vite !
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-neutral-800 hover:shadow-lg"
              >
                <ArrowLeft size={16} />
                Retourner à l'accueil
              </Link>
            </div>
          </FadeIn>
        )}
      </Container>
    </div>
  );
}
