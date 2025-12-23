import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
    take: 50, // On prend large pour nourrir les agrégateurs
  });

  // Construction manuelle du XML pour un contrôle total sur les namespaces (media, content, atom)
  const xmlParts = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:dc="http://purl.org/dc/elements/1.1/">`,
    `  <channel>`,
    `    <title>Metalya - Tech, Culture & Voyage</title>`,
    `    <description>Une vision analytique sur l'actualité, la culture, la tech et l'exploration.</description>`,
    `    <link>${BASE_URL}</link>`,
    `    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>`,
    `    <language>fr-FR</language>`,
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `    <image>`,
    `      <url>${BASE_URL}/logo.png</url>`,
    `      <title>Metalya</title>`,
    `      <link>${BASE_URL}</link>`,
    `    </image>`,
  ];

  posts.forEach((post) => {
    // Nettoyage basique du contenu pour le flux (optionnel, selon ta structure de DB)
    // On assume que post.content est du Markdown ou HTML.
    // Pour content:encoded, l'idéal est de mettre le HTML rendu, mais ici on met l'excerpt ou le contenu brut encapsulé en CDATA.

    const postUrl = `${BASE_URL}/posts/${post.slug}`;
    const coverImage = post.coverImage || `${BASE_URL}/og-image.jpg`;

    xmlParts.push(`    <item>`);
    xmlParts.push(`      <title><![CDATA[${post.title}]]></title>`);
    xmlParts.push(`      <link>${postUrl}</link>`);
    xmlParts.push(`      <guid isPermaLink="true">${postUrl}</guid>`);
    xmlParts.push(
      `      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>`
    );
    xmlParts.push(
      `      <dc:creator><![CDATA[${
        post.author?.name || "Rédaction Metalya"
      }]]></dc:creator>`
    );

    // Catégories (Crucial pour le ciblage sémantique)
    post.categories.forEach((cat) => {
      xmlParts.push(`      <category><![CDATA[${cat}]]></category>`);
    });

    // Description courte
    xmlParts.push(
      `      <description><![CDATA[${post.excerpt || ""}]]></description>`
    );

    // Contenu complet (Pour les liseuses et l'analyse sémantique Google)
    // Attention: Si ton contenu est en Markdown brut, c'est mieux de le laisser, les parsers gèrent souvent.
    if (post.content) {
      xmlParts.push(
        `      <content:encoded><![CDATA[${post.content}]]></content:encoded>`
      );
    }

    // L'arme secrète : Media Content pour Flipboard/Google News
    // Cela force l'affichage de l'image en grand dans les agrégateurs
    xmlParts.push(
      `      <media:content url="${coverImage}" medium="image" type="image/jpeg" width="1200">`
    );
    xmlParts.push(
      `        <media:description type="plain"><![CDATA[${post.title}]]></media:description>`
    );
    xmlParts.push(`      </media:content>`);

    xmlParts.push(`    </item>`);
  });

  xmlParts.push(`  </channel>`);
  xmlParts.push(`</rss>`);

  return new Response(xmlParts.join("\n"), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Cache agressif pour soulager la DB, mais revalidate toutes les heures
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
    },
  });
}
