import type { Metadata } from "next";
import { ImageConverter } from "@/components/tools/image-converter";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Convertisseur Image Ultime Gratuit : JPG, PNG, WebP, AVIF | Metalya",
  description:
    "Convertisseur et compresseur d'images illimité. Transformez vos photos en WebP et AVIF pour le web. Redimensionnement et anonymisation automatique. 100% Privé & Local.",
  alternates: {
    canonical: "https://metalya.fr/outils/convertisseur-image",
  },
  openGraph: {
    title: "Convertisseur WebP & AVIF Gratuit | Metalya",
    description: "Compressez vos images pour le web sans perte de qualité.",
    url: "https://metalya.fr/outils/convertisseur-image",
    type: "website",
    images: [
      {
        url: "/og-tools.jpg",
        width: 1200,
        height: 630,
        alt: "Metalya Image Converter",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Metalya Image Studio Ultimate",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description: "Convertisseur et compresseur d'images illimité.",
  featureList: [
    "Conversion JPG vers WebP",
    "Conversion PNG vers AVIF",
    "Redimensionnement d'image batch",
    "Compression sans perte visuelle",
  ],
};

export default function ImageConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative min-h-screen bg-neutral-50 pt-24 pb-20">
        <Container>
          <ImageConverter />
        </Container>
      </div>
    </>
  );
}
