import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getMediaLibrary } from "@/app/actions/media";
import { MediaGallery } from "@/components/admin/media-gallery";

export const metadata: Metadata = {
  title: "Médiathèque - Administration Metalya",
};

export default async function MediaPage() {
  // 1. Sécurité : Seul l'ADMIN peut voir la galerie complète
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  // 2. Récupération des données (Server-Side)
  // On charge les images côté serveur pour un affichage instantané
  const media = await getMediaLibrary();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Médiathèque</h1>
          <p className="text-neutral-500 mt-1">
            Gérez les images uploadées sur le site (Articles, Destinations,
            Stories). Les fichiers sont hébergés sur Vercel Blob.
          </p>
        </div>
        <div className="px-4 py-1 bg-neutral-100 rounded-full text-xs font-mono text-neutral-600">
          {media.length} Fichiers
        </div>
      </div>

      {/* Le composant Client qui gère l'interactivité */}
      <MediaGallery initialMedia={media} />
    </div>
  );
}
