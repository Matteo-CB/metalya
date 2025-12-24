import { Metadata } from "next";
import { DESTINATIONS, getInflationCost } from "@/lib/destinations-data";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Wifi,
  Sun,
  Wallet,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Globe,
  Thermometer,
  ArrowRight,
} from "lucide-react";
import { CityDashboard } from "@/components/tools/city-dashboard";

// --- UTILS ---

function getCity(slug: string) {
  return DESTINATIONS.find((city) => city.slug === slug);
}

// Récupère 3 villes de la même région pour le maillage interne
function getSimilarCities(currentCity: (typeof DESTINATIONS)[0]) {
  return DESTINATIONS.filter(
    (c) => c.region === currentCity.region && c.slug !== currentCity.slug
  ).slice(0, 3);
}

// --- CONFIG ---

export async function generateStaticParams() {
  return DESTINATIONS.map((city) => ({
    slug: city.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const city = getCity(resolvedParams.slug);

  if (!city) return {};

  const year = new Date().getFullYear();
  const realCost = getInflationCost(city.baseCost);

  return {
    title: `Vivre à ${city.name} en ${year} : Budget, Avis & Guide Nomad`,
    description: `Guide complet pour ${city.name}. Budget mensuel : ${realCost}€. Vitesse internet, quartiers, avantages et inconvénients pour les digital nomads.`,
    keywords: [
      `budget ${city.name} ${year}`,
      `avis vivre ${city.name}`,
      `digital nomad ${city.country}`,
      `cout vie ${city.name}`,
    ],
    openGraph: {
      title: `Vivre à ${city.name} : Le Guide Ultime ${year}`,
      description: `Tout savoir sur ${city.name} : Budget (${realCost}€), Internet, Météo et Qualité de vie.`,
      images: [{ url: city.image }],
    },
  };
}

// --- PAGE COMPONENT ---

export default async function CityPage({ params }: Props) {
  const resolvedParams = await params;
  const city = getCity(resolvedParams.slug);

  if (!city) notFound();

  const year = new Date().getFullYear();
  const realCost = getInflationCost(city.baseCost);
  const similarCities = getSimilarCities(city);

  // JSON-LD (Données structurées)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: "https://metalya.fr",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Destinations",
            item: "https://metalya.fr/destinations",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: city.name,
            item: `https://metalya.fr/destinations/${city.slug}`,
          },
        ],
      },
      {
        "@type": "TouristDestination",
        name: city.name,
        description: city.description,
        image: city.image,
        touristType: ["Digital Nomad"],
        address: { "@type": "PostalAddress", addressCountry: city.country },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-neutral-50 pb-20">
        {/* --- HERO HEADER --- */}
        <header className="relative h-[70vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-transparent to-transparent z-20" />

          <Image
            src={city.image}
            alt={`Vue panoramique de ${city.name}`}
            fill
            className="object-cover"
            priority
            quality={90}
          />

          {/* AJUSTEMENT ICI : pb-32 (au lieu de 16) pour remonter le texte */}
          <Container className="relative z-30 h-full flex flex-col justify-end pb-32">
            <FadeIn>
              <Link
                href="/destinations"
                className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors font-medium text-sm uppercase tracking-widest"
              >
                <ArrowLeft size={16} className="mr-2" /> Explorer d'autres
                villes
              </Link>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-bold uppercase tracking-wider shadow-sm">
                  {city.region}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-emerald-500/80 backdrop-blur-md text-white border border-white/10 text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2">
                  <Globe size={12} />
                  {city.vibe}
                </span>
              </div>

              <h1 className="font-serif text-6xl md:text-8xl font-bold text-white mb-6 shadow-sm leading-none tracking-tight">
                {city.name}
              </h1>

              <p className="text-xl md:text-2xl text-white/95 max-w-3xl font-light leading-relaxed drop-shadow-md">
                {city.description}
              </p>
            </FadeIn>
          </Container>
        </header>

        {/* AJUSTEMENT ICI : -mt-12 (au lieu de -mt-20) pour baisser la carte */}
        <Container className="relative z-40 -mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            {/* --- LEFT COLUMN: CONTENT (8 cols) --- */}
            <div className="lg:col-span-8 space-y-12">
              {/* DASHBOARD CARD */}
              <FadeIn delay={0.2}>
                <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-neutral-100/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-8 border-b border-neutral-100 pb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <h2 className="font-bold text-2xl text-neutral-900">
                        Indicateurs de Vie {year}
                      </h2>
                      <p className="text-sm text-neutral-500">
                        Données estimées en temps réel
                      </p>
                    </div>
                  </div>
                  <CityDashboard city={city} />
                </div>
              </FadeIn>

              {/* SEO ARTICLE */}
              <FadeIn delay={0.4}>
                <article className="prose prose-neutral prose-lg max-w-none">
                  <div className="bg-white p-10 rounded-[2rem] border border-neutral-100 shadow-sm">
                    <h3 className="font-serif text-3xl font-bold text-neutral-900 mb-6">
                      Comprendre le budget à {city.name}
                    </h3>
                    <p className="lead text-neutral-600">
                      {city.name} s'impose en {year} comme une destination de
                      choix. Avec un budget mensuel estimé à{" "}
                      <strong>
                        {realCost}€ ({city.currency})
                      </strong>
                      , elle offre un rapport qualité/prix{" "}
                      {realCost < 1500
                        ? "exceptionnel"
                        : "cohérent avec ses infrastructures"}
                      .
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 my-8 not-prose">
                      <div className="bg-neutral-50 p-6 rounded-2xl">
                        <h4 className="flex items-center gap-2 font-bold text-neutral-900 mb-3">
                          <Wallet className="text-emerald-500" size={20} />{" "}
                          Logement
                        </h4>
                        <p className="text-sm text-neutral-600">
                          Le poste principal. Comptez environ{" "}
                          <strong>{Math.round(realCost * 0.4)}€</strong> pour un
                          logement privé confortable en centre-ville ou proche
                          des spots d'intérêt.
                        </p>
                      </div>
                      <div className="bg-neutral-50 p-6 rounded-2xl">
                        <h4 className="flex items-center gap-2 font-bold text-neutral-900 mb-3">
                          <Sun className="text-orange-500" size={20} />{" "}
                          Quotidien
                        </h4>
                        <p className="text-sm text-neutral-600">
                          Pour la nourriture et les loisirs,{" "}
                          <strong>{Math.round(realCost * 0.35)}€</strong>{" "}
                          suffisent généralement pour profiter sans se priver
                          (restaurants locaux, coworking).
                        </p>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-neutral-900 mt-10 mb-4">
                      Qualité de la connexion Internet
                    </h3>
                    <p>
                      C'est le critère n°1 des travailleurs distants. À{" "}
                      {city.name}, la vitesse moyenne est de
                      <strong> {city.internet} Mbps</strong>.
                      {city.internet > 50
                        ? " C'est excellent pour tout type d'activité, y compris les appels vidéo HD et le transfert de fichiers lourds."
                        : " C'est suffisant pour le travail classique, mais attention aux uploads vidéo lourds."}
                    </p>

                    <h3 className="font-serif text-2xl font-bold text-neutral-900 mt-10 mb-4">
                      Climat et Météo
                    </h3>
                    <p>
                      Avec une température moyenne de{" "}
                      <strong>{city.temp}°C</strong>, le climat est un atout
                      majeur. Pensez à vérifier la saison des pluies si vous
                      prévoyez un long séjour.
                    </p>
                  </div>
                </article>
              </FadeIn>
            </div>

            {/* --- RIGHT COLUMN: SIDEBAR (4 cols) --- */}
            <aside className="lg:col-span-4 space-y-8">
              {/* PROS & CONS CARD */}
              <div className="block lg:sticky top-24 space-y-8">
                <FadeIn delay={0.3}>
                  <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <h3 className="font-bold text-xl mb-6 relative z-10">
                      L'avis Metalya
                    </h3>

                    <div className="space-y-6 relative z-10">
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-700 uppercase tracking-wider mb-3">
                          <ThumbsUp size={16} /> Les Points Forts
                        </h4>
                        <ul className="space-y-3">
                          {city.pros?.map((pro, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-sm text-neutral-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50"
                            >
                              <div className="min-w-[6px] h-[6px] rounded-full bg-emerald-500 mt-1.5" />
                              {pro}
                            </li>
                          )) || (
                            <li className="text-sm text-neutral-400 italic">
                              Données en cours de collecte
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="w-full h-px bg-neutral-100" />

                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-rose-700 uppercase tracking-wider mb-3">
                          <ThumbsDown size={16} /> Attention à
                        </h4>
                        <ul className="space-y-3">
                          {city.cons?.map((con, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-sm text-neutral-600 bg-rose-50/50 p-3 rounded-xl border border-rose-100/50"
                            >
                              <div className="min-w-[6px] h-[6px] rounded-full bg-rose-500 mt-1.5" />
                              {con}
                            </li>
                          )) || (
                            <li className="text-sm text-neutral-400 italic">
                              Données en cours de collecte
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                {/* SUMMARY BADGE */}
                <FadeIn delay={0.5}>
                  <div className="bg-neutral-900 text-white rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Globe size={48} className="mx-auto mb-4 text-blue-400" />
                    <h3 className="text-xl font-bold mb-2">Prêt à partir ?</h3>
                    <p className="text-white/60 text-sm mb-6">
                      {city.name} vous attend. Préparez votre départ
                      sereinement.
                    </p>
                    <div className="inline-flex items-center justify-center w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-xs font-mono">
                      📍 {city.region} • {city.currency}
                    </div>
                  </div>
                </FadeIn>
              </div>
            </aside>
          </div>

          {/* --- BOTTOM: SIMILAR CITIES (INTERNAL LINKING) --- */}
          {similarCities.length > 0 && (
            <div className="mt-32 pt-16 border-t border-neutral-200">
              <FadeIn>
                <h2 className="text-3xl font-serif font-bold mb-12 text-center">
                  D'autres destinations en {city.region}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {similarCities.map((simCity) => (
                    <Link
                      key={simCity.slug}
                      href={`/destinations/${simCity.slug}`}
                      className="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100"
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={simCity.image}
                          alt={simCity.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          {simCity.vibe}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-xl text-neutral-900">
                            {simCity.name}
                          </h3>
                          <span className="text-emerald-600 font-bold">
                            {getInflationCost(simCity.baseCost)}€
                          </span>
                        </div>
                        <div className="flex items-center text-neutral-500 text-sm gap-4 mt-4">
                          <div className="flex items-center gap-1">
                            <Wifi size={14} /> {simCity.internet} Mb
                          </div>
                          <div className="flex items-center gap-1">
                            <Thermometer size={14} /> {simCity.temp}°C
                          </div>
                        </div>
                        <div className="mt-6 flex items-center text-blue-600 text-sm font-bold group-hover:gap-2 transition-all">
                          Voir le guide{" "}
                          <ArrowRight size={16} className="ml-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </FadeIn>
            </div>
          )}
        </Container>
      </main>
    </>
  );
}
