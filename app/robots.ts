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
        "/.well-known/traffic-advice", // On laisse l'accès au fichier lui-même, mais pas besoin de le crawler comme une page
      ],
    },
    // Déclaration de TOUS les sitemaps (Général + News + Images)
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/news-sitemap.xml`,
      `${BASE_URL}/image-sitemap.xml`, // <<< AJOUT CRUCIAL
    ],
  };
}
