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
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-200/50 blur-[120px]" />
          <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-pink-200/50 blur-[100px]" />
        </div>

        <Container>
          <ImageConverter />
        </Container>
      </div>
    </>
  );
}
