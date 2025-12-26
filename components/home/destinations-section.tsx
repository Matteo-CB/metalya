"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { DESTINATIONS, getInflationCost } from "@/lib/destinations-data";
import { ArrowRight, MapPin, Compass, Sun, Globe, Heart } from "lucide-react";
import Image from "next/image";

export function DestinationsSection() {
  // Sélection des 4 destinations les plus attractives pour le voyage global
  const featuredDestinations = DESTINATIONS.slice(0, 4);

  return (
    <section className="py-32 bg-neutral-50 overflow-hidden relative">
      {/* --- BACKGROUND FX --- */}

      <Container className="relative z-10">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest mb-6 border border-blue-100">
                <Globe size={14} />
                <span>Inspirations</span>
              </div>

              <h2 className="font-serif text-5xl md:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
                Le monde est votre <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  Terrain de Jeu
                </span>
              </h2>

              <p className="text-xl text-neutral-600 leading-relaxed max-w-xl">
                Explorez notre sélection des destinations les plus tendances.
                Budget, météo, sécurité : nous avons analysé 80+ villes pour
                garantir votre prochain coup de cœur.
              </p>
            </div>

            <Link
              href="/destinations"
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-neutral-900 text-white font-bold transition-all hover:bg-neutral-800 hover:shadow-2xl hover:shadow-neutral-900/20 hover:-translate-y-1 whitespace-nowrap"
            >
              Toutes les destinations
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>

        {/* --- CARDS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDestinations.map((city, index) => (
            <FadeIn key={city.slug} delay={index * 0.1}>
              <Link
                href={`/destinations/${city.slug}`}
                className="group block relative h-[520px] w-full overflow-hidden rounded-[2.5rem] shadow-md hover:shadow-2xl transition-all duration-500 border border-white"
              >
                {/* Image & Overlay */}
                <div className="absolute inset-0 bg-neutral-900">
                  <Image
                    src={city.image}
                    alt={`Voyage à ${city.name} - Guide et Budget`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-90"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-500" />
                </div>

                {/* Badges Supérieurs */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {city.region}
                  </span>
                  {city.badge && (
                    <span className="px-3 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1">
                      ★ {city.badge}
                    </span>
                  )}
                </div>

                {/* Contenu Inférieur (Slide Up Effect) */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  {/* Vibe Label */}
                  <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-y-2 group-hover:translate-y-0 delay-75">
                    <span className="text-teal-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                      <Heart size={12} fill="currentColor" />
                      {city.vibe}
                    </span>
                  </div>

                  <h3 className="font-serif text-4xl font-bold text-white mb-2 leading-none drop-shadow-md">
                    {city.name}
                  </h3>

                  <div className="flex items-center gap-2 text-white/90 text-sm font-medium mb-6">
                    <MapPin size={16} className="text-teal-400" />{" "}
                    {city.country}
                  </div>

                  {/* Grille de Métriques */}
                  <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-5 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    {/* Budget */}
                    <div>
                      <div className="text-[10px] text-white/70 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                        <Compass size={12} /> Budget Voyage
                      </div>
                      <div className="text-white font-bold text-xl">
                        ~{getInflationCost(city.baseCost)}€
                        <span className="text-sm font-normal text-white/60">
                          /m
                        </span>
                      </div>
                    </div>

                    {/* Météo */}
                    <div className="border-l border-white/10 pl-4">
                      <div className="text-[10px] text-white/70 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                        <Sun size={12} /> Météo
                      </div>
                      <div className="text-white font-bold text-xl">
                        {city.temp}°C
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
