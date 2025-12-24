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
    xmlParts.push(`    <loc>${BASE_URL}/destinations/${city.slug}</loc>`);
    xmlParts.push(`    <lastmod>${currentDate}</lastmod>`);
    xmlParts.push(`    <changefreq>monthly</changefreq>`);
    xmlParts.push(`    <priority>0.8</priority>`);
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
