import { GoogleAuth } from "google-auth-library";

export async function requestGoogleIndexing(url: string) {
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!keyFile) {
    console.error("❌ Google Indexing: Clé JSON manquante dans .env");
    return;
  }

  try {
    const auth = new GoogleAuth({
      keyFile,
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    const client = await auth.getClient();
    const projectId = await auth.getProjectId();

    // On force le type 'any' car la librairie Google est stricte sur le typage
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
