import { DESTINATIONS } from "@/lib/destinations-data";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

export async function GET() {
  const xmlParts = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ];

  const currentDate = new Date().toISOString();

  DESTINATIONS.forEach((city) => {
    xmlParts.push(`  <url>`);
    // Note : On pointe vers la version AMP car c'est celle que Google indexe le mieux pour les stories
    xmlParts.push(`    <loc>${BASE_URL}/web-stories/${city.slug}/amp</loc>`);
    xmlParts.push(`    <lastmod>${currentDate}</lastmod>`);
    xmlParts.push(`    <changefreq>weekly</changefreq>`);
    xmlParts.push(`    <priority>0.9</priority>`);
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
