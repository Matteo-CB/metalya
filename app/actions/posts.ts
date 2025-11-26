"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, Category } from "@prisma/client";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function createPost(formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const coverImage = formData.get("coverImage") as string;
  const readingTime = Number(formData.get("readingTime"));

  // Récupération des catégories (checkboxes multiples)
  const categoriesRaw = formData.getAll("categories") as string[];
  const categories = categoriesRaw.map((cat) => cat as Category);

  if (!title || !content || !coverImage) {
    throw new Error("Champs manquants");
  }

  const slug = slugify(title);

  await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      readingTime: readingTime || 5,
      published: true,
      authorId: session.user.id!,
      seoTitle: title,
      seoDesc: excerpt,
      categories: categories, // Enregistrement des catégories
    },
  });

  revalidatePath("/");
  redirect(`/posts/${slug}`);
}
