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
        "/private/", // Sécurité supplémentaire
      ],
    },
    // On déclare TOUS les sitemaps pour maximiser la couverture
    sitemap: [`${BASE_URL}/sitemap.xml`, `${BASE_URL}/news-sitemap.xml`],
  };
}
