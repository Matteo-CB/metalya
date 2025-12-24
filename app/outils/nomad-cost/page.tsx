import type { Metadata } from "next";
import { NomadPlanner } from "@/components/tools/nomad-planner";
import { Container } from "@/components/ui/container";
import {
  ArrowRight,
  Plane,
  TrendingDown,
  Sun,
  DollarSign,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Top 40 Villes Digital Nomad 2025 : Budget & Coût de la Vie",
  description:
    "Comparateur complet et gratuit. Coût de la vie à Bali, Dubaï, New York, Tokyo. Où partir avec votre budget ? Données mises à jour avec l'inflation en temps réel.",
  keywords: [
    "budget voyage bali 2025",
    "coût vie dubaï",
    "digital nomad classement",
    "villes moins chères monde",
    "budget tour du monde",
    "salaire expatrié",
  ],
  alternates: {
    canonical: "https://metalya.fr/outils/nomad-cost",
  },
  openGraph: {
    title: "Le Classement Ultime du Coût de la Vie pour Voyageurs",
    description:
      "40 destinations analysées. Calculez votre pouvoir d'achat instantanément.",
    url: "https://metalya.fr/outils/nomad-cost",
    type: "website",
    images: [
      {
        url: "/og-tools.jpg",
        width: 1200,
        height: 630,
        alt: "Nomad Cost Calculator",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Metalya Nomad Métriques",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description:
    "Calculateur de budget voyage et coût de la vie pour les 40 villes les plus populaires.",
  featureList: "Comparaison New York, Bali, Dubaï, Tokyo, Paris",
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quel budget pour vivre à Bali en 2025 ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Comptez environ 1600€ par mois pour un mode de vie confortable (villa partagée, scooter, coworking).",
      },
    },
    {
      "@type": "Question",
      name: "Quelle est la ville la moins chère pour les nomades ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Da Nang (Vietnam) et Chiang Mai (Thaïlande) offrent un excellent niveau de vie pour moins de 1000€/mois.",
      },
    },
  ],
};

export default function NomadCostPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="relative min-h-screen bg-neutral-50 pt-24 pb-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-100/50 blur-[120px]" />
          <div className="absolute left-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-[100px]" />
        </div>

        <Container>
          <NomadPlanner />

          {/* SEO CONTENT SECTION (Optimisé pour les Featured Snippets) */}
          <section className="mt-32 max-w-6xl mx-auto">
            {/* Intro */}
            <div className="prose prose-neutral prose-lg mx-auto text-center mb-16">
              <h2 className="font-serif text-4xl font-bold">
                Analyse des Tendances Nomades 2025
              </h2>
              <p className="text-neutral-500">
                Nous avons analysé les 40 hubs majeurs pour les entrepreneurs et
                voyageurs. Voici les classements par catégorie pour vous aider à
                choisir votre prochaine destination.
              </p>
            </div>

            {/* Grid of "Best For" Lists (Trésor pour le SEO) */}
            <div className="grid gap-8 md:grid-cols-3">
              {/* Liste Économique */}
              <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6 text-emerald-600">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingDown size={20} />
                  </div>
                  <h3 className="font-bold text-xl text-neutral-900 m-0">
                    Les Moins Chères
                  </h3>
                </div>
                <ol className="space-y-4 m-0 p-0 list-none text-sm">
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-2">
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">1.</span> Da
                      Nang, Vietnam
                    </span>
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                      ~950€
                    </span>
                  </li>
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-2">
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">2.</span>{" "}
                      Chiang Mai, Thaïlande
                    </span>
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                      ~1000€
                    </span>
                  </li>
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-2">
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">3.</span>{" "}
                      Buenos Aires, AR
                    </span>
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                      ~1000€
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">4.</span>{" "}
                      Bali, Indonésie
                    </span>
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                      ~1600€
                    </span>
                  </li>
                </ol>
              </div>

              {/* Liste Luxe/Business */}
              <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6 text-blue-600">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign size={20} />
                  </div>
                  <h3 className="font-bold text-xl text-neutral-900 m-0">
                    Les Hubs Business
                  </h3>
                </div>
                <ol className="space-y-4 m-0 p-0 list-none text-sm">
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-2">
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-blue-500 font-bold">1.</span> New
                      York, USA
                    </span>
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      ~6800€
                    </span>
                  </li>
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-2">
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-blue-500 font-bold">2.</span>{" "}
                      Singapour
                    </span>
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      ~4500€
                    </span>
                  </li>
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-2">
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-blue-500 font-bold">3.</span>{" "}
                      Londres, UK
                    </span>
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      ~4800€
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-blue-500 font-bold">4.</span> Dubaï,
                      UAE
                    </span>
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      ~3500€
                    </span>
                  </li>
                </ol>
              </div>

              {/* Liste Soleil/Europe */}
              <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6 text-orange-500">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Sun size={20} />
                  </div>
                  <h3 className="font-bold text-xl text-neutral-900 m-0">
                    Soleil en Europe
                  </h3>
                </div>
                <ol className="space-y-4 m-0 p-0 list-none text-sm">
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-2">
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-orange-500 font-bold">1.</span>{" "}
                      Tenerife, Espagne
                    </span>
                    <span className="text-xs font-bold bg-orange-50 text-orange-700 px-2 py-1 rounded">
                      ~1700€
                    </span>
                  </li>
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-2">
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-orange-500 font-bold">2.</span>{" "}
                      Lisbonne, Portugal
                    </span>
                    <span className="text-xs font-bold bg-orange-50 text-orange-700 px-2 py-1 rounded">
                      ~2300€
                    </span>
                  </li>
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-2">
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-orange-500 font-bold">3.</span>{" "}
                      Barcelone, Espagne
                    </span>
                    <span className="text-xs font-bold bg-orange-50 text-orange-700 px-2 py-1 rounded">
                      ~2600€
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-orange-500 font-bold">4.</span>{" "}
                      Budapest, Hongrie
                    </span>
                    <span className="text-xs font-bold bg-orange-50 text-orange-700 px-2 py-1 rounded">
                      ~1600€
                    </span>
                  </li>
                </ol>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-24 bg-neutral-900 rounded-3xl p-8 md:p-12 shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
              <h3 className="font-serif text-3xl font-bold mb-12 text-center relative z-10">
                Questions Fréquentes
              </h3>
              <div className="grid gap-12 md:grid-cols-2 relative z-10">
                <div>
                  <h4 className="font-bold text-lg mb-3 text-blue-300 flex items-center gap-2">
                    <MapPin size={18} /> Quel budget pour vivre à Bali ?
                  </h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    L'inflation a touché l'Indonésie. Comptez désormais{" "}
                    <strong>1600€ par mois</strong> pour un style de vie
                    "Digital Nomad" complet (Villa avec piscine, scooter,
                    coworking, sorties).
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3 text-blue-300 flex items-center gap-2">
                    <MapPin size={18} /> Quelle est la ville la plus chère ?
                  </h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    <strong>New York</strong> reste indétrônable avec un coût
                    mensuel moyen dépassant les 6500€ pour une seule personne,
                    suivi de près par San Francisco et Singapour.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3 text-blue-300 flex items-center gap-2">
                    <MapPin size={18} /> Où aller pour payer 0% d'impôts ?
                  </h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    <strong>Dubaï</strong> est la destination phare grâce à son
                    absence d'impôt sur le revenu et sa sécurité absolue, bien
                    que le coût de la vie y soit élevé.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3 text-blue-300 flex items-center gap-2">
                    <MapPin size={18} /> Le Japon est-il accessible ?
                  </h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Oui ! Avec la faiblesse du Yen, <strong>Tokyo</strong> est
                    devenue plus abordable que Paris ou Londres. On peut y vivre
                    très confortablement pour 2600€/mois.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
