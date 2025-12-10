import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { createPinterestPin } from "../lib/pinterest";

const prisma = new PrismaClient();

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

async function syncPosts() {
  console.log("🚀 Démarrage de la synchronisation Pinterest...");

  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      coverImage: { not: "" },
      categories: { isEmpty: false },
    },
  });

  console.log(`📦 ${posts.length} articles trouvés à traiter.`);

  let successCount = 0;
  let errorCount = 0;

  for (const post of posts) {
    console.log(`\n📌 Traitement : ${post.title}`);

    try {
      const category = post.categories[0];

      const result = await createPinterestPin({
        title: post.title,
        description: post.excerpt || post.title,
        link: `${NEXT_PUBLIC_URL}/posts/${post.slug}`,
        imageUrl: post.coverImage,
        category: category,
      });

      if (result) {
        console.log(`✅ Succès (ID: ${result.id})`);
        successCount++;
      } else {
        console.log("⚠️ Échec (API a retourné null)");
        errorCount++;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("❌ Erreur critique sur cet article :", error);
      errorCount++;
    }
  }

  console.log("\n========================================");
  console.log("🎉 SYNCHRONISATION TERMINÉE");
  console.log(`✅ Postés avec succès : ${successCount}`);
  console.log(`❌ Échecs : ${errorCount}`);
  console.log("========================================");

  await prisma.$disconnect();
}

syncPosts();
