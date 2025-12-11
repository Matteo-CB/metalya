import { GoogleAuth } from "google-auth-library";

export async function requestGoogleIndexing(url: string) {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    console.error(
      "❌ Google Indexing: Variables GOOGLE_CLIENT_EMAIL ou GOOGLE_PRIVATE_KEY manquantes"
    );
    return;
  }

  try {
    // Reconstruction propre de l'objet credentials
    const credentials = {
      client_email: clientEmail,
      // On s'assure que les \n sont bien interprétés comme des sauts de ligne
      private_key: privateKey.replace(/\\n/g, "\n"),
    };

    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    const client = await auth.getClient();

    const res = await (client as any).request({
      url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
      method: "POST",
      data: {
        url: url,
        type: "URL_UPDATED",
      },
    });

    if (res.status === 200) {
      console.log(`✅ Google notifié : ${url}`);
    } else {
      console.error(`⚠️ Status Google : ${res.status}`);
    }
  } catch (error) {
    console.error("❌ Erreur Google Indexing :", error);
  }
}
