"use client";

import React, { useState, useMemo } from "react";
import { DESTINATIONS, getInflationCost } from "@/lib/destinations-data";
import {
  Wallet,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Search,
  Crown,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/fade-in";
import Image from "next/image";
import Link from "next/link";

export function LifestyleCalculator() {
  const [salary, setSalary] = useState<number>(2000);
  const [searchTerm, setSearchTerm] = useState("");

  // Calcul dynamique du pouvoir d'achat pour chaque ville
  const cityAnalysis = useMemo(() => {
    return DESTINATIONS.map((city) => {
      const cityCost = getInflationCost(city.baseCost);
      const ratio = salary / cityCost;
      let status = "";
      let color = "";
      let icon = null;

      if (ratio >= 2.5) {
        status = "Roi du Pétrole 👑";
        color = "bg-gradient-to-r from-yellow-400 to-amber-600";
        icon = Crown;
      } else if (ratio >= 1.5) {
        status = "Vie de Luxe 🚀";
        color = "bg-gradient-to-r from-emerald-400 to-green-600";
        icon = Trophy;
      } else if (ratio >= 1.1) {
        status = "Confortable ✅";
        color = "bg-gradient-to-r from-blue-400 to-indigo-600";
        icon = CheckCircle2;
      } else if (ratio >= 0.9) {
        status = "Juste ⚠️";
        color = "bg-gradient-to-r from-orange-400 to-red-500";
        icon = TrendingUp;
      } else {
        status = "Impossible 🛑";
        color = "bg-neutral-800";
        icon = AlertTriangle;
      }

      return {
        ...city,
        currentCost: cityCost,
        ratio,
        status,
        color,
        icon,
        savings: Math.max(0, salary - cityCost),
      };
    })
      .filter((city) =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.ratio - a.ratio); // On trie du plus riche au plus pauvre
  }, [salary, searchTerm]);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-12 px-4">
      {/* --- CONTROL PANEL (STICKY) --- */}
      <div className="sticky top-24 z-30 mb-12">
        <div className="bg-white/90 backdrop-blur-xl border border-neutral-200 shadow-2xl rounded-3xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="w-full md:w-1/2 space-y-4">
              <label className="text-sm font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                <Wallet size={18} className="text-blue-600" /> Votre revenu Net
                Mensuel
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="50"
                  value={salary}
                  onChange={(e) => setSalary(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="min-w-[120px] text-right">
                  <span className="text-4xl font-serif font-bold text-neutral-900">
                    {salary} €
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/3 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Chercher une ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- RESULTS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {cityAnalysis.map((city, index) => {
            const Icon = city.icon || CheckCircle2;

            return (
              <motion.div
                layout
                key={city.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.3,
                  delay: index > 9 ? 0 : index * 0.05,
                }}
                className="group relative bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header Image */}
                <div className="relative h-40 w-full">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                  <div className="absolute top-4 right-4">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg ${city.color}`}
                    >
                      {city.status}
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-6">
                    <h3 className="text-2xl font-bold text-white font-serif">
                      {city.name}
                    </h3>
                    <p className="text-white/80 text-xs font-medium">
                      {city.country}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase mb-1">
                        Coût de la vie
                      </p>
                      <p className="text-xl font-bold text-neutral-900">
                        {city.currentCost} €
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-400 font-bold uppercase mb-1">
                        Epargne possible
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          city.savings > 0 ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {city.savings > 0 ? "+" : ""}
                        {city.savings} €
                      </p>
                    </div>
                  </div>

                  {/* Power Bar */}
                  <div className="relative h-3 bg-neutral-100 rounded-full overflow-hidden mb-6">
                    <motion.div
                      className={`absolute top-0 left-0 h-full ${city.color}`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min((city.ratio / 3) * 100, 100)}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>

                  <Link
                    href={`/destinations/${city.slug}`}
                    className="block w-full py-3 text-center rounded-xl bg-neutral-50 text-neutral-600 font-bold text-sm hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    Voir le guide complet
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* --- FOOTER EXPLAINER --- */}
      <FadeIn>
        <div className="mt-20 text-center max-w-2xl mx-auto bg-blue-50 p-8 rounded-3xl border border-blue-100">
          <Share2 className="w-8 h-8 text-blue-600 mx-auto mb-4" />
          <h3 className="font-bold text-xl text-blue-900 mb-2">
            Partagez votre découverte
          </h3>
          <p className="text-blue-700/80 mb-6">
            Vous avez trouvé l'endroit où vous êtes riche ? Envoyez ce lien à
            vos amis pour les rendre jaloux.
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Lien copié !");
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-colors"
          >
            Copier le lien
          </button>
        </div>
      </FadeIn>
    </div>
  );
}
