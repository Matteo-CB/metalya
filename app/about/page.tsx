import Image from "next/image";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import {
  ArrowRight,
  Cpu,
  Zap,
  Globe,
  Search,
  Rocket,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos - Metalya x DLK Agency",
  description:
    "Metalya est une vitrine technologique conçue par DLK Digital Agency. Découvrez comment nous allions éditorial exigeant et performance web de pointe.",
};

export default function AboutPage() {
  return (
    <div className="bg-neutral-50">
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-48 md:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] overflow-hidden -z-10 opacity-60 pointer-events-none">
          <div className="absolute top-[-20%] left-0 w-[70vw] h-[70vw] bg-amber-100/50 blur-[120px] rounded-full mix-blend-multiply" />
          <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-100/40 blur-[100px] rounded-full mix-blend-multiply" />
        </div>

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <FadeIn>
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px w-8 bg-neutral-900" />
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Notre Manifeste
                  </span>
                </div>
                <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tighter text-neutral-950 mb-8 leading-[1.1]">
                  L'élégance du papier, <br />
                  <span className="text-neutral-400 italic">
                    la puissance du code.
                  </span>
                </h1>
                <div className="prose prose-lg text-neutral-600">
                  <p>
                    Metalya est né d'une frustration : le web moderne est devenu
                    bruyant, lent et encombré. Nous voulions créer un
                    sanctuaire. Un espace où la lecture redevient un plaisir, où
                    chaque pixel est à sa place.
                  </p>
                  <p>
                    Mais un beau contenu ne suffit pas. Il faut un écrin capable
                    de le porter à la vitesse de la pensée.
                  </p>
                </div>
              </FadeIn>
            </div>

            <div className="relative">
              <FadeIn
                delay={0.2}
                className="relative aspect-4/5 w-full overflow-hidden rounded-4xl shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=2668&auto=format&fit=crop"
                  alt="Journaliste travaillant sur un design épuré"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-linear-to-t from-black/60 to-transparent text-white">
                  <p className="font-serif text-2xl italic">
                    "Le design n'est pas seulement ce à quoi il ressemble. Le
                    design est comment il fonctionne."
                  </p>
                  <p className="mt-2 text-sm font-medium uppercase tracking-widest opacity-80">
                    — Steve Jobs
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative bg-neutral-950 py-24 md:py-40 text-white overflow-hidden rounded-t-[3rem] md:rounded-t-[5rem] -mt-12 z-10 shadow-[0_-20px_60px_rgba(0,0,0,0.2)]">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] z-0" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20 md:mb-32">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono mb-8 backdrop-blur-md">
                <Cpu size={14} />
                <span>POWERED BY DLK DIGITAL AGENCY</span>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl font-medium tracking-tight mb-6">
                Nous ne construisons pas des sites. <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
                  Nous forgeons des écosystèmes.
                </span>
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed">
                Metalya est notre laboratoire (R&D). C'est ici que{" "}
                <strong>DLK Digital Agency</strong> repousse les limites du
                framework Next.js pour offrir des performances web-vitals
                parfaites (100/100).
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-20">
            <FadeIn
              delay={0.1}
              className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 p-8 md:p-12 transition-colors hover:bg-neutral-900 hover:border-indigo-500/30"
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl group-hover:bg-indigo-500/30 transition-all" />
              <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-2xl font-serif font-medium mb-3">
                    Performance Extrême
                  </h3>
                  <p className="text-neutral-400 max-w-md">
                    Utilisation du <strong>Server-Side Rendering (SSR)</strong>{" "}
                    et de l'Edge Caching. Résultat : un Time to First Byte
                    (TTFB) inférieur à 50ms partout dans le monde.
                  </p>
                </div>
                <div className="flex items-end gap-2 h-16 w-full opacity-50">
                  {[40, 65, 45, 80, 55, 90, 100].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="flex-1 bg-linear-to-t from-indigo-500 to-cyan-400 rounded-t-sm opacity-80"
                    />
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn
              delay={0.2}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 p-8 transition-colors hover:bg-neutral-900 hover:border-emerald-500/30"
            >
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl group-hover:bg-emerald-500/30 transition-all" />
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <Search size={24} />
              </div>
              <h3 className="text-2xl font-serif font-medium mb-3">
                SEO Sémantique
              </h3>
              <p className="text-neutral-400 text-sm">
                Structure de données JSON-LD intégrée, maillage interne
                intelligent et balises meta dynamiques. Google adore ce que nous
                faisons.
              </p>
            </FadeIn>

            <FadeIn
              delay={0.3}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 p-8 transition-colors hover:bg-neutral-900 hover:border-amber-500/30"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                <Layers size={24} />
              </div>
              <h3 className="text-2xl font-serif font-medium mb-3">
                Design System
              </h3>
              <p className="text-neutral-400 text-sm">
                Une interface cohérente, accessible (WCAG) et fluide. Animations
                Framer Motion à 60fps sans bloquer le thread principal.
              </p>
            </FadeIn>

            <FadeIn
              delay={0.4}
              className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 p-8 md:p-12 transition-colors hover:bg-neutral-900 hover:border-cyan-500/30"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-1/2 bg-linear-to-r from-transparent via-cyan-500/5 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                    <Rocket size={24} />
                  </div>
                  <h3 className="text-2xl font-serif font-medium mb-3">
                    Architecture Headless
                  </h3>
                  <p className="text-neutral-400">
                    Découplage total entre le contenu (Database) et le rendu.
                    Cela nous permet de changer de design sans perdre une
                    virgule, et d'encaisser des pics de trafic massifs.
                  </p>
                </div>
                <div className="shrink-0 bg-neutral-950 border border-white/10 rounded-xl p-4 font-mono text-xs text-neutral-400">
                  <div className="flex gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <p>
                    <span className="text-purple-400">const</span> stack = {"{"}
                  </p>
                  <p className="pl-4">
                    framework:{" "}
                    <span className="text-green-400">"Next.js 15"</span>,
                  </p>
                  <p className="pl-4">
                    database:{" "}
                    <span className="text-green-400">"Prisma / MongoDB"</span>,
                  </p>
                  <p className="pl-4">
                    deployment:{" "}
                    <span className="text-green-400">"Vercel Edge"</span>,
                  </p>
                  <p>{"}"};</p>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn className="text-center">
            <p className="text-neutral-400 mb-8">
              Vous avez un projet complexe ? Une vision ambitieuse ?
            </p>
            <a
              href="https://dlkdigitalagency.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-white text-neutral-950 px-8 py-4 font-bold transition-all hover:scale-105 hover:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              <Globe size={18} />
              Travailler avec DLK Digital Agency
            </a>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <FadeIn className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-4xl bg-neutral-100">
                <Image
                  src="/ales-nesetril-Im7lZjxeLhg-unsplash.jpg"
                  alt="Espace de travail créatif"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </FadeIn>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <FadeIn delay={0.2}>
                <h2 className="font-serif text-4xl md:text-5xl font-medium text-neutral-950 mb-6">
                  Une approche artisanale du numérique.
                </h2>
                <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                  Derrière Metalya, il y a <strong>Matteo Biyikli</strong> et
                  son équipe. Nous croyons que le code est une forme d'art, au
                  même titre que l'écriture.
                </p>
                <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                  Chaque fonctionnalité de ce site a été pensée pour servir le
                  lecteur, jamais pour le distraire. Pas de pop-ups agressifs,
                  pas de trackers invasifs. Juste du contenu et de la fluidité.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-neutral-900 font-bold border-b-2 border-neutral-200 pb-1 hover:border-neutral-900 transition-colors"
                  >
                    Nous contacter
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/category/tech"
                    className="inline-flex items-center gap-2 text-neutral-500 font-medium hover:text-neutral-900 transition-colors"
                  >
                    Lire nos articles Tech
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
