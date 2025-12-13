"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, Category, PostStatus } from "@prisma/client";
import { pingIndexNow } from "@/lib/indexnow";
import { createTumblrPost } from "@/lib/tumblr";
import { createBlueskyPost } from "@/lib/bluesky";
import { createMastodonPost } from "@/lib/mastodon";
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

      createMastodonPost({
        title: meta.title,
        excerpt: meta.desc,
        link: meta.link,
        tags: meta.keys,
        imageUrl: meta.img,
      }),

      post.coverImage
        ? createTumblrPost({
            title: post.title,
            excerpt: meta.desc,
            link: meta.link,
            imageUrl: meta.img,
            category: meta.cat,
            keywords: meta.keys,
          })
        : Promise.resolve(),

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

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
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
