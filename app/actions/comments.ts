"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createComment(postId: string, content: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Vous devez être connecté pour commenter." };
  }

  if (!content || content.trim().length < 3) {
    return { error: "Le commentaire est trop court." };
  }

  try {
    await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id!,
      },
    });
    revalidatePath(`/posts/[slug]`, "page");
    return { success: "Commentaire ajouté." };
  } catch (error) {
    return { error: "Erreur lors de l'ajout du commentaire." };
  }
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Non autorisé" };

  const isAdmin =
    session.user.role === UserRole.ADMIN ||
    session.user.role === UserRole.SUPER_ADMIN;

  if (!isAdmin) {
    return { error: "Permission refusée." };
  }

  try {
    await prisma.comment.delete({
      where: { id: commentId },
    });
    revalidatePath(`/posts/[slug]`, "page");
    return { success: "Commentaire supprimé." };
  } catch (error) {
    return { error: "Erreur lors de la suppression." };
  }
}
