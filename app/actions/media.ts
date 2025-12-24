"use server";

import { auth } from "@/auth";
import { put, list, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import path from "path";

/**
 * Vérifie si l'utilisateur est connecté et possède le rôle ADMIN.
 * Utilisé uniquement pour protéger la suppression et le listing global.
 */
async function checkAdminAccess() {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Vous devez être connecté.");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Accès refusé. Réservé aux administrateurs.");
  }

  return session;
}

/**
 * Upload une image avec optimisation (Sharp).
 * PUBLIC/AUTH : Pas de restriction ADMIN ici (accessible aux rédacteurs).
 */
export async function uploadImage(formData: FormData) {
  const image = formData.get("file") as File;
  if (!image) {
    throw new Error("Aucun fichier fourni.");
  }

  // 1. Conversion du fichier en Buffer pour Sharp
  const buffer = Buffer.from(await image.arrayBuffer());

  // 2. Optimisation : Resize max 1600px + Conversion WebP (Qualité 80)
  const optimizedBuffer = await sharp(buffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // 3. Préparation du chemin (dossier 'articles/')
  const originalName = path.parse(image.name).name;
  // Nettoyage du nom de fichier pour éviter les caractères spéciaux
  const cleanName = originalName.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  const filename = `${cleanName}.webp`;
  const filePath = `articles/${filename}`;

  // 4. Vérification intelligente des doublons
  // On regarde si une image avec ce nom existe déjà pour éviter de la ré-uploader
  const { blobs } = await list({
    prefix: filePath,
    limit: 1,
  });

  const existingBlob = blobs.find((blob) => blob.pathname === filePath);

  if (existingBlob) {
    // Si elle existe, on renvoie direct son URL (gain de temps et de stockage)
    return existingBlob.url;
  }

  // 5. Envoi vers Vercel Blob
  const blob = await put(filePath, optimizedBuffer, {
    access: "public",
    contentType: "image/webp",
    addRandomSuffix: false, // Important pour le SEO des images : garde le nom propre
  });

  // 6. On rafraîchit la page admin (au cas où l'admin regarde la galerie en même temps)
  revalidatePath("/admin/media");

  return blob.url;
}

/**
 * Récupère la bibliothèque complète d'images.
 * SÉCURISÉ : Réservé à l'Admin pour la page de gestion.
 */
export async function getMediaLibrary() {
  await checkAdminAccess();

  // On récupère jusqu'à 500 images pour la galerie
  const { blobs } = await list({ limit: 500 });
  return blobs;
}

/**
 * Supprime une image définitivement.
 * SÉCURISÉ : Réservé à l'Admin.
 */
export async function deleteMedia(url: string) {
  await checkAdminAccess();

  await del(url);

  // Mise à jour immédiate de la grille d'images
  revalidatePath("/admin/media");
}
