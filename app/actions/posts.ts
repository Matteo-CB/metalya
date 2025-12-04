"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, Category, PostStatus } from "@prisma/client";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function canAccessAdmin(role: UserRole) {
  const allowedRoles: UserRole[] = [
    UserRole.REDACTEUR,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ];
  return allowedRoles.includes(role);
}

export async function createPost(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canAccessAdmin(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const coverImage = formData.get("coverImage") as string;
  const readingTime = Number(formData.get("readingTime"));
  const action = formData.get("action") as string; // 'draft' ou 'publish'

  const categoriesRaw = formData.getAll("categories") as string[];
  const categories = categoriesRaw.map((cat) => cat as Category);

  if (!title) {
    throw new Error("Le titre est obligatoire");
  }

  const slug = slugify(title);

  // Détermination du statut initial
  let status: PostStatus = PostStatus.DRAFT;

  if (action === "publish") {
    if (session.user.role === UserRole.REDACTEUR) {
      status = PostStatus.PENDING; // Soumission pour validation
    } else if (
      session.user.role === UserRole.ADMIN ||
      session.user.role === UserRole.SUPER_ADMIN
    ) {
      status = PostStatus.PUBLISHED; // Publication directe
    }
  }
  // Si action === 'draft', on reste sur DRAFT

  await prisma.post.create({
    data: {
      title,
      slug,
      content: content || "",
      excerpt: excerpt || "",
      coverImage: coverImage || "",
      readingTime: readingTime || 5,
      status,
      authorId: session.user.id!,
      seoTitle: title,
      seoDesc: excerpt,
      categories: categories,
    },
  });

  revalidatePath("/");
  redirect(`/posts/${slug}`);
}

export async function updatePost(postId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Article introuvable");

  const userRole = session.user.role;
  const isAuthor = post.authorId === session.user.id;

  const isAdmin =
    userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN;
  const isRedacteurOwner = userRole === UserRole.REDACTEUR && isAuthor;

  // Vérification des permissions
  if (isRedacteurOwner) {
    // Un rédacteur peut modifier ses brouillons ET ses articles en attente
    // Mais pas ceux qui sont déjà publiés
    if (post.status === PostStatus.PUBLISHED) {
      throw new Error("Impossible de modifier un article déjà publié.");
    }
  } else if (!isAdmin) {
    throw new Error("Permission refusée");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const coverImage = formData.get("coverImage") as string;
  const readingTime = Number(formData.get("readingTime"));
  const action = formData.get("action") as string; // 'draft' ou 'publish'

  const categoriesRaw = formData.getAll("categories") as string[];
  const categories = categoriesRaw.map((cat) => cat as Category);

  // Gestion du changement de statut
  let status = post.status;

  if (action === "draft") {
    status = PostStatus.DRAFT; // Retour en brouillon
  } else if (action === "publish") {
    if (userRole === UserRole.REDACTEUR) {
      status = PostStatus.PENDING; // Soumission
    } else if (isAdmin) {
      status = PostStatus.PUBLISHED; // Publication
    }
  }

  const slug = slugify(title);

  await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      readingTime,
      categories,
      status,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath(`/posts/${slug}`);
  redirect(`/posts/${slug}`);
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Article introuvable");

  const userRole = session.user.role;
  const isAuthor = post.authorId === session.user.id;

  const isAdmin =
    userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN;
  const isRedacteurOwner = userRole === UserRole.REDACTEUR && isAuthor;

  if (isRedacteurOwner) {
    if (post.status === PostStatus.PUBLISHED) {
      throw new Error("Impossible de supprimer un article publié.");
    }
  } else if (!isAdmin) {
    throw new Error("Permission refusée");
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  revalidatePath("/");
  redirect("/");
}
