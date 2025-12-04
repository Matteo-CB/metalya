import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

export async function GET() {
  // Récupérer les articles publiés il y a moins de 48 heures
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const posts = await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      createdAt: {
        gte: twoDaysAgo,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${posts
    .map((post) => {
      return `
  <url>
    <loc>${BASE_URL}/posts/${post.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Metalya</news:name>
        <news:language>fr</news:language>
      </news:publication>
      <news:publication_date>${post.createdAt.toISOString()}</news:publication_date>
      <news:title>${post.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")}</news:title>
    </news:news>
  </url>`;
    })
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
