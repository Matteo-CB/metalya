import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/profile/",
        "/settings/",
        "/reset-password/",
        "/forgot-password/",
        "/register/",
        "/login/",
        "/private/",
        "/web-stories/*/amp", // On laisse Google indexer via le sitemap, mais on évite le crawl sauvage si besoin (optionnel, je préfère laisser ouvert pour l'instant)
        "/.well-known/traffic-advice",
      ],
    },
    // Déclaration de TOUS les sitemaps
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/news-sitemap.xml`,
      `${BASE_URL}/image-sitemap.xml`,
      `${BASE_URL}/destinations-sitemap.xml`, // AJOUTÉ
      `${BASE_URL}/web-stories-sitemap.xml`, // AJOUTÉ
    ],
  };
}
