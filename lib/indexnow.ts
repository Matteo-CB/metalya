const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";
const INDEXNOW_KEY = "4329a9973809436a9926b05537559133"; // Doit correspondre à la route créée

export async function pingIndexNow(slug: string) {
  if (process.env.NODE_ENV !== "production") return;

  const urlToPing = `${SITE_URL}/posts/${slug}`;
  const endpoint = "https://api.indexnow.org/indexnow";

  const data = {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: [urlToPing],
  };

  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data),
    });
    console.log(`🚀 IndexNow pingé pour : ${urlToPing}`);
  } catch (error) {
    console.error("Erreur IndexNow:", error);
  }
}
