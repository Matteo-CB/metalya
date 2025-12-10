import { GoogleAuth } from "google-auth-library";

export async function requestGoogleIndexing(url: string) {
  // On récupère le contenu JSON directement depuis la variable
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    // Si la variable n'existe pas, on tente le fallback fichier (pour le local si besoin)
    // Mais idéalement, utilisez la variable partout.
    console.error(
      "❌ Google Indexing: Variable GOOGLE_SERVICE_ACCOUNT_KEY manquante"
    );
    return;
  }

  try {
    // On parse le JSON (car c'est une string dans le .env)
    const credentials = JSON.parse(serviceAccountKey);

    const auth = new GoogleAuth({
      credentials, // <--- On passe l'objet directement ici
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    const client = await auth.getClient();

    // On force le type 'any' car la librairie Google est stricte
    const res = await (client as any).request({
      url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
      method: "POST",
      data: {
        url: url,
        type: "URL_UPDATED",
      },
    });

    if (res.status === 200) {
      console.log(`✅ Google notifié pour : ${url}`);
    } else {
      console.error(`⚠️ Google Indexing Status: ${res.status}`);
    }
  } catch (error) {
    console.error("❌ Erreur Google Indexing:", error);
  }
}
