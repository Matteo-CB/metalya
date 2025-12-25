"use client";

import { City, getInflationCost } from "@/lib/destinations-data";
import {
  Wifi,
  Thermometer,
  Wallet,
  ShieldCheck,
  Globe,
  Users,
  Map,
  Sun,
  CloudRain,
} from "lucide-react";
import { motion } from "framer-motion";

export function CityDashboard({ city }: { city: City }) {
  const realCost = getInflationCost(city.baseCost);

  // Estimation Budget Touriste (1 semaine) vs Budget Vie (1 mois)
  const touristWeeklyBudget = Math.round(realCost * 0.4);

  // Score de connectivité (0-100) basé sur la vitesse internet
  const wifiScore = Math.min(100, Math.round((city.internet / 150) * 100));

  // Couleur dynamique selon le score
  const wifiColor =
    wifiScore > 80
      ? "text-emerald-500"
      : wifiScore > 50
      ? "text-yellow-500"
      : "text-orange-500";

  const metrics = [
    {
      label: "Vitesse Internet",
      value: `${city.internet} Mbps`,
      sub: wifiScore > 80 ? "Ultra Rapide 🚀" : "Suffisant pour streamer",
      icon: Wifi,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Météo Moyenne",
      value: `${city.temp}°C`,
      sub: city.temp > 25 ? "Chaud & Ensoleillé ☀️" : "Tempéré & Doux 🌤️",
      icon: Thermometer,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Budget Mensuel",
      value: `${realCost} €`,
      sub: "Logement + Vie locale",
      icon: Wallet,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Budget Touriste",
      value: `~${touristWeeklyBudget} €`,
      sub: "Pour 1 semaine (Hôtel/Sorties)",
      icon: Map,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* GRILLE PRINCIPALE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-colors"
            >
              <div className={`p-3 rounded-xl ${metric.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  {metric.label}
                </p>
                <p className="text-xl font-bold text-neutral-900 leading-none mb-1">
                  {metric.value}
                </p>
                <p className="text-xs font-medium text-neutral-500">
                  {metric.sub}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* BARRES DE PROGRESSION & INFOS SUPPLÉMENTAIRES */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-xl">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <Globe size={20} className="text-blue-400" />
          Indice de Voyageur
        </h3>

        <div className="space-y-6">
          {/* Jauge Internet */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-300">Connectivité & 4G/5G</span>
              <span className="font-bold text-blue-400">{wifiScore}/100</span>
            </div>
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${wifiScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
              />
            </div>
          </div>

          {/* Jauge Coût */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-300">Abordabilité</span>
              <span className="font-bold text-emerald-400">
                {realCost < 1500
                  ? "Excellent"
                  : realCost < 3000
                  ? "Moyen"
                  : "Cher"}
              </span>
            </div>
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.max(10, 100 - (realCost / 5000) * 100)}%`,
                }} // Plus c'est cher, plus la barre est petite
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="h-full bg-gradient-to-r from-emerald-600 to-green-400"
              />
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <ShieldCheck size={16} className="text-green-400" />
              <span>Zone Touristique Sûre</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <Users size={16} className="text-purple-400" />
              <span>Communauté Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
