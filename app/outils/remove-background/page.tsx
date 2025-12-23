import type { Metadata } from "next";
import { BackgroundRemover } from "@/components/tools/background-remover";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Supprimer le fond d'une image gratuitement (IA) | Metalya",
  description:
    "Outil de détourage photo gratuit par IA. Enlevez l'arrière-plan de vos images en 1 clic. Qualité HD, 100% Gratuit, Sans inscription. Fonctionne en local.",
  alternates: {
    canonical: "https://metalya.fr/outils/remove-background",
  },
  openGraph: {
    title: "Détourage Photo Gratuit & IA | Metalya",
    description:
      "Supprimez le fond de vos images instantanément et gratuitement.",
    url: "https://metalya.fr/outils/remove-background",
    type: "website",
    images: [
      {
        url: "/og-tools.jpg",
        width: 1200,
        height: 630,
        alt: "Metalya Studio Détourage",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Metalya Studio Détourage",
  applicationCategory: "PhotographyApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description: "Outil de détourage photo gratuit par IA.",
  featureList:
    "Détourage IA, Fond Transparent, Haute Résolution, Gratuit, Local Privacy",
};

export default function RemoveBackgroundPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative min-h-screen bg-neutral-50 pt-24 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-200/50 blur-[120px]" />
        </div>

        <Container>
          <BackgroundRemover />
        </Container>
      </div>
    </>
  );
}
