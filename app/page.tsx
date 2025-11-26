import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import { HeroPost } from "@/components/home/hero-post";
import { PostGrid } from "@/components/home/post-grid";
import { Newsletter } from "@/components/home/newsletter";
import { FadeIn } from "@/components/ui/fade-in";
import { Sparkles } from "lucide-react";

// 1. Récupération des données
async function getHomePageData() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: true },
    take: 20, // On en prend suffisamment pour remplir toutes les sections
  });
  return posts;
}

export default async function HomePage() {
  const posts = await getHomePageData();

  // --- LOGIQUE DE TRI ---

  // A. Le Hero : Le post le plus récent marqué "Featured", ou le tout premier
  const heroPost = posts.find((p) => p.featured) || posts[0];

  // B. Les Tendances (Simulées) : On prend d'autres posts "Featured" ou les suivants
  // On exclut le Hero pour ne pas le répéter
  const trendingPosts = posts
    .filter((p) => p.id !== heroPost?.id && p.featured)
    .slice(0, 5); // PostGrid est joli avec 3 ou 5 articles (1 grand + grille)

  // Si pas assez de featured, on complète avec des articles standards
  if (trendingPosts.length < 3) {
    const filler = posts
      .filter(
        (p) =>
          p.id !== heroPost?.id && !trendingPosts.find((t) => t.id === p.id)
      )
      .slice(0, 3 - trendingPosts.length);
    trendingPosts.push(...filler);
  }

  // C. Le Fil Info (Les derniers articles chronologiques)
  // On exclut tout ce qui est déjà affiché en Hero ou Trending
  const displayedIds = [heroPost?.id, ...trendingPosts.map((p) => p.id)];
  const latestPosts = posts
    .filter((p) => !displayedIds.includes(p.id))
    .slice(0, 6);

  return (
    <div className="flex flex-col pt-10 md:pt-16">
      <Container>
        {/* --- HEADER : Identité & Navigation Rapide --- */}
        <header className="mb-16 border-b border-neutral-200 pb-8 text-center md:mb-24 md:pb-12">
          <FadeIn>
            <h1 className="font-serif text-7xl font-medium tracking-tighter text-neutral-950 sm:text-9xl">
              Metalya<span className="text-neutral-300">.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-neutral-500 md:text-xl leading-relaxed">
              Une vision curieuse et analytique sur l&apos;actualité, la
              culture, la tech et l&apos;exploration.
              <br className="hidden md:block" />
              Comprendre le monde qui nous entoure, sans le bruit de fond.
            </p>

            {/* Tags de navigation rapide (SEO + UX) */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["Actualités", "Culture", "Tech", "Voyage"].map((tag) => (
                <Link
                  key={tag}
                  href={`/category/${tag
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")}`}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-5 py-2 text-xs font-medium uppercase tracking-wide text-neutral-600 transition-all hover:border-neutral-900 hover:bg-white hover:text-neutral-900"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </FadeIn>
        </header>

        {/* --- SECTION 1 : LE HERO (L'article phare) --- */}
        {heroPost && <HeroPost post={heroPost} />}

        {/* --- SECTION 2 : TENDANCES (Les Incontournables) --- */}
        {/* Utilisation du composant PostGrid existant */}
        {trendingPosts.length > 0 && (
          <div className="py-8">
            <PostGrid posts={trendingPosts} title="Les Incontournables" />
          </div>
        )}

        {/* --- SECTION 3 : EXPLORATION VISUELLE (Categories) --- */}
        {/* Une pause visuelle pour inciter à explorer les thématiques */}
        <section className="my-16 overflow-hidden rounded-2xl bg-neutral-950 py-16 text-white md:py-24">
          <FadeIn>
            <div className="mx-auto max-w-4xl px-6 text-center">
              <Sparkles className="mx-auto mb-6 h-8 w-8 text-neutral-400" />
              <h2 className="font-serif text-3xl font-medium md:text-5xl">
                Explorez nos univers.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-neutral-400">
                Plongez dans nos dossiers thématiques pour approfondir vos
                connaissances.
              </p>

              <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  {
                    label: "Actualités",
                    img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    label: "Tech",
                    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    label: "Culture",
                    img: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    label: "Voyage",
                    img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
                  },
                ].map((cat) => (
                  <Link
                    key={cat.label}
                    href={`/category/${cat.label
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")}`}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-800"
                  >
                    <Image
                      src={cat.img}
                      alt={cat.label}
                      fill
                      className="object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:opacity-80"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold tracking-widest text-white drop-shadow-md">
                        {cat.label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* --- SECTION 4 : LE FIL INFO (Derniers articles) --- */}
        {/* Réutilisation de PostGrid pour une cohérence visuelle parfaite */}
        {latestPosts.length > 0 && (
          <div className="py-8">
            <PostGrid posts={latestPosts} title="Le Fil Info" />
          </div>
        )}

        {/* --- SECTION 5 : NEWSLETTER --- */}
        <Newsletter />
      </Container>
    </div>
  );
}
