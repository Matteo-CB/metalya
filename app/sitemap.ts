import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    where: { status: PostStatus.PUBLISHED },
    select: { slug: true, updatedAt: true },
  });

  const authors = await prisma.user.findMany({
    where: {
      posts: {
        some: { status: PostStatus.PUBLISHED },
      },
    },
    select: { id: true, updatedAt: true },
  });

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const authorEntries: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${BASE_URL}/author/${author.id}`,
    lastModified: author.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/posts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/outils`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95, // Priorité très haute pour le Hub Outils
    },
    {
      url: `${BASE_URL}/outils/convertisseur-image`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9, // Priorité haute pour l'outil lui-même
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/category/actualites`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/category/tech`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/category/culture`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/category/voyage`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cgu`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [...staticEntries, ...postEntries, ...authorEntries];
}
