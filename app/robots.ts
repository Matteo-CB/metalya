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
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
