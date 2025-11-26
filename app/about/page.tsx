import Image from "next/image";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight, Code2, Lightbulb, Newspaper } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "À Propos de Metalya & DLK",
  description:
    "L'histoire derrière Metalya, une fusion entre exploration éditoriale et excellence technique portée par DLK Digital Agency.",
};

export default function AboutPage() {
  return (
    <div className="bg-neutral-50">
      {/* --- ACTE 1 : LE MANIFESTE (HERO) --- */}
      <section className="relative overflow-hidden pb-24 pt-32 md:pb-40 md:pt-48">
        <Container>
          <div className="max-w-4xl">
            <FadeIn>
              <h1 className="font-serif text-6xl font-medium tracking-tighter text-neutral-950 sm:text-8xl md:text-9xl leading-[0.9]">
                Comprendre <br />
                le signal <br />
                <span className="text-neutral-300">dans le bruit.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-12 max-w-2xl text-xl leading-relaxed text-neutral-600 md:text-2xl">
                Nous vivons dans un océan d'informations. Metalya n'est pas là
                pour ajouter du volume, mais pour offrir de la clarté. Une
                exploration lente et délibérée à l'intersection de la
                technologie, de la culture et de notre futur.
              </p>
            </FadeIn>
          </div>
        </Container>

        {/* Abstract Background Element */}
        <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/4 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 blur-[120px] opacity-70" />
      </section>

      {/* --- ACTE 2 : L'IMAGE DE MARQUE (VISUEL FORT) --- */}
      <section className="py-12">
        <Container>
          <FadeIn>
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2664&auto=format&fit=crop"
                alt="Abstract digital art wave"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                sizes="95vw"
                priority
              />
              <div className="absolute inset-0 bg-neutral-950/10" />
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* --- ACTE 3 : NOTRE PHILOSOPHIE (VALEURS) --- */}
      <section className="py-24 md:py-40">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <FadeIn>
              <h2 className="font-serif text-4xl font-medium text-neutral-950 md:text-5xl">
                Contre l'éphémère, <br /> choisir la profondeur.
              </h2>
            </FadeIn>
            <div className="space-y-16">
              <FadeIn delay={0.1}>
                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-900">
                    <Newspaper size={24} />
                  </div>
                  <div>
                    <h3 className="mb-3 font-serif text-2xl font-medium">
                      Slow Journalisme
                    </h3>
                    <p className="text-lg leading-relaxed text-neutral-600">
                      Nous rejetons la course au clic. Nos articles sont pensés
                      pour être lus aujourd'hui et relus dans six mois. Nous
                      prenons le temps d'analyser les tendances de fond plutôt
                      que de réagir à l'actualité brûlante.
                    </p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-900">
                    <Lightbulb size={24} />
                  </div>
                  <div>
                    <h3 className="mb-3 font-serif text-2xl font-medium">
                      Curiosité Radicale
                    </h3>
                    <p className="text-lg leading-relaxed text-neutral-600">
                      Le design influence la tech, la tech influence la culture,
                      la culture influence le voyage. Nous décloisonnons les
                      disciplines pour offrir une vision holistique du monde
                      contemporain.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      {/* --- ACTE 4 : LA GENÈSE & DLK DIGITAL AGENCY (PARTENARIAT) --- */}
      {/* Utilisation d'un fond sombre pour marquer une rupture visuelle forte */}
      <section className="bg-neutral-950 py-24 md:py-40 text-white overflow-hidden relative">
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <span className="block mb-6 font-mono text-sm uppercase tracking-widest text-neutral-400">
                L'Alliance du fond et de la forme
              </span>
              <h2 className="font-serif text-5xl md:text-7xl font-medium mb-8 leading-tight">
                Né de la vision de Matteo Biyikli, <br />
                Sculpté par <span className="text-neutral-400">DLK.</span>
              </h2>
              <p className="text-xl text-neutral-300 leading-relaxed mb-12 max-w-xl">
                Metalya n'est pas qu'un simple blog. C'est une démonstration de
                force. Le résultat d'une conviction : un contenu exceptionnel ne
                peut exister que dans un écrin technologique parfait.
              </p>

              <div className="space-y-8 border-l-2 border-neutral-800 pl-8 relative">
                <div className="space-y-2 relative">
                  <Code2
                    className="text-neutral-400 absolute -left-[49px] top-1 bg-neutral-950 py-2"
                    size={32}
                  />
                  <h4 className="text-xl font-serif font-medium">
                    L'Excellence Technique DLK
                  </h4>
                  <p className="text-neutral-400">
                    Conçu et développé par <strong>DLK Digital Agency</strong>,
                    ce site repousse les limites de l'ingénierie web moderne
                    (Next.js 15, Server Components, Edge Caching) pour offrir
                    une performance instantanée et une expérience utilisateur
                    fluide.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-serif font-medium">
                    Le Laboratoire Digital
                  </h4>
                  <p className="text-neutral-400">
                    Pour DLK, Metalya est un terrain de jeu grandeur nature. Un
                    laboratoire où tester les dernières innovations en matière
                    d'UI/UX, de SEO sémantique et d'architecture headless avant
                    de les déployer pour leurs clients.
                  </p>
                </div>
              </div>

              <div className="mt-16">
                <a
                  href="https://dlkdigitalagency.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-white text-neutral-950 px-8 py-4 font-bold transition-transform hover:scale-105"
                >
                  Découvrir DLK Digital Agency
                  <ArrowRight size={20} />
                </a>
              </div>
            </FadeIn>

            {/* Image abstraite représentant la "Tech/Structure" */}
            <FadeIn
              delay={0.3}
              className="h-full min-h-[600px] relative hidden lg:block rounded-3xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2664&auto=format&fit=crop"
                alt="Structure architecturale abstraite et lumineuse"
                fill
                className="object-cover opacity-80"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
            </FadeIn>
          </div>
        </Container>

        {/* Subtle background grid texture */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] z-0 pointer-events-none"></div>
      </section>

      {/* --- ACTE 5 : L'APPEL À L'ACTION (CONCLUSION) --- */}
      <section className="py-24 md:py-40 text-center">
        <Container className="max-w-3xl">
          <FadeIn>
            <h2 className="font-serif text-4xl md:text-6xl font-medium text-neutral-950 mb-8">
              Rejoignez le mouvement.
            </h2>
            <p className="text-xl text-neutral-600 mb-12 leading-relaxed">
              Ne soyez plus un simple consommateur passif d'informations.
              Devenez un lecteur éclairé. Abonnez-vous pour recevoir
              l'essentiel, une fois par semaine.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-lg font-bold uppercase tracking-widest text-neutral-900 group"
            >
              Créer un compte gratuit
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
