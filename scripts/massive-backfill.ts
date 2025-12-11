import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

// Import des fonctions de publication
import { createDevToPost } from "../lib/devto";
import { createMastodonPost } from "../lib/mastodon";
import { createBlueskyPost } from "../lib/bluesky";
import { createTumblrPost } from "../lib/tumblr";
import { createPinterestPin } from "../lib/pinterest";
import { requestGoogleIndexing } from "../lib/google-indexing";
import { pingIndexNow } from "../lib/indexnow";

dotenv.config();

const prisma = new PrismaClient();
const LOG_FILE = path.join(process.cwd(), "backfill-log.json");
const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

// --- CONFIGURATION ---
const DEVTO_COOLDOWN = 305 * 1000; // 5 min 05 sec (Sécurité Dev.to)
const GLOBAL_DELAY = 10 * 1000; // 10 sec entre chaque article (Sécurité générale)

// --- MEMOIRE ---
let processedIds: string[] = [];
let lastDevToPostTime = 0;

async function loadLog() {
  try {
    const data = await fs.readFile(LOG_FILE, "utf-8");
    processedIds = JSON.parse(data);
    console.log(`📂 Reprise : ${processedIds.length} articles déjà traités.`);
  } catch (e) {
    console.log("📂 Aucun historique trouvé, démarrage à zéro.");
    processedIds = [];
  }
}

async function saveLog(id: string) {
  processedIds.push(id);
  await fs.writeFile(LOG_FILE, JSON.stringify(processedIds, null, 2));
}

// --- VERIFICATIONS API ---

// Récupère tous les articles Dev.to pour éviter les doublons (Check Canonique)
async function getExistingDevToUrls() {
  if (!process.env.DEVTO_API_KEY) return new Set<string>();
  console.log("🔍 Vérification de l'historique Dev.to...");

  const urls = new Set<string>();
  let page = 1;

  try {
    while (true) {
      const res = await fetch(
        `https://dev.to/api/articles/me/all?page=${page}&per_page=100`,
        {
          headers: { "api-key": process.env.DEVTO_API_KEY! },
        }
      );
      if (!res.ok) break;
      const data = await res.json();
      if (data.length === 0) break;

      data.forEach((article: any) => {
        if (article.canonical_url)
          urls.add(article.canonical_url.toLowerCase().replace(/\/$/, ""));
      });
      page++;
      await new Promise((r) => setTimeout(r, 200)); // Petit délai
    }
  } catch (e) {
    console.error("⚠️ Impossible de vérifier l'historique Dev.to", e);
  }
  return urls;
}

// Vérifie si un lien existe déjà sur Mastodon (via Recherche)
async function existsOnMastodon(url: string) {
  if (!process.env.MASTODON_INSTANCE_URL || !process.env.MASTODON_ACCESS_TOKEN)
    return false;
  try {
    const res = await fetch(
      `${
        process.env.MASTODON_INSTANCE_URL
      }/api/v2/search?q=${encodeURIComponent(url)}&type=statuses`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MASTODON_ACCESS_TOKEN}`,
        },
      }
    );
    const data = await res.json();
    return data.statuses && data.statuses.length > 0;
  } catch {
    return false;
  }
}

// --- FONCTION PRINCIPALE ---

async function main() {
  await loadLog();

  // 1. Récupération des articles publiés (du plus récent au plus ancien pour l'actu, ou l'inverse selon préférence)
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" }, // On traite les récents en premier
  });

  // 2. Pré-chargement historique Dev.to
  const devToHistory = await getExistingDevToUrls();

  console.log(`🚀 Démarrage du BACKFILL MASSIF sur ${posts.length} articles.`);
  console.log(
    "----------------------------------------------------------------"
  );

  for (const post of posts) {
    if (processedIds.includes(post.id)) {
      continue; // Déjà fait par ce script
    }

    const postLink = `${SITE_URL}/posts/${post.slug}`;
    const normalizedLink = postLink.toLowerCase().replace(/\/$/, "");

    console.log(`\n📦 Traitement : "${post.title}"`);

    const isTech = post.categories.includes("TECH");
    const promises = [];

    // --- A. DEV.TO (Tech uniquement + Rate Limit) ---
    if (isTech && process.env.DEVTO_API_KEY) {
      if (devToHistory.has(normalizedLink)) {
        console.log("   ⏭️  Dev.to : Déjà posté (Skip)");
      } else {
        // Gestion du délai 5 minutes
        const now = Date.now();
        const timeSinceLast = now - lastDevToPostTime;
        if (timeSinceLast < DEVTO_COOLDOWN) {
          const wait = DEVTO_COOLDOWN - timeSinceLast;
          console.log(
            `   ⏳ Dev.to Rate Limit : Attente de ${(wait / 1000).toFixed(
              0
            )}s...`
          );
          await new Promise((r) => setTimeout(r, wait));
        }

        console.log("   📤 Envoi vers Dev.to...");
        await createDevToPost({
          title: post.seoTitle || post.title,
          content: post.content,
          link: postLink,
          tags: post.keywords,
          coverImage: post.coverImage,
          description: post.seoDesc || post.excerpt,
        });
        lastDevToPostTime = Date.now();
      }
    }

    // --- B. MASTODON ---
    const mastodonExists = await existsOnMastodon(postLink);
    if (mastodonExists) {
      console.log("   ⏭️  Mastodon : Déjà posté (Skip)");
    } else {
      console.log("   📤 Envoi vers Mastodon...");
      promises.push(
        createMastodonPost({
          title: post.title,
          excerpt: post.excerpt,
          link: postLink,
          tags: post.keywords,
          imageUrl: post.coverImage,
        })
      );
    }

    // --- C. BLUESKY ---
    // Pas d'API de recherche facile, on envoie (Bluesky gère bien les doublons ou on assume)
    console.log("   📤 Envoi vers Bluesky...");
    promises.push(
      createBlueskyPost({
        title: post.title,
        description: post.excerpt,
        link: postLink,
        imageUrl: post.coverImage,
        category: post.categories[0] || "ACTUALITES",
        keywords: post.keywords,
      })
    );

    // --- D. TUMBLR ---
    console.log("   📤 Envoi vers Tumblr...");
    promises.push(
      createTumblrPost({
        title: post.title,
        excerpt: post.excerpt,
        link: postLink,
        imageUrl: post.coverImage,
        category: post.categories[0] || "ACTUALITES",
        keywords: post.keywords,
      })
    );

    // --- E. PINTEREST (Si image) ---
    if (post.coverImage) {
      console.log("   📤 Envoi vers Pinterest...");
      promises.push(
        createPinterestPin({
          title: post.title,
          description: post.excerpt,
          link: postLink,
          imageUrl: post.coverImage,
          category: post.categories[0],
          keywords: post.keywords,
          altText: post.seoTitle || post.title,
        })
      );
    }

    // --- F. SEO (IndexNow + Google) ---
    console.log("   🔎 Ping SEO (Google + Bing)...");
    promises.push(requestGoogleIndexing(postLink));
    promises.push(pingIndexNow(post.slug));

    // Exécution parallèle des réseaux rapides
    await Promise.allSettled(promises);

    // Sauvegarde et Pause
    await saveLog(post.id);
    console.log("   ✅ Fait.");

    // Petite pause de sécurité pour ne pas faire exploser le serveur ou les API rate limits
    if (promises.length > 0) {
      await new Promise((r) => setTimeout(r, GLOBAL_DELAY));
    }
  }

  console.log("\n🎉 BACKFILL TERMINÉ !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
