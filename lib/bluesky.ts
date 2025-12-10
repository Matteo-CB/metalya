import { Category } from "@prisma/client";
import sharp from "sharp";

const BSKY_RPC_URL = "https://bsky.social/xrpc";

interface BlueskyPost {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  category: Category;
  keywords?: string[];
}

const CATEGORY_TAGS: Record<Category, string[]> = {
  TECH: ["Tech", "Innovation", "AI", "Futur", "Dev", "OpenSource"],
  VOYAGE: ["Voyage", "Travel", "Explore", "Nature", "Photography"],
  CULTURE: ["Culture", "Art", "Cinema", "History", "Review"],
  ACTUALITES: ["News", "Info", "Monde", "Society", "Media"],
};

async function getSession() {
  const identifier = process.env.BLUESKY_IDENTIFIER;
  const password = process.env.BLUESKY_PASSWORD;

  if (!identifier || !password) return null;

  try {
    const res = await fetch(
      `${BSKY_RPC_URL}/com.atproto.server.createSession`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function uploadImage(accessJwt: string, imageUrl: string) {
  try {
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) return null;

    const arrayBuffer = await imgRes.arrayBuffer();
    let buffer: any = Buffer.from(arrayBuffer);

    // Compression si > 900Ko
    if (buffer.length > 900 * 1024) {
      console.log(
        `📉 Compression Bluesky (${(buffer.length / 1024 / 1024).toFixed(
          2
        )}MB)...`
      );

      buffer = await sharp(buffer)
        .resize({ width: 1000, withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer();

      console.log(`✅ Compressée : ${(buffer.length / 1024).toFixed(2)}KB`);
    }

    // Sécurité si toujours > 976KB
    if (buffer.length > 976 * 1024) {
      buffer = await sharp(buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 60 })
        .toBuffer();
    }

    // ✅ SOLUTION PROPRE : Conversion explicite en Blob
    // fetch accepte nativement les Blobs sans erreur de type
    const blob = new Blob([buffer], { type: "image/jpeg" });

    const uploadRes = await fetch(
      `${BSKY_RPC_URL}/com.atproto.repo.uploadBlob`,
      {
        method: "POST",
        headers: {
          "Content-Type": "image/jpeg",
          Authorization: `Bearer ${accessJwt}`,
        },
        body: blob,
      }
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      console.error("❌ Erreur Upload Bluesky:", err);
      return null;
    }

    const data = await uploadRes.json();
    return data.blob;
  } catch (error) {
    console.error("Erreur traitement image:", error);
    return null;
  }
}

export async function createBlueskyPost({
  title,
  description,
  link,
  imageUrl,
  category,
  keywords = [],
}: BlueskyPost) {
  const session = await getSession();
  if (!session) {
    console.warn("⚠️ Bluesky: Échec authentification");
    return null;
  }

  const { accessJwt, did } = session;

  const imageBlob = await uploadImage(accessJwt, imageUrl);

  if (!imageBlob) {
    console.warn(
      "⚠️ Post Bluesky annulé car l'image n'a pas pu être uploadée."
    );
    return null;
  }

  const tags = [
    ...new Set([
      "Metalya",
      category.toLowerCase(),
      ...(CATEGORY_TAGS[category] || []),
      ...keywords,
    ]),
  ]
    .map((t) => `#${t.replace(/\s+/g, "")}`)
    .join(" ");

  const text = `${title}\n\n${tags}`;

  const postPayload = {
    repo: did,
    collection: "app.bsky.feed.post",
    record: {
      $type: "app.bsky.feed.post",
      text: text,
      createdAt: new Date().toISOString(),
      embed: {
        $type: "app.bsky.embed.external",
        external: {
          uri: link,
          title: title,
          description: description,
          thumb: imageBlob,
        },
      },
    },
  };

  try {
    const res = await fetch(`${BSKY_RPC_URL}/com.atproto.repo.createRecord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessJwt}`,
      },
      body: JSON.stringify(postPayload),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("❌ Erreur Bluesky:", err);
      return null;
    }

    const data = await res.json();
    console.log(`✅ Bluesky: Post créé (URI: ${data.uri})`);
    return data;
  } catch (error) {
    console.error("Erreur réseau Bluesky:", error);
    return null;
  }
}
