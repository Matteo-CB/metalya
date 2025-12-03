import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-neutral-50 text-center">
      <Container>
        <FadeIn>
          <p className="font-mono text-sm font-bold uppercase tracking-widest text-neutral-400">
            Erreur 404
          </p>
          <h1 className="mt-4 font-serif text-5xl font-medium text-neutral-900 md:text-7xl">
            Page introuvable
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg text-neutral-500">
            Désolé, nous ne trouvons pas la page que vous cherchez. Elle a
            peut-être été déplacée ou supprimée.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-neutral-800 hover:shadow-lg"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />
              Retour à l'accueil
            </Link>
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-8 py-3 text-sm font-bold text-neutral-900 transition-colors hover:border-neutral-900"
            >
              <Search size={16} />
              Explorer les articles
            </Link>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
