import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { FocusSanctuary } from "@/components/tools/focus-sanctuary";
import { GoogleAd } from "@/components/ads/google-ad";
import { Clock, Zap, Brain } from "lucide-react";

export const metadata: Metadata = {
  title: "Focus Sanctuaire : Minuteur Pomodoro & Bruits Blancs | Metalya",
  description:
    "Boostez votre productivité avec notre minuteur Pomodoro gratuit et notre générateur d'ambiance sonore (Pluie, Café). Idéal pour le Deep Work.",
  alternates: { canonical: "https://metalya.fr/outils/focus" },
};

export default function FocusPage() {
  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-20">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
            Votre Sanctuaire de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              Productivité
            </span>
          </h1>
          <p className="text-xl text-neutral-600">
            La méthode Pomodoro combinée à des ambiances sonores immersives.
            Entrez dans la zone.
          </p>
        </div>

        <div className="mb-12">
          <GoogleAd slot="3729459964" format="auto" className="min-h-[100px]" />
          <p className="text-center text-[10px] text-neutral-300 mt-2 uppercase">
            Publicité
          </p>
        </div>

        <FocusSanctuary />

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <Clock className="text-amber-500 mb-4" size={32} />
            <h3 className="font-bold text-lg mb-2">Méthode Pomodoro</h3>
            <p className="text-sm text-neutral-600">
              25 minutes de travail intense, 5 minutes de pause. Le rythme
              scientifiquement prouvé pour durer.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <Brain className="text-indigo-500 mb-4" size={32} />
            <h3 className="font-bold text-lg mb-2">Bruits Blancs</h3>
            <p className="text-sm text-neutral-600">
              Masquez les distractions sonores et calmez votre cerveau pour une
              concentration profonde.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <Zap className="text-emerald-500 mb-4" size={32} />
            <h3 className="font-bold text-lg mb-2">Anti-Procrastination</h3>
            <p className="text-sm text-neutral-600">
              Lancer un minuteur est le moyen le plus simple de vaincre la
              résistance au travail.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <p className="text-center text-[10px] text-neutral-300 mb-2 uppercase">
            Publicité
          </p>
          <GoogleAd slot="3729459964" format="auto" className="min-h-[280px]" />
        </div>
      </Container>
    </div>
  );
}
