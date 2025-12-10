import { PrismaClient } from "@prisma/client";
import { createDevToPost } from "../lib/devto";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const DEVTO_API_KEY = process.env.DEVTO_API_KEY;
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

// Délai de 305 secondes pour être sûr de respecter la limite de 300s
const RATE_LIMIT_DELAY_MS = 305 * 1000;

async function getDevToArticles() {
  const articles: any[] = [];
  let page = 1;
  const perPage = 100; // Max autorisé par page souvent 1000, mais 100 est sûr

  console.log("🔍 Récupération des articles existants sur Dev.to...");

  try {
    while (true) {
      const response = await fetch(
        `https://dev.to/api/articles/me/all?page=${page}&per_page=${perPage}`,
        {
          headers: {
            "api-key": DEVTO_API_KEY!,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Erreur lors de la récupération Dev.to:",
          await response.text()
        );
        break;
      }

      const pageArticles = await response.json();
      if (pageArticles.length === 0) break;

      articles.push(...pageArticles);
      page++;

      // Petite pause pour ne pas spammer la lecture
      await new Promise((r) => setTimeout(r, 500));
    }
  } catch (error) {
    console.error("Exception fetch Dev.to:", error);
  }

  return articles;
}

function normalizeUrl(url: string) {
  return url.replace(/\/$/, "").toLowerCase();
}

async function main() {
  if (!DEVTO_API_KEY || !NEXT_PUBLIC_URL) {
    console.error(
      "❌ ERREUR: DEVTO_API_KEY ou NEXT_PUBLIC_URL manquant dans .env"
    );
    process.exit(1);
  }

  console.log(
    "🚀 Démarrage de la synchro intelligente Dev.to (Mode Tech & Rate Limit)..."
  );

  // 1. Récupérer tous les articles 'TECH' de la base locale
  const localPosts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      categories: {
        has: "TECH",
      },
    },
    orderBy: {
      createdAt: "desc", // On commence par les plus récents
    },
  });

  if (localPosts.length === 0) {
    console.log("⚠️ Aucun article TECH trouvé localement.");
    process.exit(0);
  }

  // 2. Récupérer les articles existants sur Dev.to pour éviter les doublons
  const remoteArticles = await getDevToArticles();

  // Créer un Set des canonical_urls existants pour recherche rapide O(1)
  const existingCanonicals = new Set(
    remoteArticles
      .map((a: any) => (a.canonical_url ? normalizeUrl(a.canonical_url) : null))
      .filter(Boolean)
  );

  console.log(
    `📊 Bilan : ${localPosts.length} articles locaux vs ${remoteArticles.length} articles sur Dev.to`
  );

  let processedCount = 0;

  for (const post of localPosts) {
    const postLink = `${NEXT_PUBLIC_URL}/posts/${post.slug}`;
    const normalizedLink = normalizeUrl(postLink);

    // 3. Vérification anti-doublon
    if (existingCanonicals.has(normalizedLink)) {
      console.log(`⏭️  Déjà publié (SKIP) : ${post.title}`);
      continue;
    }

    console.log(`\n📤 Envoi en cours : ${post.title}`);

    // 4. Envoi
    await createDevToPost({
      title: post.seoTitle || post.title,
      content: post.content,
      link: postLink,
      tags: post.keywords || [],
      coverImage: post.coverImage,
      description: post.seoDesc || post.excerpt,
    });

    processedCount++;

    // 5. Attente stricte pour Rate Limit
    // On n'attend que s'il reste des articles à traiter
    if (processedCount < localPosts.length) {
      console.log(
        `⏳ Attente de ${
          RATE_LIMIT_DELAY_MS / 1000
        }s pour respecter la limite Dev.to...`
      );
      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY_MS));
    }
  }

  console.log("\n✅ Synchro terminée avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
