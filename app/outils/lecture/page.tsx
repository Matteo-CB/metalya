import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { TextAnalyzer } from "@/components/tools/text-analyzer";
import { GoogleAd } from "@/components/ads/google-ad";

export const metadata: Metadata = {
  title: "Compteur de Mots & Calculateur Temps de Lecture | Metalya",
  description:
    "Analysez la lisibilité de vos textes gratuitement. Nombre de mots, caractères et estimation du temps de lecture pour vos articles de blog.",
  alternates: { canonical: "https://metalya.fr/outils/lecture" },
};

export default function ReadingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-20">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
            Lecteur <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
              Zen
            </span>
          </h1>
          <p className="text-xl text-neutral-600">
            Un espace minimaliste pour écrire, compter vos mots et vérifier si
            votre texte est agréable à lire.
          </p>
        </div>

        <div className="mb-12">
          <GoogleAd slot="3729459964" format="auto" className="min-h-[100px]" />
          <p className="text-center text-[10px] text-neutral-300 mt-2 uppercase">
            Publicité
          </p>
        </div>

        <TextAnalyzer />

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
