"use client";

import React, { useState } from "react";
import { DESTINATIONS, getInflationCost } from "@/lib/destinations-data";
import {
  MapPin,
  Thermometer,
  Sparkles,
  ArrowRight,
  Sun,
  Calendar as CalendarIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Events Data (SEO Goldmine)
const CALENDAR_EVENTS: Record<
  string,
  { slug: string; event: string; type: "Nature" | "Culture" | "Tech" }[]
> = {
  Janvier: [
    { slug: "le-cap", event: "Plein été austral", type: "Nature" },
    { slug: "dubai", event: "Shopping Festival", type: "Culture" },
    { slug: "mexico-city", event: "Saison sèche idéale", type: "Nature" },
  ],
  Février: [
    { slug: "tenerife", event: "Carnaval de Santa Cruz", type: "Culture" },
    { slug: "bangkok", event: "Nouvel An Chinois", type: "Culture" },
    { slug: "da-nang", event: "Climat de plage parfait", type: "Nature" },
  ],
  Mars: [
    { slug: "tokyo", event: "Sakura (Cerisiers)", type: "Nature" },
    { slug: "medellin", event: "Fin saison des pluies", type: "Nature" },
    { slug: "buenos-aires", event: "Festival Tango", type: "Culture" },
  ],
  Avril: [
    { slug: "seoul", event: "Printemps Royal", type: "Nature" },
    { slug: "lisbonne", event: "Pâques & Soleil", type: "Culture" },
    { slug: "bali-canggu", event: "Début saison sèche", type: "Nature" },
  ],
  Mai: [
    { slug: "new-york", event: "Manhattanhenge", type: "Nature" },
    { slug: "barcelone", event: "Primavera Sound", type: "Culture" },
    { slug: "berlin", event: "Carnaval des Cultures", type: "Culture" },
  ],
  Juin: [
    { slug: "tallinn", event: "Nuits Blanches", type: "Nature" },
    { slug: "londres", event: "Début de l'été", type: "Nature" },
    { slug: "lisbonne", event: "Fêtes de Santo Antonio", type: "Culture" },
  ],
  Juillet: [
    { slug: "budapest", event: "Sziget (Préparation)", type: "Culture" },
    { slug: "bali-canggu", event: "Festival des Arts", type: "Culture" },
    { slug: "berlin", event: "Open Air Season", type: "Tech" },
  ],
  Août: [
    { slug: "medellin", event: "Feria de las Flores", type: "Culture" },
    { slug: "tallinn", event: "Météo Parfaite", type: "Nature" },
    { slug: "budapest", event: "Sziget Festival", type: "Culture" },
  ],
  Septembre: [
    { slug: "tokyo", event: "Tokyo Game Show", type: "Tech" },
    { slug: "new-york", event: "Fashion Week", type: "Culture" },
    { slug: "barcelone", event: "La Mercè", type: "Culture" },
  ],
  Octobre: [
    { slug: "taipei", event: "Météo automnale top", type: "Nature" },
    { slug: "austin", event: "Austin City Limits", type: "Culture" },
    { slug: "seoul", event: "Festival Feux d'Artifice", type: "Culture" },
  ],
  Novembre: [
    { slug: "mexico-city", event: "Día de Muertos", type: "Culture" },
    { slug: "dubai", event: "Design Week", type: "Tech" },
    { slug: "buenos-aires", event: "Jacarandas en fleur", type: "Nature" },
  ],
  Décembre: [
    { slug: "new-york", event: "Noël à Rockefeller", type: "Culture" },
    { slug: "le-cap", event: "Début de l'été", type: "Nature" },
    { slug: "tenerife", event: "Soleil d'Hiver", type: "Nature" },
  ],
};

const MONTHS = Object.keys(CALENDAR_EVENTS);

export function TravelCalendar() {
  const currentMonthIndex = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[currentMonthIndex]);

  const recommendations = CALENDAR_EVENTS[selectedMonth]
    .map((event) => {
      const city = DESTINATIONS.find((c) => c.slug === event.slug);
      return city ? { ...city, ...event } : null;
    })
    .filter(Boolean);

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      {/* Month Selector */}
      <div className="relative mb-12">
        <div className="flex gap-2 overflow-x-auto pb-6 pt-2 px-4 no-scrollbar snap-x cursor-grab active:cursor-grabbing mask-gradient-right">
          {MONTHS.map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`snap-center px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                selectedMonth === month
                  ? "bg-neutral-900 text-white shadow-lg scale-105"
                  : "bg-white text-neutral-500 border border-neutral-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        <AnimatePresence mode="popLayout">
          {recommendations.map((city: any, index: number) => (
            <motion.div
              layout
              key={`${selectedMonth}-${city.slug}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={`/destinations/${city.slug}`}
                className="group block relative bg-white rounded-[2rem] overflow-hidden border border-neutral-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={city.image}
                    alt={`${city.event} à ${city.name}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md ${
                        city.type === "Culture"
                          ? "bg-purple-500/80"
                          : city.type === "Nature"
                          ? "bg-emerald-500/80"
                          : "bg-blue-500/80"
                      }`}
                    >
                      {city.type}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-6 right-6">
                    <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Sparkles size={12} /> À ne pas manquer
                    </div>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {city.event}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                        {city.name}
                      </h2>
                      <div className="flex items-center gap-1 text-neutral-500 text-sm">
                        <MapPin size={14} /> {city.country}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">
                        {getInflationCost(city.baseCost)}€
                      </div>
                      <div className="text-[10px] uppercase font-bold text-neutral-400">
                        / Mois
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
                      <Thermometer size={14} /> {city.temp}°C
                    </div>
                    <div className="flex-1 text-right">
                      <span className="inline-flex items-center text-sm font-bold text-blue-600 group-hover:gap-2 transition-all">
                        Guide <ArrowRight size={16} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
