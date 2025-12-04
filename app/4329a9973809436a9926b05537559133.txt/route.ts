export async function GET() {
  // Cette route sert à prouver aux moteurs de recherche que vous êtes le propriétaire du site
  // La clé doit correspondre au nom du fichier/dossier
  return new Response("4329a9973809436a9926b05537559133", {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
