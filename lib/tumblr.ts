import crypto from "crypto";
import { Category } from "@prisma/client";

const TUMBLR_API_BASE = "https://api.tumblr.com/v2";

const CATEGORY_TAGS: Record<Category, string[]> = {
  TECH: ["Tech", "Innovation", "Futur", "Gadget", "AI", "Cyberpunk", "Geek"],
  VOYAGE: [
    "Voyage",
    "Travel",
    "Wanderlust",
    "Explore",
    "Photography",
    "Nature",
    "Trip",
  ],
  CULTURE: [
    "Culture",
    "Art",
    "Inspiration",
    "History",
    "Books",
    "Cinema",
    "Aesthetics",
  ],
  ACTUALITES: [
    "News",
    "Actualités",
    "Monde",
    "Society",
    "Journalism",
    "Info",
    "Trend",
  ],
};

interface TumblrPost {
  title: string;
  excerpt: string;
  link: string;
  imageUrl: string;
  category: Category;
  keywords?: string[];
}

function generateNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}

function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/\*/g, "%2A")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

function signRequest(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const parts = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(
      Object.keys(params)
        .sort()
        .map((key) => `${percentEncode(key)}=${percentEncode(params[key])}`)
        .join("&")
    ),
  ];

  const baseString = parts.join("&");
  const key = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;

  return crypto.createHmac("sha1", key).update(baseString).digest("base64");
}

export async function createTumblrPost({
  title,
  excerpt,
  link,
  imageUrl,
  category,
  keywords = [],
}: TumblrPost) {
  const consumerKey = process.env.TUMBLR_CONSUMER_KEY;
  const consumerSecret = process.env.TUMBLR_CONSUMER_SECRET;
  const token = process.env.TUMBLR_TOKEN;
  const tokenSecret = process.env.TUMBLR_TOKEN_SECRET;
  const blogIdentifier = process.env.TUMBLR_BLOG_ID;

  if (
    !consumerKey ||
    !consumerSecret ||
    !token ||
    !tokenSecret ||
    !blogIdentifier
  ) {
    console.warn("⚠️ Tumblr: Identifiants manquants");
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
    .map((t) => t.replace(/\s+/g, ""))
    .join(",");

  const captionHtml = `
    <h2><a href="${link}" style="text-decoration:none; color:inherit;">${title}</a></h2>
    <blockquote>${excerpt}</blockquote>
    <p>
      <a href="${link}">👉 <b>Lire l'article complet sur Metalya</b></a>
    </p>
    <p><i>#${category} #Metalya</i></p>
  `;

  const url = `${TUMBLR_API_BASE}/blog/${blogIdentifier}/post`;

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_token: token,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: generateTimestamp(),
    oauth_nonce: generateNonce(),
    oauth_version: "1.0",
  };

  const bodyParams: Record<string, string> = {
    type: "photo",
    source: imageUrl,
    caption: captionHtml,
    link: link,
    tags: tags,
  };

  const signatureParams = { ...oauthParams, ...bodyParams };
  const signature = signRequest(
    "POST",
    url,
    signatureParams,
    consumerSecret,
    tokenSecret
  );

  const authHeader = `OAuth ${Object.keys(oauthParams)
    .map(
      (key) =>
        `${key}="${percentEncode(
          key === "oauth_signature" ? signature : oauthParams[key]
        )}"`
    )
    .join(", ")}, oauth_signature="${percentEncode(signature)}"`;

  try {
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(bodyParams)) {
      formData.append(key, value);
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Erreur Tumblr:", errText);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Tumblr: Post créé (ID: ${data.response.id})`);
    return data;
  } catch (error) {
    console.error("Erreur réseau Tumblr:", error);
    return null;
  }
}
