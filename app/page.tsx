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
import { formatDate, formatCategory } from "@/lib/utils";
import { PostStatus } from "@prisma/client";

async function getHomePageData() {
  const posts = await prisma.post.findMany({
    where: { status: PostStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    include: { author: true },
    take: 20,
  });
  return posts;
}

export default async function HomePage() {
  const posts = await getHomePageData();

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
    <div className="flex flex-col pt-8 md:pt-16">
      <Container>
        <header className="mb-12 border-b border-neutral-200 pb-10 text-center md:mb-24 md:pb-16">
          <FadeIn>
            <h1 className="font-serif text-6xl font-medium tracking-tighter text-neutral-950 sm:text-8xl md:text-9xl">
              Metalya<span className="text-neutral-300">.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-500 md:mt-8 md:text-xl md:leading-relaxed">
              Une vision curieuse et analytique sur l&apos;actualité, la
              culture, la tech et l&apos;exploration.
              <br className="hidden md:block" />
              Comprendre le monde qui nous entoure, sans le bruit de fond.
            </p>

            <nav
              className="mt-8 mb-20 flex flex-wrap justify-center gap-3 md:mt-10"
              aria-label="Accès rapide aux catégories"
            >
              {["Actualités", "Culture", "Tech", "Voyage"].map((tag) => (
                <Link
                  key={tag}
                  href={`/category/${tag
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")}`}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-5 py-2 text-xs font-bold uppercase tracking-wide text-neutral-600 transition-all hover:border-neutral-900 hover:bg-white hover:text-neutral-900 active:scale-95"
                >
                  {tag}
                </Link>
              ))}
            </nav>
          </FadeIn>
        </header>

        {heroPost && <HeroPost post={heroPost} />}

        {trendingPosts.length > 0 && (
          <div className="py-4 md:py-8">
            <PostGrid posts={trendingPosts} title="Les Incontournables" />
          </div>
        )}

        <section
          className="my-16 relative overflow-hidden rounded-4xl bg-neutral-950 py-16 text-white md:my-24 md:rounded-2xl md:py-24"
          aria-labelledby="univers-title"
        >
          <div className="absolute top-0 left-[-20%] w-[120%] h-full md:left-1/4 md:w-[600px] md:h-[600px] bg-blue-500/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-0 right-[-20%] w-[120%] h-full md:right-1/4 md:w-[600px] md:h-[600px] bg-purple-500/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

          <FadeIn>
            <div className="mx-auto max-w-6xl px-6">
              <div className="text-center mb-12 md:mb-16 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neutral-300 mb-6 backdrop-blur-md">
                  <Sparkles size={14} className="text-yellow-400" />
                  <span>Univers Thématiques</span>
                </div>
                <h2
                  id="univers-title"
                  className="font-serif text-4xl font-medium tracking-tight mb-4 text-white md:text-6xl md:mb-6"
                >
                  Plongez dans l&apos;essentiel.
                </h2>
                <p className="mx-auto max-w-xl text-neutral-400 text-base md:text-lg">
                  Quatre piliers éditoriaux pour décrypter le monde contemporain
                  sous toutes ses coutures.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                    className={`group relative flex h-64 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 p-6 md:p-8 transition-all duration-500 hover:-translate-y-2 hover:border-white/20 ${cat.shadow}`}
                  >
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${cat.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                    />

                    <div className="relative z-10">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white transition-transform duration-500 group-hover:scale-110 group-hover:bg-white/10">
                        <cat.icon size={24} />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-white md:text-3xl">
                        {cat.label}
                      </h3>
                      <p
                        className={`mt-2 text-xs font-medium uppercase tracking-wider ${cat.text} opacity-80`}
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

        <section className="py-12 md:py-16">
          <div className="mb-8 flex items-end justify-between border-b border-neutral-200 pb-4 md:mb-10">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 md:h-10 md:w-10">
                <Clock size={18} className="md:w-5 md:h-5" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-neutral-900 md:text-3xl">
                Le Fil Info
              </h2>
            </div>
            <Link
              href="/posts"
              className="group hidden items-center gap-1 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 md:flex"
            >
              Voir toutes les publications
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="flex flex-col gap-8 md:gap-12">
            {latestPosts.map((post, index) => (
              <FadeIn key={post.id} delay={index * 0.05}>
                <article className="group grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100 md:col-span-4 md:aspect-3/2 lg:col-span-3"
                  >
                    <Image
                      src={post.coverImage || ""}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </Link>
                  <div className="flex flex-col justify-center md:col-span-8 lg:col-span-9">
                    <div className="mb-2 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-neutral-500">
                      <span className="text-indigo-600">
                        {post.categories[0]
                          ? formatCategory(post.categories[0])
                          : "Général"}
                      </span>
                      <span className="h-0.5 w-0.5 rounded-full bg-neutral-300" />
                      <time dateTime={post.createdAt.toISOString()}>
                        {formatDate(post.createdAt)}
                      </time>
                    </div>
                    <h3 className="mb-3 font-serif text-xl font-medium text-neutral-900 group-hover:underline decoration-neutral-300 underline-offset-4 md:text-2xl">
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-neutral-600 md:text-base">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
                      Lire l&apos;article
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>
                </article>
                {index !== latestPosts.length - 1 && (
                  <div className="my-8 h-px w-full bg-neutral-100 md:hidden" />
                )}
              </FadeIn>
            ))}
          </div>
          <div className="mt-8 flex justify-center md:hidden">
            <Link
              href="/posts"
              className="group flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-bold text-neutral-900 transition-all hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
            >
              Voir toutes les publications
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <Newsletter />
      </Container>
    </div>
  );
}
