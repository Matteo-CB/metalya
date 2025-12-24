import type { Metadata } from "next";
import { TravelCalendar } from "@/components/tools/travel-calendar";
import { Container } from "@/components/ui/container";
import { Calendar, Compass, Sun } from "lucide-react";

export const metadata: Metadata = {
  title: "Où partir ce mois-ci ? Calendrier Voyage 2025 | Metalya",
  description:
    "Trouvez la destination parfaite pour chaque mois de l'année. En fonction de la météo, des festivals et du budget. Le guide saisonnier du digital nomad.",
  keywords: [
    "où partir en mars 2025",
    "meilleure destination novembre",
    "calendrier voyage",
    "saison sèche bali",
    "festivals japon",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Calendrier de Voyage Saisonnier",
  applicationCategory: "TravelApplication",
  description:
    "Recommandation de destinations basée sur la météo et les événements culturels.",
};

export default function CalendarPage() {
  const currentMonth = new Date().toLocaleString("fr-FR", { month: "long" });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-neutral-50 pt-24 pb-20 relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[100px] -z-10" />

        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-200">
              <Calendar size={14} /> Agenda 2025
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-neutral-900 mb-6">
              Suivez le{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Soleil
              </span>
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              Ne partez plus au hasard. Nous avons croisé les données météo, les
              festivals culturels et les conférences tech pour vous dire
              exactement où être, et quand.
            </p>
          </div>

          <TravelCalendar />

          {/* SEO Content */}
          <div className="mt-32 grid md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center mx-auto text-orange-500">
                <Sun size={24} />
              </div>
              <h3 className="font-bold text-lg">Météo Optimisée</h3>
              <p className="text-sm text-neutral-500">
                Nous filtrons les destinations pour éviter les moussons et les
                hivers rudes. Profitez du climat idéal.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center mx-auto text-purple-500">
                <Compass size={24} />
              </div>
              <h3 className="font-bold text-lg">Culture Locale</h3>
              <p className="text-sm text-neutral-500">
                Vivez les événements qui comptent : Carnavals, Floraisons,
                Festivals Tech. Soyez au bon endroit.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center mx-auto text-emerald-500">
                <Calendar size={24} />
              </div>
              <h3 className="font-bold text-lg">Hors Saison</h3>
              <p className="text-sm text-neutral-500">
                Découvrez aussi les périodes creuses pour profiter des
                destinations de luxe à prix réduit.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
