"use client";

import { City, getInflationCost } from "@/lib/destinations-data"; // <--- Import depuis le nouveau fichier central
import { Wifi, Sun, Wallet, ThumbsUp, ThumbsDown, Plane } from "lucide-react";
import { motion } from "framer-motion";

export function CityDashboard({ city }: { city: City }) {
  // Calcul du coût réel avec inflation (fonction centralisée)
  const realCost = getInflationCost(city.baseCost);

  const metrics = [
    {
      label: "Budget / Mois",
      value: `${realCost} €`,
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Internet",
      value: `${city.internet} Mbps`,
      icon: Wifi,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Météo",
      value: `${city.temp}°C`,
      icon: Sun,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    // On a supprimé la Sûreté ici comme demandé
  ];

  // Données factices pour Pros/Cons (car non présentes dans le type City simplifié pour le moment)
  // Dans une V2, tu pourras les ajouter dans lib/destinations-data.ts
  const defaultPros = ["Coût de la vie", "Communauté Nomade", "Activités"];
  const defaultCons = ["Barrière langue", "Décalage horaire", "Trafic"];

  return (
    <div className="w-full">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${m.bg} p-6 rounded-2xl border border-white/50 shadow-sm flex flex-col items-center text-center`}
          >
            <m.icon className={`w-8 h-8 ${m.color} mb-3`} />
            <div className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
              {m.label}
            </div>
            <div className="text-2xl md:text-3xl font-bold text-neutral-900 mt-2">
              {m.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pros & Cons (Placeholder intelligent) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-emerald-700">
            <ThumbsUp size={20} /> Les points forts
          </h3>
          <ul className="space-y-3">
            {defaultPros.map((pro, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-neutral-600"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                {pro}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-rose-700">
            <ThumbsDown size={20} /> À savoir
          </h3>
          <ul className="space-y-3">
            {defaultCons.map((con, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-neutral-600"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Affiliation */}
      <div className="mt-8 text-center">
        <a
          href={`https://www.skyscanner.fr/transport/vols/fr/${
            city.slug.split("-")[0]
          }`}
          target="_blank"
          rel="nofollow sponsored"
          className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-full font-bold hover:bg-neutral-800 transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
        >
          <Plane size={20} />
          Trouver un vol pour {city.name}
        </a>
      </div>
    </div>
  );
}
