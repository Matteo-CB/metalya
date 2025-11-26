import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Règles d'utilisation du site Metalya.",
};

export default function CGUPage() {
  return (
    <div className="pt-16 pb-24">
      <Container>
        <FadeIn className="mx-auto max-w-3xl">
          <header className="mb-12 border-b border-neutral-200 pb-8">
            <h1 className="font-serif text-4xl font-medium text-neutral-900 md:text-5xl">
              Conditions Générales d'Utilisation
            </h1>
            <p className="mt-4 text-neutral-500">En vigueur au 01/01/2025</p>
          </header>

          <div className="prose prose-neutral prose-lg text-neutral-600 prose-headings:font-serif prose-headings:font-medium prose-headings:text-neutral-900">
            <section>
              <h2>1. Objet</h2>
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) ont pour
                objet de définir les modalités de mise à disposition du site{" "}
                <strong>Metalya</strong> et les conditions d'utilisation du
                service par l'utilisateur.
              </p>
            </section>

            <section>
              <h2>2. Accès au site</h2>
              <p>
                Le site est accessible gratuitement à tout utilisateur disposant
                d'un accès à internet. Tous les coûts afférents à l'accès au
                service (matériel informatique, logiciels, connexion internet)
                sont à la charge de l'utilisateur.
              </p>
              <p>
                L'accès à certaines sections, notamment l'administration, est
                réservé aux utilisateurs authentifiés et disposant des droits
                nécessaires.
              </p>
            </section>

            <section>
              <h2>3. Propriété intellectuelle</h2>
              <p>
                Les marques, logos, signes ainsi que tous les contenus du site
                (textes, images, son...) font l'objet d'une protection par le
                Code de la propriété intellectuelle.
              </p>
              <p>
                L'utilisateur doit solliciter l'autorisation préalable du site
                pour toute reproduction, publication, copie des différents
                contenus. Il s'engage à une utilisation des contenus du site
                dans un cadre strictement privé.
              </p>
            </section>

            <section>
              <h2>4. Responsabilité</h2>
              <p>
                Les sources des informations diffusées sur le site Metalya sont
                réputées fiables mais le site ne garantit pas qu'il soit exempt
                de défauts, d'erreurs ou d'omissions.
              </p>
              <p>
                Le site ne peut être tenu responsable d'éventuels virus qui
                pourraient infecter l'ordinateur ou tout matériel informatique
                de l'Internaute, suite à une utilisation, à l'accès, ou au
                téléchargement provenant de ce site.
              </p>
            </section>

            <section>
              <h2>5. Liens hypertextes</h2>
              <p>
                Des liens hypertextes peuvent être présents sur le site.
                L'utilisateur est informé qu'en cliquant sur ces liens, il
                sortira du site Metalya. Ce dernier n'a pas de contrôle sur les
                pages web sur lesquelles aboutissent ces liens et ne saurait, en
                aucun cas, être responsable de leur contenu.
              </p>
            </section>

            <section>
              <h2>6. Droit applicable</h2>
              <p>
                La législation française s'applique au présent contrat. En cas
                d'absence de résolution amiable d'un litige né entre les
                parties, les tribunaux français seront seuls compétents pour en
                connaître.
              </p>
            </section>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
