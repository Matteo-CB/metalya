import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Image as ImageIcon,
  Globe,
  Zap,
  Clock,
  Search,
  Lock,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";

export const metadata: Metadata = {
  title: "Outils Web Gratuits & Convertisseur Image Rapide | Metalya",
  description:
    "Suite d'outils gratuits pour créateurs : Convertisseur JPG/PNG vers WebP sécurisé, comparateur de coût de vie nomade et minuteur Pomodoro. Sans installation, 100% privé.",
  keywords: [
    "convertisseur webp",
    "compresser image en ligne",
    "outils digital nomad",
    "pomodoro en ligne",
    "simulateur serp",
    "calculateur temps de lecture",
    "outils gratuits",
  ],
  alternates: {
    canonical: "https://metalya.fr/outils",
  },
  openGraph: {
    title: "Outils Web Gratuits & Performance | Metalya",
    description:
      "Accélérez votre flux de travail avec nos outils gratuits, privés et ultra-rapides.",
    url: "https://metalya.fr/outils",
    type: "website",
    images: [
      {
        url: "/og-tools.jpg", // Assurez-vous d'avoir une image générique ou utilisez celle par défaut
        width: 1200,
        height: 630,
        alt: "Metalya Tools Suite",
      },
    ],
  },
};

const tools = [
  {
    title: "Studio Image",
    description:
      "Convertisseur d'images ultra-rapide. Transformez vos JPG/PNG en WebP instantanément. Compression sans perte visible. 100% Local & Privé.",
    icon: ImageIcon,
    href: "/outils/convertisseur-image",
    status: "active",
    badge: "Populaire",
  },
  {
    title: "Nomad Cost",
    description:
      "Comparateur de coût de la vie pour Digital Nomads. Calculez votre pouvoir d'achat entre Paris, Bali, Lisbonne et plus de 500 villes.",
    icon: Globe,
    href: "/outils/nomad-cost",
    status: "coming-soon",
  },
  {
    title: "Focus Sanctuaire",
    description:
      "Retrouvez le Deep Work. Minuteur Pomodoro couplé à des ambiances sonores (bruit blanc, pluie, café) pour une concentration maximale.",
    icon: Clock,
    href: "/outils/focus",
    status: "coming-soon",
  },
  {
    title: "SEO Preview",
    description:
      "Simulateur de SERP Google. Prévisualisez et optimisez vos titres et méta-descriptions pour augmenter votre taux de clic (CTR).",
    icon: Search,
    href: "/outils/seo-preview",
    status: "coming-soon",
  },
  {
    title: "Lecteur Zen",
    description:
      "Analysez la lisibilité de vos textes. Estimation du temps de lecture et calcul de complexité pour une accessibilité parfaite.",
    icon: Zap,
    href: "/outils/lecture",
    status: "coming-soon",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Outils Metalya",
  description:
    "Une collection d'outils web gratuits pour la productivité et la création de contenu.",
  url: "https://metalya.fr/outils",
  hasPart: tools.map((tool) => ({
    "@type": "SoftwareApplication",
    name: tool.title,
    description: tool.description,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  })),
};

export default function ToolsPage() {
  return (
    <div className="relative min-h-screen bg-background pb-20 pt-24 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      </div>

      <Container>
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Boîte à Outils <span className="text-primary">Numérique</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Une suite d'utilitaires web conçue pour la performance. Sans
              inscription, sans traqueurs, sans perte de temps. Optimisez votre
              flux de travail créatif dès maintenant.
            </p>
          </div>
        </FadeIn>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {tools.map((tool, index) => (
            <FadeIn key={tool.title} delay={0.1 * index}>
              <div
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-300 ${
                  tool.status === "active"
                    ? "border-border bg-card hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5"
                    : "border-border/50 bg-secondary/20 opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                }`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      tool.status === "active"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <tool.icon className="h-6 w-6" />
                  </div>
                  {tool.badge && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                      {tool.badge}
                    </span>
                  )}
                  {tool.status === "coming-soon" && (
                    <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Bientôt
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-semibold leading-7 tracking-tight text-foreground">
                  {tool.status === "active" ? (
                    <Link href={tool.href} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {tool.title}
                    </Link>
                  ) : (
                    tool.title
                  )}
                </h2>

                <p className="mt-3 flex-auto text-base leading-7 text-muted-foreground">
                  {tool.description}
                </p>

                {tool.status === "active" && (
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Lancer l'outil{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="mt-24 rounded-3xl border border-border bg-gradient-to-br from-card to-background p-1 shadow-sm">
            <div className="relative overflow-hidden rounded-[20px] bg-background px-6 py-10 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between lg:p-20">
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-50" />
              <div className="absolute -left-4 top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-4 right-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

              <div className="lg:max-w-xl">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Architecture d'Excellence
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Ces outils sont propulsés par une ingénierie de pointe, conçue
                  pour la vitesse et l'esthétique. Vous avez un projet ? Révélez
                  sa véritable identité avec une présence numérique haute
                  précision.
                </p>
                <div className="mt-6 flex items-center gap-x-2 text-sm font-medium text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Design Minimaliste & Performance Maximale</span>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
                <a
                  href="https://hiddenlab.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition-all hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="relative z-10">Découvrir Hidden Lab</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 -z-10 translate-y-full bg-primary transition-transform duration-300 group-hover:translate-y-0" />
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
