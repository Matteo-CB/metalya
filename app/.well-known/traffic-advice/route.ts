import { NextResponse } from "next/server";

export async function GET() {
  // Configuration pour le "Private Prefetch Proxy" de Google Chrome
  const trafficAdvice = [
    {
      user_agent: "prefetch-proxy",
      google_prefetch_proxy_eap: {
        fraction: 1.0, // Autorise le préchargement pour 100% des utilisateurs (Vitesse maximale)
      },
    },
  ];

  return new NextResponse(JSON.stringify(trafficAdvice), {
    headers: {
      "Content-Type": "application/trafficadvice+json", // Type MIME obligatoire
      "Cache-Control": "public, max-age=86400", // Cache 24h
    },
  });
}
