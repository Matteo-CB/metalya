"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, Category, PostStatus } from "@prisma/client";
import { pingIndexNow } from "@/lib/indexnow";
import { createBlueskyPost } from "@/lib/bluesky";

import { requestGoogleIndexing } from "@/lib/google-indexing";

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

async function distributeToSocials(post: {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  seoTitle?: string;
  seoDesc?: string;
  categories: Category[];
  keywords: string[];
}) {
  const postLink = `${process.env.NEXT_PUBLIC_URL}/posts/${post.slug}`;
  const storyLink = `${process.env.NEXT_PUBLIC_URL}/web-stories/${post.slug}`;

  const mainCategory =
    post.categories && post.categories.length > 0
      ? post.categories[0]
      : "ACTUALITES";

  const meta = {
    title: post.seoTitle || post.title,
    desc: post.seoDesc || post.excerpt || post.title,
    img: post.coverImage,
    link: postLink,
    cat: mainCategory as Category,
    keys: post.keywords || [],
  };

  try {
    await Promise.allSettled([
      pingIndexNow(post.slug),
      requestGoogleIndexing(postLink),
      requestGoogleIndexing(storyLink),

    

      post.coverImage
        ? createBlueskyPost({
            title: post.title,
            description: meta.desc,
            link: meta.link,
            imageUrl: meta.img,
            category: meta.cat,
            keywords: meta.keys,
          })
        : Promise.resolve(),
    ]);
  } catch (error) {
    console.error("Social distribution failed:", error);
  }
}

export async function createPost(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canAccessAdmin(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  // Récupération du slug manuel
  const slugInput = formData.get("slug") as string;

  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const coverImage = formData.get("coverImage") as string;
  const readingTime = Number(formData.get("readingTime"));
  const action = formData.get("action") as string;
  const seoTitle = formData.get("seoTitle") as string;
  const seoDesc = formData.get("seoDesc") as string;
  const keywordsRaw = formData.get("keywords") as string;

  const categoriesRaw = formData.getAll("categories") as string[];
  const categories = categoriesRaw.map((cat) => cat as Category);
  const keywords = keywordsRaw
    ? keywordsRaw.split(",").map((k) => k.trim())
    : [];

  if (!title) {
    throw new Error("Le titre est obligatoire");
  }

  // Si slugInput est vide, on génère depuis le titre, sinon on nettoie l'input
  let slug = slugInput ? slugify(slugInput) : slugify(title);

  // Vérification basique d'unicité (pour éviter crash DB, on ajoute un suffixe si auto, mais on bloque si manuel)
  if (slugInput) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      throw new Error(
        "Ce slug est déjà utilisé. Veuillez en choisir un autre."
      );
    }
  } else {
    // Logique auto-increment seulement si génération automatique
    let baseSlug = slug;
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  let status: PostStatus = PostStatus.DRAFT;

  if (action === "publish") {
    if (session.user.role === UserRole.REDACTEUR) {
      status = PostStatus.PENDING;
    } else if (
      session.user.role === UserRole.ADMIN ||
      session.user.role === UserRole.SUPER_ADMIN
    ) {
      status = PostStatus.PUBLISHED;
    }
  }

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
      seoTitle: seoTitle || title,
      seoDesc: seoDesc || excerpt,
      keywords,
      categories: categories,
    },
  });

  if (status === PostStatus.PUBLISHED) {
    distributeToSocials({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      seoTitle,
      seoDesc,
      categories,
      keywords,
    });
  }

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

  if (isRedacteurOwner) {
    if (post.status === PostStatus.PUBLISHED) {
      throw new Error("Impossible de modifier un article déjà publié.");
    }
  } else if (!isAdmin) {
    throw new Error("Permission refusée");
  }

  const title = formData.get("title") as string;
  const slugInput = formData.get("slug") as string;

  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const coverImage = formData.get("coverImage") as string;
  const readingTime = Number(formData.get("readingTime"));
  const action = formData.get("action") as string;
  const seoTitle = formData.get("seoTitle") as string;
  const seoDesc = formData.get("seoDesc") as string;
  const keywordsRaw = formData.get("keywords") as string;

  const categoriesRaw = formData.getAll("categories") as string[];
  const categories = categoriesRaw.map((cat) => cat as Category);
  const keywords = keywordsRaw
    ? keywordsRaw.split(",").map((k) => k.trim())
    : [];

  let status = post.status;

  if (action === "draft") {
    status = PostStatus.DRAFT;
  } else if (action === "publish") {
    if (userRole === UserRole.REDACTEUR) {
      status = PostStatus.PENDING;
    } else if (isAdmin) {
      status = PostStatus.PUBLISHED;
    }
  }

  // Gestion du slug en update
  let slug = post.slug; // Par défaut on garde l'ancien
  if (slugInput && slugInput !== post.slug) {
    const newSlug = slugify(slugInput);
    const existing = await prisma.post.findUnique({ where: { slug: newSlug } });
    if (existing) {
      throw new Error("Ce slug est déjà pris.");
    }
    slug = newSlug;
  } else if (!slugInput && title !== post.title) {
    // Si pas de slug fourni et titre changé, on peut regénérer (ou garder l'ancien, ici je garde l'ancien pour ne pas casser les liens sauf demande explicite)
    // slug = slugify(title);
  }

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
      seoTitle: seoTitle || title,
      seoDesc: seoDesc || excerpt,
      keywords,
      updatedAt: new Date(),
    },
  });

  if (status === PostStatus.PUBLISHED) {
    distributeToSocials({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      seoTitle,
      seoDesc,
      categories,
      keywords,
    });
  }

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
