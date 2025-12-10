import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";
import { auth } from "@/auth";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers";
import { prisma } from "@/lib/prisma";
import { ExitIntentPopup } from "@/components/ui/exit-intent-popup";
import { PWAInstallBanner } from "@/components/ui/pwa-install-banner";
import { SpeculationRules } from "@/components/seo/speculation-rules";
import { NewsMediaOrganization, WebSite, WithContext } from "schema-dts";

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
  userScalable: true,
};

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Metalya | L'Actualité Deep Tech & Lifestyle",
    template: "%s | Metalya",
  },
  description:
    "Metalya est votre magazine numérique de référence. Explorez des analyses approfondies sur la technologie, la culture, le voyage et le futur de notre société.",
  applicationName: "Metalya",
  authors: [{ name: "Matteo Biyikli", url: "https://hiddenlab.fr" }],
  generator: "Next.js",
  category: "technology",
  classification: "Magazine, News, Tech, Culture",
  keywords: [
    "Tech",
    "Culture",
    "Voyage",
    "Innovation",
    "Actualités",
    "Deep Tech",
    "Lifestyle",
    "Magazine Numérique",
    "Intelligence Artificielle",
    "Web3",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Hidden Lab",
  publisher: "Metalya Media",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Metalya",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/logo.png",
      },
    ],
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
        alt: "Metalya Magazine - Tech & Culture",
        type: "image/png",
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
    site: "@Metalyafr",
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
  other: {
    "opensearchdescription+xml": "/opensearch.xml",
    "geo.region": "FR",
    "geo.placename": "Paris",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  let unreadCount = 0;
  if (session?.user) {
    unreadCount = await prisma.messageRecipient.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    });
  }

  const orgSchema: WithContext<NewsMediaOrganization> = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Metalya",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: "512px",
      height: "512px",
    },
    sameAs: [
      "https://twitter.com/Metalyafr",
      "https://www.instagram.com/metalya.fr",
      "https://www.tiktok.com/@metalya.fr",
      "https://www.youtube.com/@Metalyafr",
      "https://www.linkedin.com/company/metalya",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@metalya.fr",
      contactType: "customer service",
      areaServed: "FR",
      availableLanguage: "French",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "FR",
    },
    publishingPrinciples: `${SITE_URL}/about`,
    foundingDate: "2025",
    knowsAbout: [
      "Technology",
      "Culture",
      "Artificial Intelligence",
      "Travel",
      "Innovation",
    ],
  };

  const websiteSchema: WithContext<WebSite> = {
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
    } as any,
    inLanguage: "fr-FR",
  };

  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-neutral-50 font-sans text-neutral-900 antialiased selection:bg-neutral-900 selection:text-neutral-50",
          fontSans.variable,
          fontSerif.variable
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-white focus:p-4 focus:text-neutral-900 focus:shadow-xl focus:ring-2 focus:ring-neutral-900"
        >
          Aller au contenu principal
        </a>

        <Providers session={session}>
          <SiteHeader user={session?.user} unreadCount={unreadCount} />
          <main
            id="main-content"
            className="relative mt-20 flex min-h-screen flex-col"
          >
            {children}
          </main>
          <Footer />
          <ExitIntentPopup />
          <PWAInstallBanner />
          <SpeculationRules />
        </Providers>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || ""} />
    </html>
  );
}
