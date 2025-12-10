interface DevToPostParams {
  title: string;
  content: string;
  link: string;
  tags: string[];
  coverImage?: string;
  description?: string;
}

export async function createDevToPost({
  title,
  content,
  link,
  tags,
  coverImage,
  description,
}: DevToPostParams) {
  const apiKey = process.env.DEVTO_API_KEY;

  if (!apiKey) return;

  try {
    // Dev.to accepte max 4 tags, alphanumériques seulement
    const formattedTags = tags
      .map((t) => t.replace(/[^a-zA-Z0-9]/g, ""))
      .slice(0, 4);

    // On ajoute un lien canonique vers ton site pour le SEO (très important)
    const footer = `\n\n---\n\nCet article a été publié initialement sur [Metalya](${link}).\n\n[> Lire l'article original pour plus de détails](${link})`;
    const fullContent = `${content}${footer}`;

    const response = await fetch("https://dev.to/api/articles", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        article: {
          title,
          body_markdown: fullContent,
          published: true,
          main_image: coverImage,
          canonical_url: link,
          tags: formattedTags,
          description,
        },
      }),
    });

    if (!response.ok) {
      console.error("Dev.to Error:", await response.text());
    } else {
      console.log("✅ Posté sur Dev.to");
    }
  } catch (error) {
    console.error("Dev.to Exception:", error);
  }
}
