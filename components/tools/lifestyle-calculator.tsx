"use client";

import { useState, useMemo } from "react";
import { DESTINATIONS, getInflationCost } from "@/lib/destinations-data";
import {
  TrendingUp,
  ArrowRight,
  Wallet,
  Briefcase,
  Plane,
  Coins,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function LifestyleCalculator() {
  // On vise un public plus large : 2000€ est un salaire standard en France
  const [salary, setSalary] = useState<number>(2000);

  const cityAnalysis = useMemo(() => {
    return DESTINATIONS.map((city) => {
      const realCost = getInflationCost(city.baseCost);
      // Formule de "Richesse Relative"
      // Si je gagne 2000 et que le coût est 1000, je suis "2x plus riche" qu'un local moyen
      const purchasingPower = salary / realCost;

      // Combien on peut épargner (théorique)
      const potentialSavings = Math.max(0, salary - realCost);

      return {
        ...city,
        realCost,
        purchasingPower,
        potentialSavings,
      };
    })
      .sort((a, b) => b.purchasingPower - a.purchasingPower) // Les plus rentables en premier
      .slice(0, 12); // Top 12
  }, [salary]);

  return (
    <div className="space-y-12">
      {/* --- INPUT SECTION --- */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-neutral-100 max-w-2xl mx-auto text-center">
        <label className="block text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">
          Votre Revenu Mensuel Net (Solo ou Couple)
        </label>
        <div className="relative max-w-xs mx-auto">
          <DollarSignIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full pl-12 pr-4 py-4 text-3xl font-bold text-center bg-neutral-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">
            €
          </span>
        </div>
        <p className="mt-4 text-neutral-500 text-sm">
          Simulez votre pouvoir d'achat dans 80+ villes à travers le monde.
        </p>
      </div>

      {/* --- RESULTS GRID --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cityAnalysis.map((city, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={city.slug}
            className="relative bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-300 group"
          >
            {/* Header Image */}
            <div className="relative h-32 w-full">
              <Image
                src={city.image}
                alt={city.name}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
              <div className="absolute bottom-2 left-6">
                <h3 className="text-xl font-bold text-neutral-900">
                  {city.name}
                </h3>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  {city.country}
                </p>
              </div>
            </div>

            <div className="p-6 pt-2">
              {/* Métrique Principale : Multiplicateur */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`p-3 rounded-2xl ${
                    city.purchasingPower >= 2
                      ? "bg-emerald-100 text-emerald-700"
                      : city.purchasingPower >= 1
                      ? "bg-blue-100 text-blue-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase">
                    Pouvoir d'Achat
                  </p>
                  <p className="text-2xl font-black text-neutral-900">
                    x{city.purchasingPower.toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Détails Financiers */}
              <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500">Coût Vie Locale</span>
                  <span className="font-bold text-neutral-900">
                    {city.realCost}€
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500">Épargne Possible</span>
                  <span
                    className={`font-bold ${
                      city.potentialSavings > 0
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {city.potentialSavings > 0 ? "+" : ""}
                    {city.potentialSavings}€
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/destinations/${city.slug}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 text-sm font-bold hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
              >
                Explorer la ville <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Icon Helper
function DollarSignIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
