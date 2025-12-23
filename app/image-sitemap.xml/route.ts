import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

export async function GET() {
  // Récupère tous les articles publiés avec leurs images
  const posts = await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      // ASTUCE : On demande les images dont le lien est "plus grand que vide"
      // Cela élimine les null, les undefined et les chaines vides d'un coup.
      coverImage: {
        gt: "",
      },
    },
    select: {
      slug: true,
      title: true,
      coverImage: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 1000,
  });

  const xmlParts = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,
  ];

  posts.forEach((post) => {
    // Sécurité supplémentaire TypeScript
    if (!post.coverImage) return;

    xmlParts.push(`  <url>`);
    xmlParts.push(`    <loc>${BASE_URL}/posts/${post.slug}</loc>`);
    xmlParts.push(`    <image:image>`);
    xmlParts.push(`      <image:loc>${post.coverImage}</image:loc>`);
    xmlParts.push(`      <image:title><![CDATA[${post.title}]]></image:title>`);
    xmlParts.push(
      `      <image:caption><![CDATA[${post.title} - Metalya]]></image:caption>`
    );
    xmlParts.push(`    </image:image>`);
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
