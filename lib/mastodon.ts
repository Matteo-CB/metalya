interface MastodonPostParams {
  title: string;
  excerpt: string;
  link: string;
  tags: string[];
  imageUrl?: string; // Optionnel
}

export async function createMastodonPost({
  title,
  excerpt,
  link,
  tags,
  imageUrl,
}: MastodonPostParams) {
  const instanceUrl = process.env.MASTODON_INSTANCE_URL;
  const accessToken = process.env.MASTODON_ACCESS_TOKEN;

  if (!instanceUrl || !accessToken) return;

  try {
    let mediaId: string | null = null;

    // ÉTAPE 1 : Si on a une image, on l'upload d'abord
    if (imageUrl) {
      try {
        console.log(`📤 Upload de l'image Mastodon : ${imageUrl}`);

        // 1. On récupère l'image binaire depuis votre site/CDN
        const imageFetch = await fetch(imageUrl);
        if (imageFetch.ok) {
          const imageBlob = await imageFetch.blob();

          // 2. On prépare le formulaire pour Mastodon
          const formData = new FormData();
          formData.append("file", imageBlob);
          formData.append("description", title); // Texte alt pour l'accessibilité

          // 3. Envoi au endpoint média
          const uploadResponse = await fetch(`${instanceUrl}/api/v2/media`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });

          if (uploadResponse.ok) {
            const data = await uploadResponse.json();
            mediaId = data.id; // On récupère l'ID pour l'attacher au post
          } else {
            console.error(
              "Erreur upload média Mastodon:",
              await uploadResponse.text()
            );
          }
        }
      } catch (e) {
        console.error("Impossible de récupérer l'image pour Mastodon:", e);
        // On continue même si l'image échoue, on fera un post texte simple
      }
    }

    // ÉTAPE 2 : On poste le statut (avec ou sans l'image)
    const hashtags = tags
      .map((t) => `#${t.replace(/[^a-zA-Z0-9]/g, "")}`)
      .slice(0, 5)
      .join(" ");

    const status = `${title}\n\n${excerpt}\n\n${hashtags}\n\n👉 Lire l'article : ${link}`;

    const payload: any = {
      status,
      visibility: "public",
      language: "fr",
    };

    // Si on a réussi à upload l'image, on l'attache
    if (mediaId) {
      payload.media_ids = [mediaId];
    }

    const response = await fetch(`${instanceUrl}/api/v1/statuses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `post-${Date.now()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Mastodon Error:", await response.text());
    } else {
      console.log("✅ Posté sur Mastodon (avec image native)");
    }
  } catch (error) {
    console.error("Mastodon Exception:", error);
  }
}
