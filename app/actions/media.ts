"use server";

import { put } from "@vercel/blob";

export async function uploadImage(formData: FormData) {
  const image = formData.get("file") as File;
  const blob = await put(`articles/${image.name}`, image, {
    access: "public",
  });
  return blob.url;
}
