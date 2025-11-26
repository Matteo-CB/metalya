import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: {
    default: "Metalya | L'Actualité Deep Tech & Lifestyle",
    template: "%s | Metalya",
  },
  description:
    "Explorez des articles de fond sur la technologie, le design et le futur.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Metalya",
  },
  robots: {
    index: true,
    follow: true,
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth(); // <-- Récupération session
  return (
    <html lang="fr" className="scroll-smooth">
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
    </html>
  );
}
