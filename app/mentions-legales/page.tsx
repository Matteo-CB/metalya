import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description: "Informations légales et contacts de l'éditeur du site Metalya.",
  robots: { index: false, follow: true }, // Souvent inutile d'indexer ces pages pour le SEO global
};

export default function LegalMentionsPage() {
  return (
    <div className="pt-16 pb-24">
      <Container>
        <FadeIn className="mx-auto max-w-3xl">
          <header className="mb-12 border-b border-neutral-200 pb-8">
            <h1 className="font-serif text-4xl font-medium text-neutral-900 md:text-5xl">
              Mentions Légales
            </h1>
            <p className="mt-4 text-neutral-500">En vigueur au 01/01/2025</p>
          </header>

          <div className="prose prose-neutral prose-lg text-neutral-600 prose-headings:font-serif prose-headings:font-medium prose-headings:text-neutral-900 prose-a:text-neutral-900 prose-a:underline hover:prose-a:text-neutral-600">
            <section>
              <h2>1. Édition du site</h2>
              <p>
                En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004
                pour la confiance dans l'économie numérique, il est précisé aux
                utilisateurs du site internet <strong>Metalya</strong>{" "}
                l'identité des différents intervenants dans le cadre de sa
                réalisation et de son suivi :
              </p>
              <ul>
                <li>
                  <strong>Propriétaire du site :</strong> Matteo Biyikli
                </li>
                <li>
                  <strong>Contact :</strong> matteo.biyikli3224@gmail.com
                </li>
                <li>
                  <strong>Adresse :</strong> [Votre Adresse Postale Complète
                  Ici]
                </li>
              </ul>
            </section>

            <section>
              <h2>2. Hébergement</h2>
              <p>
                Le site est hébergé par la société <strong>Vercel Inc.</strong>,
                située au :<br />
                340 S Lemon Ave #4133 Walnut, CA 91789, USA.
                <br />
                Site web :{" "}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://vercel.com
                </a>
              </p>
            </section>

            <section>
              <h2>3. Propriété intellectuelle</h2>
              <p>
                <strong>Matteo Biyikli</strong> est propriétaire des droits de
                propriété intellectuelle et détient les droits d’usage sur tous
                les éléments accessibles sur le site internet, notamment les
                textes, images, graphismes, logos, vidéos, architecture, icônes
                et sons.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication,
                adaptation de tout ou partie des éléments du site, quel que soit
                le moyen ou le procédé utilisé, est interdite, sauf autorisation
                écrite préalable.
              </p>
            </section>

            <section>
              <h2>4. Conception et Réalisation</h2>
              <p>
                Ce site a été conçu et développé par : <br />
                <strong>DLK Digital Agency</strong>
                <br />
                Site web :{" "}
                <a
                  href="https://dlkdigitalagency.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  dlkdigitalagency.com
                </a>
              </p>
            </section>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
