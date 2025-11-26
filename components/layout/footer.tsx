import Link from "next/link";
import { Youtube, Twitter, Instagram } from "lucide-react";
import { Container } from "@/components/ui/container";
import { auth, signOut } from "@/auth";

const CREATOR = {
  name: "DLK Digital Agency",
  url: "https://dlkdigitalagency.com",
};

const TiktokIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    icon: Twitter,
    href: "https://twitter.com/Metalyafr",
    label: "Twitter",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/metalya.fr",
    label: "Instagram",
  },
  {
    icon: TiktokIcon,
    href: "https://www.tiktok.com/@metalya.fr",
    label: "TikTok",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@Metalyafr",
    label: "YouTube",
  },
];

const MAIN_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Articles", href: "/" },
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const PUBLIC_ACCOUNT_LINKS = [
  { label: "Se connecter", href: "/login" },
  { label: "Créer un compte", href: "/register" },
];

const LEGAL_LINKS = [
  { label: "Mentions Légales", href: "/mentions-legales" },
  { label: "Politique de Confidentialité", href: "/privacy" },
  { label: "CGU", href: "/cgu" },
];

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const session = await auth();

  return (
    <footer className="border-t border-white/5 bg-neutral-950 pt-24 text-neutral-400">
      <Container>
        <div className="grid grid-cols-1 gap-12 pb-16 lg:grid-cols-12 lg:gap-8">
          {/* --- Colonne Logo & Social --- */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            <Link
              href="/"
              className="font-serif text-4xl font-medium tracking-tight text-white transition-opacity hover:opacity-80"
            >
              Metalya.
            </Link>
            <p className="max-w-md text-base leading-relaxed text-neutral-500">
              Votre rendez-vous quotidien avec l&apos;actualité, la culture et
              l&apos;innovation. Une lecture apaisée et approfondie pour esprits
              curieux.
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 transition-all hover:border-white/20 hover:bg-white hover:text-black"
                >
                  <social.icon
                    size={18}
                    className="transition-transform group-hover:scale-110"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* --- Colonnes de Liens --- */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:pl-10">
            {/* Explorer */}
            <div className="flex flex-col gap-6">
              <h3 className="font-medium text-white">Explorer</h3>
              <ul className="flex flex-col gap-4 text-sm">
                {MAIN_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white hover:underline hover:decoration-neutral-700 hover:underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compte (Dynamique) */}
            <div className="flex flex-col gap-6">
              <h3 className="font-medium text-white">Compte</h3>
              <ul className="flex flex-col gap-4 text-sm">
                {!session ? (
                  PUBLIC_ACCOUNT_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-white hover:underline hover:decoration-neutral-700 hover:underline-offset-4"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <Link
                        href="/admin/create"
                        className="transition-colors hover:text-white hover:underline hover:decoration-neutral-700 hover:underline-offset-4"
                      >
                        Administration
                      </Link>
                    </li>
                    <li>
                      <form
                        action={async () => {
                          "use server";
                          await signOut({ redirectTo: "/" });
                        }}
                      >
                        <button
                          type="submit"
                          className="text-left transition-colors hover:text-white hover:underline hover:decoration-neutral-700 hover:underline-offset-4"
                        >
                          Se déconnecter
                        </button>
                      </form>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Légal */}
            <div className="flex flex-col gap-6">
              <h3 className="font-medium text-white">Légal</h3>
              <ul className="flex flex-col gap-4 text-sm">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white hover:underline hover:decoration-neutral-700 hover:underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* --- Bas de page --- */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 py-8 text-xs text-neutral-600 sm:flex-row">
          <p>&copy; {currentYear} Metalya. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Créé par{" "}
            <a
              href={CREATOR.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-400 transition-colors hover:text-white"
            >
              {CREATOR.name}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
