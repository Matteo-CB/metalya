"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { DESTINATIONS, getInflationCost } from "@/lib/destinations-data";
import { ArrowRight, MapPin, Wifi, Sun, Globe, TrendingUp } from "lucide-react";
import Image from "next/image";

export function DestinationsSection() {
  // On prend les 4 premières destinations pour la vitrine
  const featuredDestinations = DESTINATIONS.slice(0, 4);

  return (
    <section className="py-32 bg-neutral-50 overflow-hidden relative">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <Container className="relative z-10">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-4">
                <Globe size={16} />
                <span>Digital Nomad Hubs</span>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
                Trouvez votre <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                  Prochain Bureau
                </span>
              </h2>
              <p className="text-xl text-neutral-600 leading-relaxed max-w-lg">
                Une sélection curée des 40 meilleures villes au monde pour
                vivre, travailler et explorer en 2025. Données en temps réel.
              </p>
            </div>
            <Link
              href="/destinations"
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-neutral-900 text-white font-medium transition-all hover:bg-neutral-800 hover:shadow-2xl hover:-translate-y-1 whitespace-nowrap"
            >
              Explorer la carte
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDestinations.map((city, index) => (
            <FadeIn key={city.slug} delay={index * 0.1}>
              <Link
                href={`/destinations/${city.slug}`}
                className="group block relative h-[500px] w-full overflow-hidden rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-neutral-200"
              >
                {/* Image de fond */}
                <div className="absolute inset-0 bg-neutral-900">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                </div>

                {/* Badges Supérieurs */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    {city.region}
                  </span>
                  {city.badge && (
                    <span className="px-3 py-1.5 bg-blue-500/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg border border-white/10">
                      {city.badge}
                    </span>
                  )}
                </div>

                {/* Contenu Inférieur Animé */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  {/* Vibe Label (Apparition au survol) */}
                  <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-y-2 group-hover:translate-y-0">
                    <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp size={14} />
                      {city.vibe}
                    </span>
                  </div>

                  <h3 className="font-serif text-4xl font-bold text-white mb-2 leading-none">
                    {city.name}
                  </h3>

                  <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-6">
                    <MapPin size={16} /> {city.country}
                  </div>

                  {/* Grille de Métriques (Apparition au survol) */}
                  <div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    {/* Budget */}
                    <div className="text-center">
                      <div className="text-[10px] text-white/60 uppercase font-bold tracking-wider mb-1">
                        Budget
                      </div>
                      <div className="text-white font-bold text-lg">
                        {getInflationCost(city.baseCost)}€
                      </div>
                    </div>

                    {/* Internet */}
                    <div className="text-center border-l border-white/10">
                      <div className="text-[10px] text-white/60 uppercase font-bold tracking-wider mb-1">
                        Wifi
                      </div>
                      <div className="text-white font-bold text-lg flex items-center justify-center gap-1">
                        {city.internet}
                        <span className="text-xs text-white/60">Mb</span>
                      </div>
                    </div>

                    {/* Météo */}
                    <div className="text-center border-l border-white/10">
                      <div className="text-[10px] text-white/60 uppercase font-bold tracking-wider mb-1">
                        Météo
                      </div>
                      <div className="text-white font-bold text-lg flex items-center justify-center gap-1">
                        <Sun size={14} className="text-orange-400" />
                        {city.temp}°
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-500 text-sm">
            Données croisées avec NomadList, Numbeo et les retours de la
            communauté.
          </p>
        </div>
      </Container>
    </section>
  );
}
