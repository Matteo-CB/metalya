"use client";

import { useState, useMemo } from "react";
import { DESTINATIONS, City, getInflationCost } from "@/lib/destinations-data";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  DollarSign,
  Coffee,
  Wifi,
  Sun,
  TrendingUp,
  Filter,
  Check,
  Plane,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Filtres "Grand Public" (Exit le jargon nomad)
type TravelStyle = "eco" | "comfort" | "luxury";

export function NomadPlanner() {
  const [search, setSearch] = useState("");
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 10000]);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("comfort");
  const [duration, setDuration] = useState<number>(1); // 1 mois par défaut

  // Logique de calcul adaptée au style de voyage
  const getAdjustedCost = (baseCost: number, style: TravelStyle) => {
    const realCost = getInflationCost(baseCost);
    switch (style) {
      case "eco":
        return Math.round(realCost * 0.6); // Mode Backpacker
      case "luxury":
        return Math.round(realCost * 2.2); // Mode Hôtel/Luxe
      default:
        return realCost; // Mode Expat/Confort
    }
  };

  // Filtrage
  const filteredCities = useMemo(() => {
    return DESTINATIONS.filter((city) => {
      const cost = getAdjustedCost(city.baseCost, travelStyle);
      const matchesSearch =
        city.name.toLowerCase().includes(search.toLowerCase()) ||
        city.country.toLowerCase().includes(search.toLowerCase());
      const matchesBudget = cost >= budgetRange[0] && cost <= budgetRange[1];
      const matchesRegion =
        selectedRegion === "all" || city.region === selectedRegion;

      return matchesSearch && matchesBudget && matchesRegion;
    }).sort((a, b) => {
      // Tri par popularité implicite (position dans le tableau) ou coût
      return (
        getAdjustedCost(a.baseCost, travelStyle) -
        getAdjustedCost(b.baseCost, travelStyle)
      );
    });
  }, [search, budgetRange, selectedRegion, travelStyle]);

  const regions = Array.from(new Set(DESTINATIONS.map((c) => c.region)));

  return (
    <div className="space-y-8">
      {/* --- BARRE DE CONTRÔLE --- */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-neutral-100">
        <div className="grid md:grid-cols-12 gap-6">
          {/* Recherche */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Chercher une ville, un pays..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-neutral-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Style de Voyage (Sélecteur) */}
          <div className="md:col-span-5 flex p-1 bg-neutral-100 rounded-2xl">
            <button
              onClick={() => setTravelStyle("eco")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all ${
                travelStyle === "eco"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              🎒 Éco
            </button>
            <button
              onClick={() => setTravelStyle("comfort")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all ${
                travelStyle === "comfort"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              🛋️ Confort
            </button>
            <button
              onClick={() => setTravelStyle("luxury")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all ${
                travelStyle === "luxury"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              💎 Luxe
            </button>
          </div>

          {/* Filtre Région */}
          <div className="md:col-span-3">
            <select
              className="w-full h-full px-4 rounded-2xl bg-neutral-50 border-r-[16px] border-transparent outline-none font-medium text-neutral-700 focus:ring-2 focus:ring-blue-500"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="all">🌍 Monde entier</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info Durée (Optionnel pour V2 mais présent visuellement) */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-neutral-500 border-t border-neutral-100 pt-4">
          <span className="flex items-center gap-2">
            <Filter size={14} /> Filtres actifs :
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
            Budget ajusté pour 1 personne
          </span>
          <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full font-medium">
            Inflation 2025 incluse
          </span>
        </div>
      </div>

      {/* --- RÉSULTATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCities.map((city) => {
            const cost = getAdjustedCost(city.baseCost, travelStyle);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={city.slug}
                className="group bg-white rounded-3xl border border-neutral-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Header */}
                <div className="relative h-48 w-full">
                  <Image
                    src={city.image}
                    alt={`Budget voyage ${city.name}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{city.name}</h3>
                    <p className="text-sm opacity-90">{city.country}</p>
                  </div>

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-neutral-900 shadow-sm flex items-center gap-1">
                    <Sun size={12} className="text-orange-500" /> {city.temp}°C
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-1">
                        Budget Estimé
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-neutral-900">
                          {cost}€
                        </span>
                        <span className="text-sm text-neutral-500">/mois</span>
                      </div>
                    </div>
                    {/* Indicateur Visuel Prix */}
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`w-2 h-6 rounded-full ${
                            (cost > 1500 && i === 1) ||
                            (cost > 3000 && i === 2) ||
                            (cost > 5000 && i === 3)
                              ? "bg-neutral-200"
                              : "bg-emerald-500"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-neutral-600">
                        <Wifi size={16} className="text-blue-400" /> Internet
                      </span>
                      <span className="font-medium text-neutral-900">
                        {city.internet} Mbps
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-neutral-600">
                        <Coffee size={16} className="text-brown-400" /> Café
                      </span>
                      <span className="font-medium text-neutral-900">
                        ~{(2.5 * (cost / 2000)).toFixed(2)}€
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/destinations/${city.slug}`}
                    className="flex items-center justify-center w-full py-3 bg-neutral-900 text-white rounded-xl font-bold text-sm hover:bg-neutral-800 transition-colors gap-2"
                  >
                    Voir le Guide <Plane size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredCities.length === 0 && (
        <div className="text-center py-20 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
          <p className="text-neutral-400 font-medium">
            Aucune destination ne correspond à vos critères.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setBudgetRange([0, 10000]);
            }}
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
