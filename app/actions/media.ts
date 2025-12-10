"use server";

import { put, list } from "@vercel/blob";
import sharp from "sharp";
import path from "path";

export async function uploadImage(formData: FormData) {
  const image = formData.get("file") as File;
  const buffer = Buffer.from(await image.arrayBuffer());

  const optimizedBuffer = await sharp(buffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const originalName = path.parse(image.name).name;
  const filename = `${originalName}.webp`;
  const filePath = `articles/${filename}`;

  const { blobs } = await list({
    prefix: filePath,
    limit: 1,
  });

  const existingBlob = blobs.find((blob) => blob.pathname === filePath);

  if (existingBlob) {
    return existingBlob.url;
  }

  const blob = await put(filePath, optimizedBuffer, {
    access: "public",
    contentType: "image/webp",
  });

  return blob.url;
}
