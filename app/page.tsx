import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import { HeroPost } from "@/components/home/hero-post";
import { PostGrid } from "@/components/home/post-grid";
import { Newsletter } from "@/components/home/newsletter";
import { FadeIn } from "@/components/ui/fade-in";
import {
  Sparkles,
  Clock,
  ArrowRight,
  Globe,
  Cpu,
  Palette,
  Newspaper,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

// 1. Récupération des données
async function getHomePageData() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: true },
    take: 20,
  });
  return posts;
}

export default async function HomePage() {
  const posts = await getHomePageData();

  // --- LOGIQUE DE TRI ---
  const heroPost = posts.find((p) => p.featured) || posts[0];

  const trendingPosts = posts
    .filter((p) => p.id !== heroPost?.id && p.featured)
    .slice(0, 5);

  if (trendingPosts.length < 3) {
    const filler = posts
      .filter(
        (p) =>
          p.id !== heroPost?.id && !trendingPosts.find((t) => t.id === p.id)
      )
      .slice(0, 3 - trendingPosts.length);
    trendingPosts.push(...filler);
  }

  const displayedIds = [heroPost?.id, ...trendingPosts.map((p) => p.id)];
  const latestPosts = posts
    .filter((p) => !displayedIds.includes(p.id))
    .slice(0, 6);

  return (
    <div className="flex flex-col pt-10 md:pt-16">
      <Container>
        {/* --- HEADER --- */}
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

        {/* --- SECTION 1 : LE HERO --- */}
        {heroPost && <HeroPost post={heroPost} />}

        {/* --- SECTION 2 : TENDANCES --- */}
        {trendingPosts.length > 0 && (
          <div className="py-8">
            <PostGrid posts={trendingPosts} title="Les Incontournables" />
          </div>
        )}

        {/* --- SECTION 3 : EXPLORATION VISUELLE (DESIGN MAGIQUE) --- */}
        <section className="my-24 relative overflow-hidden rounded-[2.5rem] bg-neutral-950 py-24 text-white">
          {/* Effets de fond atmosphériques */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

          <FadeIn>
            <div className="mx-auto max-w-6xl px-6">
              <div className="text-center mb-16 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neutral-300 mb-6 backdrop-blur-md">
                  <Sparkles size={14} className="text-yellow-400" />
                  <span>Univers Thématiques</span>
                </div>
                <h2 className="font-serif text-4xl font-medium md:text-6xl tracking-tight mb-6 text-white">
                  Plongez dans l&apos;essentiel.
                </h2>
                <p className="mx-auto max-w-xl text-neutral-400 text-lg">
                  Quatre piliers éditoriaux pour décrypter le monde contemporain
                  sous toutes ses coutures.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Actualités",
                    desc: "Le monde en temps réel",
                    icon: Newspaper,
                    gradient: "from-blue-600 to-cyan-500",
                    shadow: "hover:shadow-blue-500/20",
                    text: "text-blue-200",
                  },
                  {
                    label: "Tech",
                    desc: "Futur & Innovation",
                    icon: Cpu,
                    gradient: "from-violet-600 to-fuchsia-500",
                    shadow: "hover:shadow-violet-500/20",
                    text: "text-violet-200",
                  },
                  {
                    label: "Culture",
                    desc: "Art, Société & Idées",
                    icon: Palette,
                    gradient: "from-amber-500 to-orange-600",
                    shadow: "hover:shadow-amber-500/20",
                    text: "text-amber-200",
                  },
                  {
                    label: "Voyage",
                    desc: "Exploration & Guides",
                    icon: Globe,
                    gradient: "from-emerald-500 to-teal-600",
                    shadow: "hover:shadow-emerald-500/20",
                    text: "text-emerald-200",
                  },
                ].map((cat) => (
                  <Link
                    key={cat.label}
                    href={`/category/${cat.label
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")}`}
                    className={`group relative flex h-72 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-white/20 ${cat.shadow}`}
                  >
                    {/* Fond gradient animé au survol */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                    />

                    {/* Cercle décoratif */}
                    <div
                      className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${cat.gradient} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
                    />

                    <div className="relative z-10">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white transition-transform duration-500 group-hover:scale-110 group-hover:bg-white/10">
                        <cat.icon size={24} />
                      </div>
                      <h3 className="font-serif text-3xl font-bold text-white">
                        {cat.label}
                      </h3>
                      <p
                        className={`mt-2 text-sm font-medium uppercase tracking-wider ${cat.text} opacity-80`}
                      >
                        {cat.desc}
                      </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 text-sm font-bold text-white opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
                      Explorer
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* --- SECTION 4 : LE FIL INFO --- */}
        <section className="py-16">
          <div className="mb-10 flex items-end justify-between border-b border-neutral-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-900">
                <Clock size={20} />
              </div>
              <h2 className="font-serif text-3xl font-medium text-neutral-900">
                Le Fil Info
              </h2>
            </div>
            <span className="hidden text-sm font-medium text-neutral-500 md:block">
              Dernières publications
            </span>
          </div>

          <div className="flex flex-col gap-8">
            {latestPosts.map((post, index) => (
              <FadeIn key={post.id} delay={index * 0.05}>
                <article className="group grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100 md:col-span-4 md:aspect-[3/2]"
                  >
                    <Image
                      src={post.coverImage || ""}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 30vw"
                    />
                  </Link>
                  <div className="flex flex-col justify-center md:col-span-8">
                    <div className="mb-3 flex items-center gap-3 text-xs font-medium text-neutral-500">
                      <span className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-900">
                        {post.categories[0] || "Général"}
                      </span>
                      <time dateTime={post.createdAt.toISOString()}>
                        {formatDate(post.createdAt)}
                      </time>
                    </div>
                    <h3 className="mb-3 font-serif text-2xl font-medium text-neutral-900 group-hover:underline decoration-neutral-300 underline-offset-4">
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="mb-4 line-clamp-2 text-neutral-600 md:line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                      Lire l&apos;article
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>
                </article>
                {index !== latestPosts.length - 1 && (
                  <div className="my-8 h-px w-full bg-neutral-100 md:my-12" />
                )}
              </FadeIn>
            ))}
          </div>
        </section>

        {/* --- NEWSLETTER --- */}
        <Newsletter />
      </Container>
    </div>
  );
}
