import type { Metadata } from "next";
import { LifestyleCalculator } from "@/components/tools/lifestyle-calculator";
import { Container } from "@/components/ui/container";
import { Crown, TrendingUp, Globe, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Calculateur de Salaire Réel : Où êtes-vous Riche ? | Metalya",
  description:
    "Votre salaire de 2000€ vaut 8000€ ailleurs. Découvrez dans quel pays vous êtes considéré comme riche. Comparateur de pouvoir d'achat international.",
  keywords: [
    "pouvoir d'achat expatriation",
    "salaire bali vs paris",
    "vivre comme un roi",
    "geoarbitrage calculateur",
    "classement richesse mondiale",
  ],
  openGraph: {
    title: "Je suis riche à... ? Faites le test.",
    description:
      "Découvrez instantanément où votre salaire actuel fait de vous un roi.",
    images: [{ url: "/og-lifestyle.jpg", width: 1200, height: 630 }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Calculateur de Richesse Relative Metalya",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description:
    "Outil de calcul de parité de pouvoir d'achat pour nomades et expatriés.",
};

export default function LifestylePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-neutral-50 pt-24 pb-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-yellow-200/20 rounded-full blur-[120px] -z-10" />

        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-widest mb-6 border border-yellow-200">
              <Crown size={14} /> Géo-Arbitrage 2025
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-neutral-900 mb-6">
              Où vivre comme un{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">
                Millionnaire
              </span>{" "}
              ?
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              Le <strong>Géo-arbitrage</strong> consiste à gagner une devise
              forte (Euro) et à la dépenser dans une économie plus douce. Entrez
              votre salaire, nous vous dirons où faire vos valises.
            </p>
          </div>

          <LifestyleCalculator />

          {/* SEO Content (Hidden Gold) */}
          <section className="mt-32 max-w-4xl mx-auto prose prose-neutral text-center">
            <h2>Pourquoi votre salaire change de valeur ?</h2>
            <p>
              Un salaire de 2000€ à Paris couvre à peine un loyer et les
              charges. Le même montant à <strong>Bali</strong>,{" "}
              <strong>Buenos Aires</strong> ou <strong>Chiang Mai</strong> vous
              place dans le top 1% des revenus locaux.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left not-prose mt-12">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                <Wallet className="w-8 h-8 text-emerald-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Pouvoir d'Achat x3</h3>
                <p className="text-sm text-neutral-500">
                  En changeant de pays, vous multipliez mathématiquement la
                  valeur de chaque heure travaillée.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                <TrendingUp className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Épargne Massive</h3>
                <p className="text-sm text-neutral-500">
                  Au lieu d'épargner 100€/mois, vous pouvez mettre de côté
                  1000€/mois sans changer de travail.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                <Globe className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Qualité de Vie</h3>
                <p className="text-sm text-neutral-500">
                  Accédez à des services (ménage, restaurants, piscine) réservés
                  aux ultra-riches en Europe.
                </p>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
