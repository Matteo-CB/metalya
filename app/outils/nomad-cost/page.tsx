import type { Metadata } from "next";
import Link from "next/link";
import { NomadPlanner } from "@/components/tools/nomad-planner";
import { Container } from "@/components/ui/container";
import { DESTINATIONS } from "@/lib/destinations-data";
import { GoogleAd } from "@/components/ads/google-ad";
import {
  ArrowRight,
  Plane,
  TrendingDown,
  Sun,
  DollarSign,
  MapPin,
  Globe,
  Calculator,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Calculateur Budget Voyage 2025 : Comparateur Coût de la Vie Monde",
  description:
    "Outil gratuit. Calculez votre budget voyage pour 80+ destinations (Bali, New York, Japon, Europe). Prix des hôtels, repas et transports mis à jour en temps réel.",
  keywords: [
    "calculateur budget voyage",
    "coût de la vie monde 2025",
    "budget tour du monde",
    "prix vacances bali",
    "budget voyage japon",
    "comparateur prix destinations",
    "salaire expatriation",
    "pouvoir d'achat tourisme",
  ],
  alternates: {
    canonical: "https://metalya.fr/outils/nomad-cost",
  },
  openGraph: {
    title: "Le Comparateur Ultime de Budget Voyage & Expatriation",
    description:
      "Ne partez pas à l'aveugle. Comparez le pouvoir d'achat dans 80 villes instantanément.",
    url: "https://metalya.fr/outils/nomad-cost",
    type: "website",
    images: [
      {
        url: "/og-tools.jpg",
        width: 1200,
        height: 630,
        alt: "Calculateur Budget Voyage Metalya",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Calculateur Budget Voyage Metalya",
  applicationCategory: "TravelApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description:
    "Outil d'estimation de budget voyage et coût de la vie pour les touristes et expatriés dans plus de 80 villes.",
  featureList:
    "Comparaison devises, budget logement, coût alimentation, transport",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quel budget prévoir pour un voyage à Bali en 2025 ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pour un voyageur, comptez environ 1600€ par mois (ou 400€/semaine) pour un niveau de vie très confortable incluant villa privée et sorties quotidiennes.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles sont les destinations les moins chères pour voyager ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'Asie du Sud-Est reste imbattable. Da Nang (Vietnam) et Chiang Mai (Thaïlande) permettent de vivre luxueusement pour moins de 1000€/mois.",
      },
    },
    {
      "@type": "Question",
      name: "Ce calculateur est-il fiable pour une expatriation ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, nos données prennent en compte les coûts réels (loyer longue durée, courses locales) et sont ajustées selon l'inflation actuelle.",
      },
    },
  ],
};

export default function NomadCostPage() {
  const featuredCities = DESTINATIONS.slice(0, 6);

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

      <div className="relative min-h-screen bg-neutral-50 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-100/40 blur-[120px]" />
          <div className="absolute left-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-emerald-100/40 blur-[100px]" />
        </div>

        <Container>
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-200">
              <Calculator size={14} /> Outil Gratuit 2025
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Quel est le vrai coût de votre <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Prochain Voyage ?
              </span>
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              Fini les mauvaises surprises. Estimez précisément votre budget
              voyage, que ce soit pour des <strong>vacances de rêve</strong>, un{" "}
              <strong>tour du monde</strong> ou une{" "}
              <strong>expatriation</strong>.
            </p>
          </div>

          <div className="mb-12">
            <GoogleAd
              slot="3729459964"
              format="auto"
              className="min-h-[100px]"
            />
            <p className="text-center text-[10px] uppercase tracking-widest text-neutral-300 mt-2">
              Publicité
            </p>
          </div>

          <NomadPlanner />

          <div className="my-20">
            <p className="text-center text-[10px] uppercase tracking-widest text-neutral-300 mb-2">
              Publicité
            </p>
            <GoogleAd
              slot="3729459964"
              format="auto"
              className="min-h-[280px]"
            />
          </div>

          <section className="mt-16 max-w-7xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3 mb-24">
              <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-6 text-emerald-600">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <TrendingDown size={24} />
                  </div>
                  <h3 className="font-bold text-xl text-neutral-900 m-0">
                    Voyages Pas Chers
                  </h3>
                </div>
                <p className="text-sm text-neutral-500 mb-4">
                  Top destinations pour backpackers et petits budgets.
                </p>
                <ol className="space-y-4 m-0 p-0 list-none text-sm font-medium">
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-3">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                        1
                      </span>
                      Da Nang, Vietnam
                    </span>
                    <span className="font-mono text-emerald-600">~950€/m</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-3">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                        2
                      </span>
                      Chiang Mai, Thaïlande
                    </span>
                    <span className="font-mono text-emerald-600">~1000€/m</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-3">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                        3
                      </span>
                      Buenos Aires, Argentine
                    </span>
                    <span className="font-mono text-emerald-600">~1100€/m</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                        4
                      </span>
                      Bali, Indonésie
                    </span>
                    <span className="font-mono text-emerald-600">~1600€/m</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-6 text-blue-600">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <DollarSign size={24} />
                  </div>
                  <h3 className="font-bold text-xl text-neutral-900 m-0">
                    Grand Tourisme & Luxe
                  </h3>
                </div>
                <p className="text-sm text-neutral-500 mb-4">
                  Villes mondiales pour shopping et affaires.
                </p>
                <ol className="space-y-4 m-0 p-0 list-none text-sm font-medium">
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-3">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                        1
                      </span>
                      New York, USA
                    </span>
                    <span className="font-mono text-blue-600">~6800€/m</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-3">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                        2
                      </span>
                      Singapour
                    </span>
                    <span className="font-mono text-blue-600">~4500€/m</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-3">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                        3
                      </span>
                      Londres, UK
                    </span>
                    <span className="font-mono text-blue-600">~4000€/m</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                        4
                      </span>
                      Dubaï, EAU
                    </span>
                    <span className="font-mono text-blue-600">~3600€/m</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-6 text-orange-500">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Sun size={24} />
                  </div>
                  <h3 className="font-bold text-xl text-neutral-900 m-0">
                    City Breaks Europe
                  </h3>
                </div>
                <p className="text-sm text-neutral-500 mb-4">
                  Destinations ensoleillées proches.
                </p>
                <ol className="space-y-4 m-0 p-0 list-none text-sm font-medium">
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-3">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                        1
                      </span>
                      Tenerife, Canaries
                    </span>
                    <span className="font-mono text-orange-600">~1700€/m</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-3">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                        2
                      </span>
                      Lisbonne, Portugal
                    </span>
                    <span className="font-mono text-orange-600">~2300€/m</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-neutral-50 pb-3">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                        3
                      </span>
                      Barcelone, Espagne
                    </span>
                    <span className="font-mono text-orange-600">~2600€/m</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                        4
                      </span>
                      Budapest, Hongrie
                    </span>
                    <span className="font-mono text-orange-600">~1600€/m</span>
                  </li>
                </ol>
              </div>
            </div>

            <div className="my-20">
              <GoogleAd
                slot="3729459964"
                format="auto"
                className="min-h-[280px]"
              />
              <p className="text-center text-[10px] uppercase tracking-widest text-neutral-300 mt-2">
                Publicité
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100">
                  <h2 className="font-serif text-3xl font-bold mb-8 text-neutral-900">
                    Comprendre le coût de la vie à l'étranger
                  </h2>
                  <div className="prose prose-neutral max-w-none text-neutral-600">
                    <p>
                      Planifier un voyage ou une expatriation demande une vision
                      claire des dépenses. Notre algorithme Metalya analyse des
                      milliers de points de données pour vous donner un budget
                      réaliste.
                    </p>
                    <h3>Que comprend le budget mensuel ?</h3>
                    <p>L'estimation "Voyageur / Expat" inclut :</p>
                    <ul>
                      <li>
                        <strong>Logement :</strong> Location d'un appartement
                        meublé ou Airbnb au mois dans un quartier central.
                      </li>
                      <li>
                        <strong>Alimentation :</strong> Un mix équilibré entre
                        courses au supermarché et restaurants locaux.
                      </li>
                      <li>
                        <strong>Transports :</strong> Location de scooter ou
                        abonnement transports en commun.
                      </li>
                      <li>
                        <strong>Loisirs :</strong> Sorties, café, sport et
                        visites culturelles.
                      </li>
                    </ul>
                    <h3>Comment l'inflation affecte votre voyage ?</h3>
                    <p>
                      En 2025, des destinations autrefois "bon marché" comme
                      Mexico City ou Lisbonne ont vu leurs prix augmenter. À
                      l'inverse, le Japon (avec la baisse du Yen) et l'Argentine
                      offrent un pouvoir d'achat exceptionnel pour les
                      détenteurs d'Euros ou de Dollars.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-8">
                <div className="bg-neutral-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
                  <h3 className="font-bold text-xl mb-6 relative z-10 flex items-center gap-2">
                    Questions Fréquentes
                  </h3>
                  <div className="space-y-6 relative z-10">
                    <div>
                      <h4 className="font-bold text-sm text-blue-300 mb-2 flex items-center gap-2">
                        <Globe size={14} /> Le Japon est-il cher ?
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Moins qu'avant ! Tokyo est devenue plus abordable que
                        Paris. Comptez ~2600€/mois pour bien vivre.
                      </p>
                    </div>
                    <div className="w-full h-px bg-white/10" />
                    <div>
                      <h4 className="font-bold text-sm text-blue-300 mb-2 flex items-center gap-2">
                        <Sun size={14} /> Où aller au soleil l'hiver ?
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Tenerife (Europe), Le Cap (Afrique) ou la Thaïlande sont
                        les meilleures options qualité/prix.
                      </p>
                    </div>
                    <div className="w-full h-px bg-white/10" />
                    <div>
                      <h4 className="font-bold text-sm text-blue-300 mb-2 flex items-center gap-2">
                        <MapPin size={14} /> Sécurité en Amérique Latine ?
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Buenos Aires et certains quartiers de Mexico City (Roma)
                        sont très sûrs pour les touristes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-24 pt-12 border-t border-neutral-200">
              <h2 className="text-2xl font-bold text-center mb-12">
                Explorer nos guides détaillés
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {featuredCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/destinations/${city.slug}`}
                    className="group block text-center"
                  >
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all duration-300">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    </div>
                    <span className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                      {city.name}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/destinations"
                  className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Voir toutes les destinations{" "}
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
