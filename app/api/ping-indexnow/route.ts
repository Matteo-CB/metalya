import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { urls } = await request.json();
  const apiKey = "4329a9973809436a9926b05537559133"; // Ta clé IndexNow (issue de ton fichier txt)
  const host = "metalya.fr";
  const keyLocation = `https://${host}/${apiKey}.txt`;

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host,
        key: apiKey,
        keyLocation,
        urlList: urls,
      }),
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Bing/Yandex notifiés !",
      });
    } else {
      return NextResponse.json(
        { success: false, error: await response.text() },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur réseau" },
      { status: 500 }
    );
  }
}
