import { DESTINATIONS } from "@/lib/destinations-data";
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

export async function GET() {
  const xmlParts = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ];

  const currentDate = new Date().toISOString();

  // 1. AJOUTER LES STORIES "DESTINATIONS" (Tourisme)
  DESTINATIONS.forEach((city) => {
    xmlParts.push(`  <url>`);
    // On pointe vers la version AMP car c'est celle que Google veut dans Discover
    xmlParts.push(`    <loc>${BASE_URL}/web-stories/${city.slug}/amp</loc>`);
    xmlParts.push(`    <lastmod>${currentDate}</lastmod>`);
    xmlParts.push(`    <changefreq>weekly</changefreq>`);
    xmlParts.push(`    <priority>0.9</priority>`);
    xmlParts.push(`  </url>`);
  });

  // 2. AJOUTER LES STORIES "ARTICLES DE BLOG" (Contenu)
  // On récupère les 50 derniers articles publiés pour en faire des stories
  const recentPosts = await prisma.post.findMany({
    where: { status: PostStatus.PUBLISHED },
    select: { slug: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  recentPosts.forEach((post) => {
    xmlParts.push(`  <url>`);
    // Lien vers la version AMP de la story générée depuis l'article
    xmlParts.push(`    <loc>${BASE_URL}/web-stories/${post.slug}/amp</loc>`);
    xmlParts.push(`    <lastmod>${post.updatedAt.toISOString()}</lastmod>`);
    xmlParts.push(`    <changefreq>monthly</changefreq>`);
    xmlParts.push(`    <priority>0.7</priority>`);
    xmlParts.push(`  </url>`);
  });

  xmlParts.push(`</urlset>`);

  return new Response(xmlParts.join("\n"), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
