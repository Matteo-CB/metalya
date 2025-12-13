import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { PinterestCard } from "@/components/admin/pinterest-card";
import { Share2 } from "lucide-react";

export default async function PinterestPage() {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== UserRole.ADMIN &&
      session.user.role !== UserRole.SUPER_ADMIN)
  ) {
    redirect("/");
  }

  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const siteUrl = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

  return (
    <div className="min-h-screen bg-neutral-50/50 pt-24 pb-24">
      <Container>
        <FadeIn>
          <div className="mb-12 flex flex-col items-center text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xl shadow-red-600/20">
              <Share2 size={32} />
            </div>
            <h1 className="font-serif text-4xl font-medium text-neutral-900 md:text-5xl">
              Pinterest Studio
            </h1>
            <p className="mt-4 max-w-xl text-lg text-neutral-500">
              Gérez manuellement vos épingles. Copiez le texte optimisé,
              téléchargez l'image et publiez sur Pinterest en un clic.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post) => (
              <PinterestCard key={post.id} post={post} siteUrl={siteUrl} />
            ))}
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
