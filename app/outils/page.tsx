import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { tools } from "@/lib/tools-config"; // Import de la configuration dynamique

export const metadata: Metadata = {
  title: "Outils Numériques Gratuits & IA | Metalya",
  description:
    "Suite d'outils puissants pour créateurs : Détourage photo IA, Convertisseur WebP, et utilitaires SEO. Gratuits, illimités et 100% privés.",
  keywords: [
    "supprimer fond image",
    "convertisseur image",
    "outils seo gratuits",
    "digital nomad tools",
    "détourage ia",
    "productivité",
  ],
  alternates: {
    canonical: "https://metalya.fr/outils",
  },
  openGraph: {
    title: "Metalya Tools | La Suite Créative Gratuite",
    description:
      "Des outils performants qui respectent votre vie privée. Détourage, Conversion, Analyse.",
    url: "https://metalya.fr/outils",
    type: "website",
    images: [
      {
        url: "/og-tools.jpg",
        width: 1200,
        height: 630,
        alt: "Metalya Tools Suite",
      },
    ],
  },
};

// Génération dynamique du JSON-LD pour Google
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Suite d'Outils Metalya",
  description:
    "Collection d'utilitaires web gratuits pour l'édition d'image et la productivité.",
  url: "https://metalya.fr/outils",
  hasPart: tools.map((tool) => ({
    "@type": "SoftwareApplication",
    name: tool.title,
    description: tool.description,
    applicationCategory: "MultimediaApplication",
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

      {/* Background Effect */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-500/20 opacity-20 blur-[100px]" />
      </div>

      <Container>
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Boîte à Outils{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Créative
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Une suite d'utilitaires nouvelle génération.
              <span className="text-foreground font-medium">
                {" "}
                IA embarquée, exécution locale, confidentialité totale.
              </span>
              Tout ce dont vous avez besoin pour créer mieux, plus vite.
            </p>
          </div>
        </FadeIn>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {tools.map((tool, index) => (
            <FadeIn key={tool.title} delay={0.05 * index}>
              <div
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-300 ${
                  tool.status === "active" || tool.status === "new"
                    ? `border-border bg-card hover:shadow-2xl ${tool.border}`
                    : "border-border/50 bg-secondary/20 opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                }`}
              >
                {/* Gradient Hover Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                />

                <div className="mb-6 flex items-center justify-between relative z-10">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
                      tool.status === "active" || tool.status === "new"
                        ? `${tool.bg} ${tool.color}`
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <tool.icon className="h-6 w-6" />
                  </div>

                  <div className="flex gap-2">
                    {tool.badge && (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ring-1 ring-inset ${
                          tool.badge === "Nouveau"
                            ? "bg-purple-100 text-purple-700 ring-purple-700/10"
                            : "bg-blue-50 text-blue-700 ring-blue-700/10"
                        }`}
                      >
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
                </div>

                <h2 className="text-xl font-bold leading-7 tracking-tight text-foreground relative z-10">
                  {tool.status === "active" || tool.status === "new" ? (
                    <Link href={tool.href} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {tool.title}
                    </Link>
                  ) : (
                    tool.title
                  )}
                </h2>

                <p className="mt-3 flex-auto text-base leading-7 text-muted-foreground relative z-10">
                  {tool.description}
                </p>

                {(tool.status === "active" || tool.status === "new") && (
                  <div
                    className={`mt-6 flex items-center gap-2 text-sm font-bold opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 ${tool.color}`}
                  >
                    Lancer l'outil <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Section Hidden Lab / Pub Élégante */}
        <FadeIn delay={0.4}>
          <div className="mt-24 rounded-3xl border border-border bg-gradient-to-br from-neutral-900 to-neutral-800 p-1 shadow-2xl">
            <div className="relative overflow-hidden rounded-[20px] bg-neutral-950 px-6 py-10 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between lg:p-20">
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-purple-500/20 blur-[80px]" />
              <div className="absolute -bottom-10 right-10 h-40 w-40 rounded-full bg-pink-500/20 blur-[80px]" />

              <div className="lg:max-w-xl">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-serif">
                  Architecture d'Excellence
                </h2>
                <p className="mt-4 text-base leading-7 text-neutral-400">
                  Ces outils sont propulsés par une ingénierie de pointe, conçue
                  pour la vitesse et l'esthétique. Vous avez un projet ambitieux
                  ? Révélez sa véritable identité avec une présence numérique
                  haute précision.
                </p>
                <div className="mt-6 flex items-center gap-x-2 text-sm font-medium text-white">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <span>Design Minimaliste & Performance Maximale</span>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
                <a
                  href="https://hiddenlab.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3 text-sm font-bold text-neutral-900 transition-all hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span className="relative z-10">Découvrir Hidden Lab</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
