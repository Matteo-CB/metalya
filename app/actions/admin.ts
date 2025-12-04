"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, PostStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updatePostStatus(postId: string, newStatus: PostStatus) {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== UserRole.ADMIN &&
      session.user.role !== UserRole.SUPER_ADMIN)
  ) {
    return { error: "Non autorisé." };
  }

  try {
    await prisma.post.update({
      where: { id: postId },
      data: { status: newStatus },
    });
    revalidatePath("/admin/posts");
    revalidatePath("/");
    return { success: "Statut mis à jour." };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour." };
  }
}

export async function deletePostAdmin(postId: string) {
  const session = await auth();

  if (!session?.user) return { error: "Non connecté." };

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { error: "Article introuvable." };

  const isAdmin =
    session.user.role === UserRole.ADMIN ||
    session.user.role === UserRole.SUPER_ADMIN;
  const isOwner = post.authorId === session.user.id;

  if (!isAdmin && (!isOwner || post.status === PostStatus.PUBLISHED)) {
    return { error: "Permission refusée." };
  }

  try {
    await prisma.post.delete({ where: { id: postId } });
    revalidatePath("/admin/posts");
    return { success: "Article supprimé." };
  } catch (error) {
    return { error: "Erreur lors de la suppression." };
  }
}
