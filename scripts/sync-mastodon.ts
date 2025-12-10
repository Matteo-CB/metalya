import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const INSTANCE_URL = process.env.MASTODON_INSTANCE_URL;
const ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN;
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

// Délai de sécurité entre deux posts (en ms) pour être poli avec le serveur
// 2000ms (2 secondes) est très sûr. Vous pouvez tester 1000ms si vous voulez aller plus vite.
const SAFETY_DELAY_MS = 2000;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  if (!INSTANCE_URL || !ACCESS_TOKEN || !NEXT_PUBLIC_URL) {
    console.error("❌ ERREUR: Variables d'environnement manquantes.");
    process.exit(1);
  }

  console.log("🚀 Démarrage du Stress-Test Mastodon...");

  // 1. Récupérer TOUS les articles publiés
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" }, // Du plus récent au plus ancien (ou l'inverse selon votre choix)
  });

  console.log(`📦 ${posts.length} articles trouvés à poster.`);

  let successCount = 0;
  let errorCount = 0;

  for (const [index, post] of posts.entries()) {
    const postLink = `${NEXT_PUBLIC_URL}/posts/${post.slug}`;

    // Nettoyage des tags
    const tags = post.keywords || [];
    const hashtags = tags
      .map((t) => `#${t.replace(/[^a-zA-Z0-9]/g, "")}`)
      .slice(0, 5)
      .join(" ");

    const statusText = `${post.title}\n\n${
      post.excerpt || ""
    }\n\n${hashtags}\n\n👉 Lire : ${postLink}`;

    console.log(
      `\n[${index + 1}/${posts.length}] Envoi de : "${post.title.substring(
        0,
        30
      )}..."`
    );

    try {
      const response = await fetch(`${INSTANCE_URL}/api/v1/statuses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `test-${post.id}-${Date.now()}`, // Clé unique pour éviter les doublons accidentels
        },
        body: JSON.stringify({
          status: statusText,
          visibility: "public",
          language: "fr",
        }),
      });

      // --- ANALYSE DES HEADERS DE RATE LIMIT ---
      const limit = response.headers.get("X-RateLimit-Limit");
      const remaining = response.headers.get("X-RateLimit-Remaining");
      const reset = response.headers.get("X-RateLimit-Reset"); // Date du reset

      if (response.ok) {
        successCount++;
        console.log(`✅ Succès !`);
        if (remaining) {
          console.log(`📊 Limite restante : ${remaining} / ${limit}`);
        }
      } else {
        errorCount++;
        const errorText = await response.text();

        if (response.status === 429) {
          console.error(`⛔ RATE LIMIT ATTEINTE !`);
          if (reset) {
            const resetDate = new Date(reset); // Parfois c'est une date ISO, parfois un timestamp
            console.error(`⏳ Pause obligatoire jusqu'à : ${resetDate}`);
            // Ici, dans un vrai script de prod, on ferait un 'await sleep' jusqu'à la date de reset
          }
        } else {
          console.error(`❌ Erreur ${response.status}:`, errorText);
        }
      }
    } catch (error) {
      errorCount++;
      console.error("❌ Exception réseau :", error);
    }

    // Pause de sécurité
    if (index < posts.length - 1) {
      process.stdout.write(`💤 Attente de ${SAFETY_DELAY_MS / 1000}s... `);
      await sleep(SAFETY_DELAY_MS);
      process.stdout.write("OK\n");
    }
  }

  console.log("\n--- Bilan ---");
  console.log(`✅ Postés : ${successCount}`);
  console.log(`❌ Erreurs : ${errorCount}`);
  console.log("Terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
