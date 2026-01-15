import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { DESTINATIONS, getInflationCost } from "@/lib/destinations-data";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight, Wifi, Sun, DollarSign } from "lucide-react";
import { GoogleAd } from "@/components/ads/google-ad";

export const metadata: Metadata = {
  title: "Destinations Digital Nomad : Le Guide Complet 2025",
  description:
    "Explorez 40 villes analysées pour les travailleurs à distance. Coût de la vie, vitesse internet, météo. Trouvez votre prochain bureau.",
};

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 pt-32 pb-20">
      <Container>
        {/* Header de Page */}
        <div className="max-w-2xl mb-12">
          <FadeIn>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-neutral-900 mb-6 tracking-tight">
              Trouvez votre <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Prochaine Base
              </span>
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              Une collection curée des meilleures villes au monde pour vivre,
              travailler et explorer. Données mises à jour avec l'inflation
              2025.
            </p>
          </FadeIn>
        </div>

        {/* PUB TOP */}
        <div className="mb-16">
          <GoogleAd
            slot="3729459964"
            format="auto"
            className="min-h-[120px] rounded-2xl"
          />
          <p className="text-center text-[10px] uppercase tracking-widest text-neutral-300 mt-2">
            Publicité
          </p>
        </div>

        {/* Grille Principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS.map((city, index) => (
            <FadeIn key={city.slug} delay={index * 0.05}>
              <Link
                href={`/destinations/${city.slug}`}
                className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-neutral-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                      {city.region}
                    </span>
                  </div>

                  {/* Bouton flèche au survol */}
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 shadow-lg">
                    <ArrowUpRight size={20} className="text-blue-600" />
                  </div>
                </div>

                {/* Infos */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                        {city.name}
                      </h3>
                      <div className="flex items-center gap-1 text-neutral-500 text-sm mt-1">
                        <MapPin size={14} /> {city.country}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-lg font-bold text-neutral-900">
                        {getInflationCost(city.baseCost)}€
                      </span>
                      <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">
                        /Mois
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-neutral-100 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Wifi size={18} className="mx-auto mb-2 text-blue-500" />
                      <span className="block text-sm font-bold text-neutral-700">
                        {city.internet}{" "}
                        <span className="text-xs font-normal text-neutral-400">
                          Mbps
                        </span>
                      </span>
                    </div>
                    <div className="text-center border-l border-neutral-100">
                      <Sun size={18} className="mx-auto mb-2 text-orange-500" />
                      <span className="block text-sm font-bold text-neutral-700">
                        {city.temp}°{" "}
                        <span className="text-xs font-normal text-neutral-400">
                          Moy
                        </span>
                      </span>
                    </div>
                    <div className="text-center border-l border-neutral-100">
                      <span className="block mb-2 text-lg">✨</span>
                      <span className="block text-xs font-bold text-neutral-600 truncate px-1">
                        {city.vibe}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* PUB BOTTOM */}
        <div className="mt-20">
          <p className="text-center text-[10px] uppercase tracking-widest text-neutral-300 mb-2">
            Publicité
          </p>
          <GoogleAd
            slot="3729459964"
            format="auto"
            className="min-h-[250px] rounded-2xl"
          />
        </div>
      </Container>
    </div>
  );
}
