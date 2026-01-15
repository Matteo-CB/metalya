import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SeoSimulator } from "@/components/tools/seo-simulator";
import { GoogleAd } from "@/components/ads/google-ad";

export const metadata: Metadata = {
  title: "Simulateur SERP Google Gratuit : Optimisez vos CTR | Metalya",
  description:
    "Visualisez vos balises Title et Meta Description comme dans les résultats Google. Outil SEO gratuit pour améliorer votre taux de clic.",
  alternates: { canonical: "https://metalya.fr/outils/seo-preview" },
};

export default function SeoPage() {
  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-20">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
            Simulateur de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Résultats Google
            </span>
          </h1>
          <p className="text-xl text-neutral-600">
            Ne devinez plus. Voyez exactement comment votre site apparaîtra sur
            Google et maximisez vos clics.
          </p>
        </div>

        <div className="mb-12">
          <GoogleAd slot="3729459964" format="auto" className="min-h-[100px]" />
          <p className="text-center text-[10px] text-neutral-300 mt-2 uppercase">
            Publicité
          </p>
        </div>

        <SeoSimulator />

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
