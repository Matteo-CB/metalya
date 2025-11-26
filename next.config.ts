/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisation des images : on autorise les domaines externes courants
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // ⚠️ Permissif pour le dev (accepte tout)
    ],
  },
  // Sécurité : on autorise les iframes pour YouTube/Vimeo
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Pour upload de petites images directement si besoin
    },
  },
};

export default nextConfig;
