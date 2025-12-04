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
    where: { status: PostStatus.PUBLISHED }, // Correction ici
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { author: true },
  });

  const rssHeader = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
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

      const imageEnclosure = post.coverImage
        ? `<enclosure url="${post.coverImage}" type="image/jpeg" />`
        : "";

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt || "")}</description>
      <dc:creator>${escapeXml(
        post.author.name || "Rédaction Metalya"
      )}</dc:creator>
      <category>${escapeXml(post.categories?.[0] || "Général")}</category>
      ${imageEnclosure}
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
