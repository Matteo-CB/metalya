import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { PostGrid } from "@/components/home/post-grid";
import { prisma } from "@/lib/prisma";
import { Sparkles, BookOpen } from "lucide-react";
import { PostSearch } from "@/components/blog/post-search";
import { Pagination } from "@/components/blog/pagination";

export const metadata: Metadata = {
  title: "Toutes les publications | Metalya",
  description:
    "Explorez l'intégralité de nos articles : tech, culture, voyage et analyses.",
};

interface PostsPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function PostsPage(props: PostsPageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = 9;

  const where = {
    published: true,
    OR: query
      ? [
          { title: { contains: query, mode: "insensitive" as const } },
          { excerpt: { contains: query, mode: "insensitive" as const } },
        ]
      : undefined,
  };

  const totalItems = await prisma.post.count({ where });
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { author: true },
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
  });

  return (
    <div className="min-h-screen bg-neutral-50 pt-16 pb-24">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-white overflow-hidden -z-10">
        <div className="absolute top-[-50%] right-[-10%] w-[800px] h-[800px] bg-indigo-50/50 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-amber-50/50 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      <Container>
        <header className="text-center mb-16 pt-12">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6 shadow-sm">
              <BookOpen size={14} className="text-indigo-500" />
              <span>Archives & Récits</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-medium text-neutral-950 tracking-tight mb-6">
              Explorer nos <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                horizons.
              </span>
            </h1>

            <p className="text-lg text-neutral-500 max-w-2xl mx-auto mb-12">
              Parcourez l'ensemble de nos publications. Utilisez la recherche
              pour filtrer par sujet ou laissez-vous guider par la chronologie.
            </p>

            <PostSearch />
          </FadeIn>
        </header>

        {posts.length > 0 ? (
          <FadeIn delay={0.2}>
            <div className="mb-6 flex items-center gap-2 text-sm text-neutral-400">
              <Sparkles size={16} />
              <span>{totalItems} résultats trouvés</span>
            </div>
            <PostGrid posts={posts} />
            <Pagination totalPages={totalPages} />
          </FadeIn>
        ) : (
          <FadeIn
            delay={0.2}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="text-neutral-400" size={24} />
            </div>
            <h3 className="font-serif text-2xl text-neutral-900 mb-2">
              Aucun résultat
            </h3>
            <p className="text-neutral-500 max-w-sm">
              Nous n'avons trouvé aucun article correspondant à &laquo; {query}{" "}
              &raquo;. Essayez d'autres mots-clés.
            </p>
          </FadeIn>
        )}
      </Container>
    </div>
  );
}
