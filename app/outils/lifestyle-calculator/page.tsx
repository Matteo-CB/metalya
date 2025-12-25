import type { Metadata } from "next";
import { LifestyleCalculator } from "@/components/tools/lifestyle-calculator";
import { Container } from "@/components/ui/container";
import { Coins, Globe, TrendingUp, Briefcase } from "lucide-react";

// SEO : On vise "Pouvoir d'achat", "Salaire Expatrié", "Géo-arbitrage"
export const metadata: Metadata = {
  title: "Simulateur de Pouvoir d'Achat & Salaire Expatrié 2025 | Metalya",
  description:
    "Votre salaire actuel vaut-il plus à l'étranger ? Comparez votre pouvoir d'achat dans 80 pays. L'outil idéal pour préparer une expatriation ou un long voyage.",
  keywords: [
    "calculateur pouvoir d'achat",
    "salaire expatriation comparatif",
    "vivre mieux pour moins cher",
    "geo arbitrage",
    "rentier voyage",
    "cout vie comparateur",
  ],
  openGraph: {
    title: "Combien vaut vraiment votre salaire à l'étranger ?",
    description:
      "Le calculateur de géo-arbitrage gratuit. Découvrez où vous êtes riche.",
    url: "https://metalya.fr/outils/lifestyle-calculator",
    type: "website",
    images: [
      {
        url: "/og-tools.jpg",
        width: 1200,
        height: 630,
        alt: "Simulateur Pouvoir d'Achat",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Metalya Purchasing Power Calculator",
  applicationCategory: "FinanceApplication",
  description: "Outil de comparaison de pouvoir d'achat international.",
};

export default function LifestyleCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-neutral-50 pt-24 pb-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-100/30 rounded-full blur-[120px] -z-10" />

        <Container>
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-200">
              <Coins size={14} /> Géo-Arbitrage 2025
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Où votre salaire vous rend-il <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Riche ?
              </span>
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              Le secret n'est pas de gagner plus, mais de dépenser là où la vie
              est moins chère. Entrez votre revenu actuel et découvrez les pays
              où vous vivrez comme un roi.
            </p>
          </div>

          <LifestyleCalculator />

          {/* SEO Content Section */}
          <section className="mt-32 grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mx-auto mb-6 text-indigo-600">
                <Globe size={32} />
              </div>
              <h3 className="font-bold text-lg mb-3">Le Géo-Arbitrage</h3>
              <p className="text-neutral-500 text-sm">
                Utiliser une devise forte (Euro/Dollar) pour vivre dans un pays
                à devise faible. C'est le levier financier le plus puissant pour
                les voyageurs.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mx-auto mb-6 text-emerald-600">
                <TrendingUp size={32} />
              </div>
              <h3 className="font-bold text-lg mb-3">Épargner 50% de plus</h3>
              <p className="text-neutral-500 text-sm">
                En maintenant votre salaire mais en réduisant vos coûts fixes
                (loyer, nourriture) de moitié, votre capacité d'épargne explose.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mx-auto mb-6 text-purple-600">
                <Briefcase size={32} />
              </div>
              <h3 className="font-bold text-lg mb-3">
                Pour Expatriés & Freelances
              </h3>
              <p className="text-neutral-500 text-sm">
                Que vous soyez retraité, télétravailleur ou entrepreneur,
                visualisez instantanément votre niveau de vie potentiel.
              </p>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
