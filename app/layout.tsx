import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";
import { auth } from "@/auth";
import { SiteHeader } from "@/components/layout/site-header";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontSerif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const SITE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Metalya | L'Actualité Deep Tech & Lifestyle",
    template: "%s | Metalya",
  },
  description:
    "Metalya est votre magazine numérique de référence. Explorez des analyses approfondies sur la technologie, la culture, le voyage et le futur de notre société.",
  applicationName: "Metalya",
  authors: [{ name: "Matteo Biyikli", url: "https://dlkdigitalagency.com" }],
  generator: "Next.js",
  keywords: [
    "Tech",
    "Culture",
    "Voyage",
    "Innovation",
    "Actualités",
    "Deep Tech",
    "Lifestyle",
    "Magazine Numérique",
  ],
  referrer: "origin-when-cross-origin",
  creator: "DLK Digital Agency",
  publisher: "Metalya Media",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/",
    },
    types: {
      "application/rss+xml": [{ url: "feed.xml", title: "Flux RSS Metalya" }],
    },
  },
  openGraph: {
    title: "Metalya | L'Actualité Deep Tech & Lifestyle",
    description:
      "Explorez des articles de fond sur la technologie, le design et le futur.",
    url: SITE_URL,
    siteName: "Metalya",
    images: [
      {
        url: "/banniere.png",
        width: 1200,
        height: 630,
        alt: "Metalya Magazine",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Metalya",
    description: "L'essentiel de la culture, tech et actualité.",
    creator: "@Metalyafr",
    images: ["/banniere.png"],
  },
  verification: {
    google: "kW36zMDmilSPGFpLjk6v4FqSjyoPW0LsRdBJMqVwuHY",
    other: {
      "msvalidate.01": "BCE8A55CD723069D99A9A720362A8DEE",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Metalya",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Metalya",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
      sameAs: [
        "https://twitter.com/Metalyafr",
        "https://www.instagram.com/metalya.fr",
        "https://www.tiktok.com/@metalya.fr",
        "https://www.youtube.com/@Metalyafr",
      ],
    },
  };

  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-neutral-50 font-sans text-neutral-900 antialiased selection:bg-neutral-900 selection:text-neutral-50",
          fontSans.variable,
          fontSerif.variable
        )}
      >
        <SiteHeader user={session?.user} />
        <main className="relative mt-20 flex min-h-screen flex-col">
          {children}
        </main>
        <Footer />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || ""} />
    </html>
  );
}
