"use client";

import React, { useState, useMemo } from "react";
import {
  Globe,
  Wallet,
  Wifi,
  MapPin,
  Search,
  Calendar,
  TrendingUp,
  Plane,
  Star,
  Sun,
  Coffee,
  Umbrella,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { motion, AnimatePresence } from "framer-motion";

// --- DATASET MASSIF (40 VILLES - TRAFIC MAXIMAL) ---
const CITIES = [
  // ASIE
  {
    name: "Bali (Canggu)",
    country: "Indonésie",
    baseCost: 1600,
    internet: 40,
    vibe: "Surf & Yoga",
    region: "Asie",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  },
  {
    name: "Bangkok",
    country: "Thaïlande",
    baseCost: 1400,
    internet: 90,
    vibe: "Urbain Chaos",
    region: "Asie",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
  },
  {
    name: "Chiang Mai",
    country: "Thaïlande",
    baseCost: 1000,
    internet: 60,
    vibe: "Chill",
    region: "Asie",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/metalya-bharath-mohan-2CjOnwJCMJM-unsplash.webp",
  },
  {
    name: "Tokyo",
    country: "Japon",
    baseCost: 2800,
    internet: 160,
    vibe: "Futuriste",
    region: "Asie",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
  },
  {
    name: "Séoul",
    country: "Corée du Sud",
    baseCost: 2400,
    internet: 190,
    vibe: "K-Pop Tech",
    region: "Asie",
    image:
      "https://images.unsplash.com/photo-1578637387939-43c525550085?w=800&q=80",
  },
  {
    name: "Singapour",
    country: "Singapour",
    baseCost: 4500,
    internet: 250,
    vibe: "Luxe",
    region: "Asie",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
  },
  {
    name: "Da Nang",
    country: "Vietnam",
    baseCost: 950,
    internet: 55,
    vibe: "Plage",
    region: "Asie",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
  },
  {
    name: "Ho Chi Minh",
    country: "Vietnam",
    baseCost: 1100,
    internet: 65,
    vibe: "Active",
    region: "Asie",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
  },
  {
    name: "Kuala Lumpur",
    country: "Malaisie",
    baseCost: 1300,
    internet: 100,
    vibe: "Moderne",
    region: "Asie",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/metalya-meric-dagli-HxJvFZGfSHM-unsplash.webp",
  },
  {
    name: "Taipei",
    country: "Taïwan",
    baseCost: 2100,
    internet: 130,
    vibe: "Foodie",
    region: "Asie",
    image:
      "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&q=80",
  },

  // EUROPE
  {
    name: "Lisbonne",
    country: "Portugal",
    baseCost: 2300,
    internet: 100,
    vibe: "Soleil",
    region: "Europe",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/metalya-aayush-gupta-ljhCEaHYWJ8-unsplash.webp",
  },
  {
    name: "Porto",
    country: "Portugal",
    baseCost: 1900,
    internet: 90,
    vibe: "Vin & Arts",
    region: "Europe",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/metalya-nick-karvounis-Prb-sjOUBFs-unsplash.webp",
  },
  {
    name: "Barcelone",
    country: "Espagne",
    baseCost: 2600,
    internet: 110,
    vibe: "Fête",
    region: "Europe",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
  },
  {
    name: "Tenerife",
    country: "Espagne",
    baseCost: 1700,
    internet: 80,
    vibe: "Île",
    region: "Europe",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/metalya-maria-lupan-OkuM6V9m9l0-unsplash.webp",
  },
  {
    name: "Berlin",
    country: "Allemagne",
    baseCost: 2800,
    internet: 80,
    vibe: "Underground",
    region: "Europe",
    image:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80",
  },
  {
    name: "Londres",
    country: "UK",
    baseCost: 4800,
    internet: 120,
    vibe: "Business",
    region: "Europe",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  },
  {
    name: "Paris",
    country: "France",
    baseCost: 4000,
    internet: 130,
    vibe: "Romantique",
    region: "Europe",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
  },
  {
    name: "Budapest",
    country: "Hongrie",
    baseCost: 1600,
    internet: 110,
    vibe: "Histoire",
    region: "Europe",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/metalya-ervin-lukacs-sMyQb3i9bNA-unsplash.webp",
  },
  {
    name: "Tallinn",
    country: "Estonie",
    baseCost: 2000,
    internet: 150,
    vibe: "E-Society",
    region: "Europe",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/metalya-ilya-orehov-2OSEWkQHiGI-unsplash.webp",
  },
  {
    name: "Istanbul",
    country: "Turquie",
    baseCost: 1400,
    internet: 40,
    vibe: "Culture",
    region: "Europe",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
  },

  // AMÉRIQUES
  {
    name: "New York",
    country: "USA",
    baseCost: 6800,
    internet: 160,
    vibe: "Business",
    region: "Amériques",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/metalya-michael-discenza-5omwAMDxmkU-unsplash.webp",
  },
  {
    name: "Miami",
    country: "USA",
    baseCost: 5500,
    internet: 150,
    vibe: "Plage",
    region: "Amériques",
    image:
      "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&q=80",
  },
  {
    name: "Austin",
    country: "USA",
    baseCost: 4500,
    internet: 140,
    vibe: "Tech",
    region: "Amériques",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/metalya-carlos-delgado-HCcmfL-l08I-unsplash.webp",
  },
  {
    name: "Medellín",
    country: "Colombie",
    baseCost: 1200,
    internet: 50,
    vibe: "Printemps",
    region: "Amériques",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/metalya-joel-duncan-Iqa-WlbNjqs-unsplash.webp",
  },
  {
    name: "Mexico City",
    country: "Mexique",
    baseCost: 1800,
    internet: 60,
    vibe: "Culture",
    region: "Amériques",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/metalya-oscar-reygo-HPrWl25FYcw-unsplash.webp",
  },
  {
    name: "Playa del Carmen",
    country: "Mexique",
    baseCost: 2000,
    internet: 70,
    vibe: "Caraïbes",
    region: "Amériques",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/metalya-jorge-fernandez-salas-OJKNcjoBbjM-unsplash.webp",
  },
  {
    name: "Buenos Aires",
    country: "Argentine",
    baseCost: 1000,
    internet: 50,
    vibe: "Tango",
    region: "Amériques",
    image:
      "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80",
  },
  {
    name: "Rio de Janeiro",
    country: "Brésil",
    baseCost: 1900,
    internet: 80,
    vibe: "Samba",
    region: "Amériques",
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
  },
  {
    name: "Toronto",
    country: "Canada",
    baseCost: 4200,
    internet: 140,
    vibe: "Urbain",
    region: "Amériques",
    image:
      "https://images.unsplash.com/photo-1507090960745-b32f65d3113a?w=800&q=80",
  },

  // AFRIQUE & MOYEN ORIENT & OCÉANIE
  {
    name: "Dubaï",
    country: "Émirats",
    baseCost: 3500,
    internet: 200,
    vibe: "Futur",
    region: "Moyen-Orient",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/metalya-darcey-beau-q8D7WZc40eA-unsplash.webp",
  },
  {
    name: "Le Cap",
    country: "Afrique du Sud",
    baseCost: 1800,
    internet: 60,
    vibe: "Nature",
    region: "Afrique",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
  },
  {
    name: "Marrakech",
    country: "Maroc",
    baseCost: 1300,
    internet: 40,
    vibe: "Authentique",
    region: "Afrique",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/metalya-oussama-sabri-m3bCfGum88U-unsplash.webp",
  },
  {
    name: "Sydney",
    country: "Australie",
    baseCost: 4800,
    internet: 100,
    vibe: "Surf",
    region: "Océanie",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
  },
  {
    name: "Melbourne",
    country: "Australie",
    baseCost: 4200,
    internet: 95,
    vibe: "Art",
    region: "Océanie",
    image:
      "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800&q=80",
  },
];

export function NomadPlanner() {
  const [budget, setBudget] = useState<number>(2500);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("Tous");

  // Inflation dynamique (ajuste les prix chaque année automatiquement)
  const currentYear = new Date().getFullYear();
  const inflationFactor = Math.pow(1.035, currentYear - 2024); // 3.5% d'inflation annuelle estimée

  const processedCities = useMemo(() => {
    return CITIES.map((city) => ({
      ...city,
      currentCost: Math.round(city.baseCost * inflationFactor),
    }))
      .filter((city) => {
        const matchesSearch =
          city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.country.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion =
          regionFilter === "Tous" || city.region === regionFilter;
        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        // Tri intelligent : D'abord ceux qui rentrent dans le budget, puis par qualité internet
        const daysA = Math.floor((budget / a.currentCost) * 30);
        const daysB = Math.floor((budget / b.currentCost) * 30);

        // Si les deux sont abordables (30+ jours), on trie par "Qualité de vie supposée" (Internet)
        if (daysA >= 30 && daysB >= 30) {
          return b.internet - a.internet;
        }
        return daysB - daysA;
      });
  }, [budget, searchTerm, regionFilter, inflationFactor]);

  // Extraction unique des régions pour le filtre
  const regions = ["Tous", ...Array.from(new Set(CITIES.map((c) => c.region)))];

  const getDaysAffordable = (monthlyCost: number) => {
    const days = Math.floor((budget / monthlyCost) * 30);
    return days > 365 ? "365+" : days;
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* HERO SECTION */}
      <div className="relative pt-12 pb-24 text-center px-4">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-widest text-blue-700 mb-8 shadow-sm">
            <Globe size={14} className="text-blue-600" />
            Top 40 Destinations • Édition {currentYear}
          </div>

          <h1 className="font-serif text-5xl md:text-8xl font-bold tracking-tighter mb-6 text-neutral-900">
            Nomad{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Métriques
            </span>
          </h1>

          <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            L'outil ultime pour planifier votre expatriation ou tour du monde.
            <br className="hidden md:block" />
            Calculez votre pouvoir d'achat dans les 40 villes les plus
            demandées.
          </p>
        </FadeIn>
      </div>

      {/* STICKY CONTROL PANEL */}
      <div className="sticky top-20 z-40 px-4 mb-12">
        <FadeIn delay={0.2}>
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl border border-neutral-200 shadow-2xl rounded-3xl p-6 md:p-8 ring-1 ring-black/5 transition-all hover:bg-white">
            <div className="flex flex-col gap-6">
              {/* Budget Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                    <Wallet size={18} className="text-blue-600" /> Votre Budget
                    / Mois
                  </label>
                  <div className="text-right">
                    <span className="text-4xl font-bold text-neutral-900 font-serif tabular-nums tracking-tight">
                      {budget} €
                    </span>
                  </div>
                </div>

                <div className="relative h-6 flex items-center">
                  <div className="absolute w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                      style={{ width: `${(budget / 10000) * 100}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="50"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                    className="absolute w-full h-6 opacity-0 cursor-pointer"
                  />
                  <div
                    className="absolute h-6 w-6 bg-white border-2 border-blue-600 rounded-full shadow-lg pointer-events-none transition-all"
                    style={{ left: `calc(${(budget / 10000) * 100}% - 12px)` }}
                  />
                </div>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-neutral-100">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Chercher (ex: Bali, Japon, Plage...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-neutral-400"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar mask-gradient-right">
                  {regions.map((region) => (
                    <button
                      key={region}
                      onClick={() => setRegionFilter(region)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
                        regionFilter === region
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* RESULTS GRID */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {processedCities.map((city, index) => {
              const days = Math.floor((budget / city.currentCost) * 30);
              const isAffordable = days >= 30;

              return (
                <motion.article // Sémantique importante pour le SEO
                  layout
                  key={city.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    delay: index > 6 ? 0 : index * 0.05,
                  }} // Optimisation perf: animation seulement sur les premiers
                  className={`group relative flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                    !isAffordable
                      ? "opacity-80 grayscale-[0.3] hover:opacity-100 hover:grayscale-0"
                      : ""
                  }`}
                >
                  {/* Image Cover */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                    <img
                      src={city.image}
                      alt={`Budget voyage et coût de la vie à ${city.name}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Vibe Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                        {city.vibe === "Plage" && <Sun size={10} />}
                        {city.vibe === "Urbain" && <Coffee size={10} />}
                        {city.vibe}
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-6 z-20">
                      <h3 className="font-serif text-3xl font-bold text-white leading-none mb-1">
                        {city.name}
                      </h3>
                      <p className="text-sm text-neutral-300 font-medium flex items-center gap-1">
                        <MapPin size={12} /> {city.country}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Metrics Row */}
                    <div className="flex gap-4 mb-6 text-sm">
                      <div className="flex-1 flex flex-col">
                        <span className="text-neutral-400 text-xs font-bold uppercase mb-1">
                          Coût / Mois
                        </span>
                        <span className="font-bold text-neutral-900 text-lg">
                          {city.currentCost} €
                        </span>
                      </div>
                      <div className="w-px bg-neutral-100" />
                      <div className="flex-1 flex flex-col">
                        <span className="text-neutral-400 text-xs font-bold uppercase mb-1">
                          Internet
                        </span>
                        <span className="font-bold text-neutral-900 text-lg flex items-center gap-1">
                          <Wifi size={14} className="text-emerald-500" />{" "}
                          {city.internet}{" "}
                          <span className="text-xs text-neutral-400">Mb</span>
                        </span>
                      </div>
                    </div>

                    {/* THE RESULT BAR */}
                    <div
                      className={`mt-auto rounded-2xl p-4 border transition-colors ${
                        isAffordable
                          ? "bg-blue-50 border-blue-100"
                          : "bg-orange-50 border-orange-100"
                      }`}
                    >
                      <div className="flex justify-between items-end mb-3">
                        <span
                          className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
                            isAffordable ? "text-blue-600" : "text-orange-600"
                          }`}
                        >
                          <Plane size={14} /> Séjour Possible
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              isAffordable ? "bg-blue-500" : "bg-orange-500"
                            }`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(100, (days / 30) * 100)}%`,
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <div className="text-right min-w-[80px]">
                          <span
                            className={`text-2xl font-bold font-serif ${
                              isAffordable ? "text-blue-700" : "text-orange-600"
                            }`}
                          >
                            {getDaysAffordable(city.currentCost)}
                          </span>
                          <span
                            className={`text-xs font-bold ml-1 ${
                              isAffordable ? "text-blue-400" : "text-orange-400"
                            }`}
                          >
                            Jours
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER EXPLAINER */}
      <FadeIn delay={0.6}>
        <div className="max-w-3xl mx-auto mt-32 text-center px-6">
          <div className="inline-block p-4 rounded-full bg-neutral-50 mb-6 border border-neutral-100">
            <TrendingUp className="w-6 h-6 text-neutral-400" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-4">
            Données en Temps Réel
          </h2>
          <p className="text-neutral-500 leading-relaxed text-sm">
            Les prix affichés incluent un loyer (studio/hôtel), la nourriture et
            les transports pour une personne. Ils sont ajustés automatiquement
            avec un taux d'inflation prédictif pour l'année {currentYear}.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
