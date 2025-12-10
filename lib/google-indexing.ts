import { GoogleAuth } from "google-auth-library";

export async function requestGoogleIndexing(url: string) {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    console.error("Google Indexing: Missing GOOGLE_SERVICE_ACCOUNT_KEY");
    return;
  }

  try {
    const credentials = JSON.parse(serviceAccountKey.replace(/\\n/g, "\n"));

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
      console.log(`Google notified: ${url}`);
    } else {
      console.error(`Google Indexing Status: ${res.status}`);
    }
  } catch (error) {
    console.error("Google Indexing Error:", error);
  }
}
