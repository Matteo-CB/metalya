import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: PostStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { author: true },
  });

  // 1. AJOUT DE L'ESPACE DE NOMS MEDIA (xmlns:media)
  const rssHeader = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/" 
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Metalya</title>
    <link>${BASE_URL}</link>
    <description>L'essentiel de la culture, tech et actualité. Analyses approfondies et guides experts.</description>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/logo.png</url>
      <title>Metalya</title>
      <link>${BASE_URL}</link>
    </image>`;

  const rssItems = posts
    .map((post) => {
      const postUrl = `${BASE_URL}/posts/${post.slug}`;
      const authorName = post.author.name || "Rédaction Metalya";
      const category = post.categories?.[0] || "Général";

      // 2. IMAGE OPTIMISÉE POUR FLIPBOARD (<media:content>)
      // Flipboard préfère ça à <enclosure>
      const mediaContent = post.coverImage
        ? `<media:content url="${post.coverImage}" medium="image" type="image/jpeg" />`
        : "";

      // 3. CONTENU RICHE (CDATA)
      // On met une image + l'excerpt pour que le lecteur Flipboard soit joli
      const htmlContent = `
        <figure><img src="${post.coverImage || ""}" /></figure>
        <p>${post.excerpt || ""}</p>
        <br />
        <a href="${postUrl}">Lire la suite sur Metalya</a>
      `;

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt || "")}</description>
      <dc:creator>${escapeXml(authorName)}</dc:creator>
      <category>${escapeXml(category)}</category>
      
      ${mediaContent}
      
      <content:encoded><![CDATA[${htmlContent}]]></content:encoded>
    </item>`;
    })
    .join("");

  const rssFooter = `
  </channel>
</rss>`;

  return new Response(rssHeader + rssItems + rssFooter, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
