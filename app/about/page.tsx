import Image from "next/image";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import {
  ArrowRight,
  Cpu,
  Zap,
  Globe,
  Feather,
  LayoutTemplate,
  ShieldCheck,
  Code2,
  Gem,
  Rocket,
  Leaf,
  Library,
  Eye,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos - Le Manifeste Metalya & Hidden Lab",
  description:
    "Metalya est bien plus qu'un média. C'est une démonstration de force technique conçue par l'agence Hidden Lab. Découvrez notre vision du web de demain.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
      {/* --- HERO SECTION : LE MANIFESTE --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background abstrait et élégant */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white opacity-80" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-100/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-xs font-bold uppercase tracking-widest mb-8">
                  <Feather size={12} />
                  <span>Notre Philosophie</span>
                </div>
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-neutral-950 mb-8 leading-[1.05]">
                  L'élégance du papier, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-900 italic">
                    la puissance du code.
                  </span>
                </h1>
                <div className="prose prose-lg prose-neutral text-neutral-600 space-y-6 max-w-2xl">
                  <p className="text-xl font-medium text-neutral-900">
                    Le Web a perdu son âme. Il est devenu une foire bruyante,
                    saturée de publicités clignotantes, de pop-ups agressifs et
                    de contenus vides générés pour les robots.
                  </p>
                  <p>
                    <strong>Metalya est notre acte de résistance.</strong>
                  </p>
                  <p>
                    Nous avons voulu construire un sanctuaire numérique. Un
                    espace où le temps ralentit. Où la typographie respire. Où
                    la technologie, au lieu de distraire, s'efface totalement
                    pour servir une seule mission : la transmission du savoir.
                  </p>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-5 relative">
              <FadeIn
                delay={0.2}
                className="relative aspect-[4/5] w-full group"
              >
                <div className="absolute inset-0 bg-neutral-900 rounded-2xl rotate-3 opacity-5 group-hover:rotate-6 transition-transform duration-700" />
                <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl border border-white/20">
                  <Image
                    src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
                    alt="Bureau minimaliste d'architecte symbolisant la clarté"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-1000"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 md:p-12">
                    <blockquote className="text-white">
                      <p className="font-serif text-2xl italic leading-relaxed mb-4">
                        "La simplicité est la sophistication suprême."
                      </p>
                      <footer className="text-sm font-bold uppercase tracking-widest opacity-70">
                        — Léonard de Vinci
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      {/* --- SECTION ÉDITORIALE : CONTRE LE CLICKBAIT --- */}
      <section className="py-24 bg-neutral-50 border-y border-neutral-200">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <FadeIn>
              <h2 className="font-serif text-4xl md:text-5xl font-medium text-neutral-900 mb-6">
                L'Antidote au "Clickbait"
              </h2>
              <p className="text-lg text-neutral-600">
                Nous refusons la dictature de l'instantanéité. Notre modèle
                éditorial repose sur trois piliers indéfectibles qui guident
                chaque article publié sur cette plateforme.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn
              delay={0.1}
              className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                <Library size={24} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Profondeur &gt; Vitesse
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Nous ne courons pas après l'actualité chaude. Nous préférons
                analyser les tendances de fond. Nos articles sont des
                "Long-Forms" conçus pour être lus, relus et archivés.
              </p>
            </FadeIn>

            <FadeIn
              delay={0.2}
              className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Respect de l'Attention
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Pas de titres trompeurs. Pas de diaporamas pour gonfler les
                pages vues. Pas de vidéos en lecture automatique. Nous
                respectons votre temps de cerveau disponible.
              </p>
            </FadeIn>

            <FadeIn
              delay={0.3}
              className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <Leaf size={24} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Information Durable
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Nous écrivons des contenus "Evergreen". Un article publié
                aujourd'hui sur Metalya doit être encore pertinent et utile dans
                deux ans. C'est notre définition de la valeur.
              </p>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* --- SECTION TECH : POWERED BY HIDDEN LAB --- */}
      <section className="relative bg-neutral-950 py-24 md:py-40 text-white overflow-hidden">
        {/* Grille de fond futuriste */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono mb-8 backdrop-blur-md">
                <Cpu size={14} />
                <span>POWERED BY HIDDEN LAB</span>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl font-medium mb-6 leading-tight">
                Sous le capot, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
                  une Formule 1.
                </span>
              </h2>
              <p className="text-xl text-neutral-400 font-light leading-relaxed">
                Metalya n'est pas un simple blog WordPress. C'est une{" "}
                <strong>Application Web Progressive (PWA)</strong>, conçue sur
                mesure par l'agence Hidden Lab. Nous avons utilisé les
                technologies les plus avancées de 2025 pour prouver qu'un site
                web peut être à la fois magnifique et instantané.
              </p>
            </FadeIn>

            <FadeIn
              delay={0.2}
              className="bg-neutral-900/80 p-8 rounded-3xl border border-white/10 backdrop-blur-sm"
            >
              <h3 className="text-xl font-serif mb-6 flex items-center gap-3">
                <Code2 className="text-indigo-400" />
                La "Stack" Technique
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm font-mono text-neutral-300">
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                  <span>Framework</span>
                  <span className="text-white font-bold">Next.js 15</span>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                  <span>Langage</span>
                  <span className="text-blue-300 font-bold">TypeScript</span>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                  <span>Database</span>
                  <span className="text-emerald-300 font-bold">MongoDB</span>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                  <span>Styling</span>
                  <span className="text-cyan-300 font-bold">Tailwind</span>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                  <span>Edge</span>
                  <span className="text-white font-bold">Vercel</span>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                  <span>Motion</span>
                  <span className="text-purple-300 font-bold">Framer</span>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            {/* Card 1: Performance */}
            <FadeIn
              delay={0.1}
              className="md:col-span-2 group p-8 md:p-10 rounded-3xl bg-neutral-900 border border-white/5 hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Vitesse Instantanée</h3>
              <p className="text-neutral-400 leading-relaxed">
                Nous utilisons le <strong>Server-Side Rendering (SSR)</strong>{" "}
                et la régénération statique incrémentale (ISR). Les pages sont
                pré-calculées sur des serveurs Edge partout dans le monde.
                Résultat : un affichage en moins de 100ms, où que vous soyez.
              </p>
            </FadeIn>

            {/* Card 2: Headless */}
            <FadeIn
              delay={0.2}
              className="md:col-span-2 group p-8 md:p-10 rounded-3xl bg-neutral-900 border border-white/5 hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <LayoutTemplate size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Architecture Headless</h3>
              <p className="text-neutral-400 leading-relaxed">
                Le contenu est totalement découplé du design. Cette approche
                modulaire permet une sécurité maximale (aucune base de données
                n'est exposée au public) et une flexibilité infinie pour faire
                évoluer le design sans toucher au contenu.
              </p>
            </FadeIn>

            {/* Card 3: SEO */}
            <FadeIn
              delay={0.3}
              className="md:col-span-2 group p-8 md:p-10 rounded-3xl bg-neutral-900 border border-white/5 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">SEO Sémantique</h3>
              <p className="text-neutral-400 leading-relaxed">
                Nous ne faisons pas que du "mot-clé". Chaque article est injecté
                avec des données structurées JSON-LD (Schema.org) pour que
                Google comprenne parfaitement le contexte. Breadcrumbs, balises
                canoniques, Open Graph... tout est automatisé.
              </p>
            </FadeIn>

            {/* Card 4: Mobile First */}
            <FadeIn
              delay={0.4}
              className="md:col-span-2 group p-8 md:p-10 rounded-3xl bg-neutral-900 border border-white/5 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Smartphone size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                Expérience Mobile Native
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Metalya se comporte comme une application native. Gestes
                fluides, chargement des images optimisé, typographie adaptative.
                Nous avons conçu le site pour le pouce, pas pour la souris.
              </p>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* --- SECTION VALEURS : L'ARTISANAT DIGITAL --- */}
      <section className="py-24 md:py-32 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <FadeIn className="order-2 lg:order-1">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
                    alt="Code propre sur un écran"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6">
                <Gem size={12} />
                <span>Nos Standards</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-medium text-neutral-950 mb-8 leading-tight">
                Nous sommes des artisans du numérique.
              </h2>
              <p className="text-lg text-neutral-600 mb-10 leading-relaxed">
                Chez <strong>Hidden Lab</strong>, nous croyons que le code est
                une forme d'artisanat. Nous rejetons l'obsolescence programmée
                des sites web. Nous construisons pour durer.
              </p>

              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="shrink-0 mt-1 p-3 bg-neutral-100 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-xl">
                      Privacy First
                    </h3>
                    <p className="text-neutral-600 mt-2 leading-relaxed">
                      Nous ne vendons pas vos données. Nous n'utilisons pas de
                      cookies tiers intrusifs. Nous respectons le RGPD par
                      design, pas par contrainte. C'est un web plus propre et
                      plus honnête.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="shrink-0 mt-1 p-3 bg-neutral-100 rounded-xl">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-xl">
                      Éco-conception (Green IT)
                    </h3>
                    <p className="text-neutral-600 mt-2 leading-relaxed">
                      Chaque octet compte. En optimisant les images et en
                      réduisant les scripts, nous réduisons drastiquement
                      l'empreinte carbone de chaque visite. Un site rapide est
                      un site écologique.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="shrink-0 mt-1 p-3 bg-neutral-100 rounded-xl">
                    <LayoutTemplate className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-xl">
                      Design Intemporel
                    </h3>
                    <p className="text-neutral-600 mt-2 leading-relaxed">
                      Nous fuyons les modes éphémères. Nous privilégions une
                      esthétique minimaliste, basée sur des grilles solides et
                      une typographie parfaite, qui ne vieillira pas dans six
                      mois.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-24 md:py-32 bg-neutral-950 border-t border-white/10 relative overflow-hidden">
        {/* Effet de lueur final */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-indigo-500/20 to-transparent blur-[100px] pointer-events-none" />

        <Container className="relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-6xl font-medium text-white mb-8">
              Votre vision mérite ce niveau d'excellence.
            </h2>
            <p className="text-xl text-neutral-400 mb-12 font-light leading-relaxed">
              Metalya est la preuve vivante de notre savoir-faire. <br />
              Vous souhaitez créer une plateforme média, un site vitrine premium
              ou une application SaaS avec la même rigueur technique et
              esthétique ?
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="https://hiddenlab.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-white text-neutral-950 px-8 py-5 font-bold text-base hover:bg-neutral-200 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
              >
                <Rocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                Démarrer un projet avec Hidden Lab
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 text-white px-8 py-5 font-bold text-base hover:bg-white/10 backdrop-blur-sm transition-all"
              >
                Contacter la rédaction
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <p className="mt-12 text-sm text-neutral-500 font-mono">
              Conçu avec passion à Paris & Provence. ©{" "}
              {new Date().getFullYear()} Hidden Lab.
            </p>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
