import { PrismaClient } from "@prisma/client";
import { requestGoogleIndexing } from "../lib/google-indexing";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

// Délai entre chaque requête (1.5s)
const DELAY_MS = 1500;

async function main() {
  console.log("🚀 Démarrage de l'indexation massive Google...");

  // 1. Récupérer tous les articles publiés
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });

  console.log(`📦 ${posts.length} articles à indexer.`);

  let successCount = 0;

  for (const [index, post] of posts.entries()) {
    const postUrl = `${SITE_URL}/posts/${post.slug}`;
    const storyUrl = `${SITE_URL}/web-stories/${post.slug}`;

    console.log(`\n[${index + 1}/${posts.length}] 📄 ${post.title}`);

    // 2. Envoyer l'article
    await requestGoogleIndexing(postUrl);

    // 3. Envoyer la Web Story
    await new Promise((resolve) => setTimeout(resolve, 500));
    await requestGoogleIndexing(storyUrl);

    successCount++;

    // 4. Pause de sécurité
    if (index < posts.length - 1) {
      process.stdout.write(`⏳ Attente ${DELAY_MS}ms... `);
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      console.log("OK");
    }
  }

  console.log("\n-----------------------------------");
  console.log(`✅ Terminé ! ${successCount} articles notifiés à Google.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
