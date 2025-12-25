import { Metadata } from "next";
import { DESTINATIONS, getInflationCost } from "@/lib/destinations-data";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Wallet,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Plane,
  Camera,
  Coffee,
  ArrowRight,
  Info,
} from "lucide-react";
import { CityDashboard } from "@/components/tools/city-dashboard";

// --- UTILS ---

function getCity(slug: string) {
  return DESTINATIONS.find((city) => city.slug === slug);
}

function getSimilarCities(currentCity: (typeof DESTINATIONS)[0]) {
  return DESTINATIONS.filter(
    (c) =>
      (c.region === currentCity.region || c.vibe === currentCity.vibe) &&
      c.slug !== currentCity.slug
  )
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
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
    title: `Visiter ${city.name} : Guide Voyage, Budget & Avis ${year}`,
    description: `Préparez votre voyage à ${city.name}, ${city.country}. Budget estimé (${realCost}€), meilleure période, sécurité et incontournables. Le guide complet ${year}.`,
    keywords: [
      `visiter ${city.name}`,
      `voyage ${city.country}`,
      `budget voyage ${city.name}`,
      `que faire à ${city.name}`,
      `vivre à ${city.name}`,
      `cout vie ${city.name} ${year}`,
    ],
    openGraph: {
      title: `Guide Ultime : Visiter ${city.name} en ${year}`,
      description: `Tout savoir sur ${city.name} : Budget, Météo, Sécurité et Bons plans.`,
      images: [{ url: city.image }],
      type: "article",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: city.name,
    description: city.description,
    image: city.image,
    touristType: ["Traveler", "Digital Nomad", "Expat"],
    address: { "@type": "PostalAddress", addressCountry: city.country },
    geo: {
      "@type": "GeoCoordinates",
      name: city.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-neutral-50 pb-20">
        <header className="relative h-[75vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-transparent to-transparent z-20" />

          <Image
            src={city.image}
            alt={`Paysage de ${city.name}, ${city.country}`}
            fill
            className="object-cover"
            priority
            quality={95}
          />

          <Container className="relative z-30 h-full flex flex-col justify-end pb-32">
            <FadeIn>
              <nav className="flex items-center gap-2 text-white/80 text-sm font-medium mb-8 uppercase tracking-widest">
                <Link href="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
                <span>/</span>
                <Link
                  href="/destinations"
                  className="hover:text-white transition-colors"
                >
                  Destinations
                </Link>
                <span>/</span>
                <span className="text-white">{city.country}</span>
              </nav>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2">
                  <MapPin size={14} /> {city.region}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-emerald-500/80 backdrop-blur-md text-white border border-white/10 text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2">
                  <Camera size={14} /> {city.vibe}
                </span>
                {city.badge && (
                  <span className="px-4 py-1.5 rounded-full bg-yellow-500/90 text-black border border-yellow-400 text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2">
                    ★ {city.badge}
                  </span>
                )}
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

        <Container className="relative z-40 -mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            <div className="lg:col-span-8 space-y-12">
              <FadeIn delay={0.2}>
                <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-neutral-100/50">
                  <div className="flex items-center gap-3 mb-8 border-b border-neutral-100 pb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <h2 className="font-bold text-2xl text-neutral-900">
                        Données de Voyage {year}
                      </h2>
                      <p className="text-sm text-neutral-500">
                        Estimations en temps réel pour {city.name}
                      </p>
                    </div>
                  </div>
                  <CityDashboard city={city} />
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <article className="prose prose-neutral prose-lg max-w-none">
                  <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-neutral-100 shadow-sm">
                    <h3 className="font-serif text-3xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                      <Plane className="text-blue-500" />
                      Pourquoi visiter {city.name} ?
                    </h3>
                    <p className="lead text-neutral-600">
                      {city.name} s'impose en {year} comme une destination
                      incontournable. Que vous veniez pour des vacances, du
                      télétravail ou une expatriation, la ville offre un mélange
                      unique de culture, de confort et d'aventure.
                    </p>

                    <div className="my-12 p-8 bg-neutral-50 rounded-3xl border border-neutral-200">
                      <h4 className="flex items-center gap-2 font-bold text-xl text-neutral-900 mb-4 not-prose">
                        <Wallet className="text-emerald-600" size={24} />
                        Analyse du Budget sur Place
                      </h4>
                      <p className="text-base text-neutral-600 mb-6">
                        Le coût de la vie est souvent le facteur décisif. À{" "}
                        {city.name}, le budget moyen est de{" "}
                        <strong>{realCost}€ / mois</strong> pour une personne
                        vivant confortablement.
                      </p>
                      <div className="grid md:grid-cols-2 gap-6 not-prose">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <span className="text-xs font-bold text-neutral-400 uppercase">
                            Logement (Centre)
                          </span>
                          <p className="text-lg font-bold text-neutral-800">
                            ~{Math.round(realCost * 0.45)}€
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <span className="text-xs font-bold text-neutral-400 uppercase">
                            Nourriture & Sorties
                          </span>
                          <p className="text-lg font-bold text-neutral-800">
                            ~{Math.round(realCost * 0.35)}€
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-neutral-900 mt-10 mb-4 flex items-center gap-3">
                      <Calendar className="text-orange-500" />
                      Meilleure période pour partir
                    </h3>
                    <p>
                      Le climat à <strong>{city.name}</strong> est un atout
                      majeur avec une température moyenne de{" "}
                      <strong>{city.temp}°C</strong>.
                      {(city as any).bestMonth ? (
                        <>
                          {" "}
                          Le mois idéal pour visiter est souvent{" "}
                          <strong>{(city as any).bestMonth}</strong>, offrant le
                          meilleur équilibre entre météo clémente et
                          fréquentation touristique.
                        </>
                      ) : (
                        <>
                          {" "}
                          Vérifiez les saisons avant de réserver pour profiter
                          pleinement des activités en extérieur.
                        </>
                      )}
                    </p>

                    <h3 className="font-serif text-2xl font-bold text-neutral-900 mt-10 mb-4 flex items-center gap-3">
                      <Coffee className="text-brown-500" />
                      Vie locale & Connectivité
                    </h3>
                    <p>
                      Pour ceux qui ont besoin de rester connectés (Instagram,
                      Télétravail, Streaming), {city.name} offre une vitesse
                      moyenne de <strong>{city.internet} Mbps</strong>.
                      {city.internet > 50
                        ? " C'est excellent, vous pourrez envoyer vos vidéos et travailler sans aucune latence."
                        : " C'est correct pour la navigation basique, mais attendez-vous à quelques ralentissements sur les gros fichiers."}
                    </p>
                  </div>
                </article>
              </FadeIn>
            </div>

            <aside className="lg:col-span-4 space-y-8">
              <div className="sticky top-24 space-y-8">
                <FadeIn delay={0.3}>
                  <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <h3 className="font-bold text-xl mb-6 relative z-10 flex items-center gap-2">
                      <Info size={20} className="text-blue-500" /> L'avis
                      express
                    </h3>

                    <div className="space-y-6 relative z-10">
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-700 uppercase tracking-wider mb-3">
                          <ThumbsUp size={16} /> On adore
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
                          ))}
                        </ul>
                      </div>

                      <div className="w-full h-px bg-neutral-100" />

                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-rose-700 uppercase tracking-wider mb-3">
                          <ThumbsDown size={16} /> À savoir
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
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.5}>
                  <div className="bg-neutral-900 text-white rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Plane
                      size={48}
                      className="mx-auto mb-4 text-blue-400 group-hover:-translate-y-2 transition-transform duration-500"
                    />
                    <h3 className="text-xl font-bold mb-2">
                      Envie de partir ?
                    </h3>
                    <p className="text-white/60 text-sm mb-6">
                      Trouvez les meilleurs vols et hébergements pour{" "}
                      {city.name}.
                    </p>
                    <button className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-blue-50 transition-colors">
                      Voir les disponibilités
                    </button>
                  </div>
                </FadeIn>
              </div>
            </aside>
          </div>

          {similarCities.length > 0 && (
            <div className="mt-32 pt-16 border-t border-neutral-200">
              <FadeIn>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-serif font-bold mb-4">
                    D'autres voyages en {city.region}
                  </h2>
                  <p className="text-neutral-500 max-w-2xl mx-auto">
                    Vous hésitez encore ? Ces destinations offrent une ambiance
                    similaire ou sont géographiquement proches.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {similarCities.map((simCity) => (
                    <Link
                      key={simCity.slug}
                      href={`/destinations/${simCity.slug}`}
                      className="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100"
                    >
                      <div className="relative h-56 w-full overflow-hidden">
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
                          <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg text-sm">
                            {getInflationCost(simCity.baseCost)}€
                          </span>
                        </div>
                        <p className="text-neutral-500 text-sm line-clamp-2 mb-4">
                          {simCity.description}
                        </p>
                        <div className="flex items-center justify-end text-blue-600 text-sm font-bold group-hover:gap-2 transition-all">
                          Découvrir <ArrowRight size={16} className="ml-1" />
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
