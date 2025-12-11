import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { Scale, BookOpen, AlertTriangle, Copyright } from "lucide-react";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | Metalya",
  description:
    "Règles d'utilisation, droits et devoirs des utilisateurs de la plateforme Metalya.",
};

export default function CGUPage() {
  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <Container className="py-16 md:py-24">
          <FadeIn>
            <span className="block text-indigo-600 font-bold tracking-wider uppercase text-sm mb-4">
              Juridique
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-medium text-neutral-900 mb-6">
              Conditions Générales d'Utilisation
            </h1>
            <p className="text-lg text-neutral-500 max-w-2xl">
              L'utilisation des services de Metalya implique l'acceptation sans
              réserve des présentes conditions. Elles définissent le cadre de
              confiance de notre communauté.
            </p>
            <p className="mt-4 text-sm font-mono text-neutral-400">
              Version 2.0 • En vigueur au 01/01/2025
            </p>
          </FadeIn>
        </Container>
      </div>

      <Container className="py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sommaire Latéral (Desktop) */}
          <div className="hidden lg:block lg:col-span-4">
            <FadeIn className="sticky top-32 p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm">
              <h3 className="font-bold text-neutral-900 mb-4">Sommaire</h3>
              <ul className="space-y-3 text-sm text-neutral-600">
                <li>1. Objet et Acceptation</li>
                <li>2. Accès et Services</li>
                <li>3. Propriété Intellectuelle</li>
                <li>4. Responsabilités</li>
                <li>5. Code de Conduite</li>
                <li>6. Liens Hypertextes</li>
                <li>7. Droit Applicable</li>
              </ul>
            </FadeIn>
          </div>

          {/* Contenu Principal */}
          <div className="lg:col-span-8 space-y-12">
            <FadeIn>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-indigo-100 rounded-lg mt-1">
                  <Scale className="w-5 h-5 text-indigo-700" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-neutral-900 mb-4">
                    1. Objet
                  </h2>
                  <div className="prose prose-neutral text-neutral-600">
                    <p>
                      Les présentes Conditions Générales d'Utilisation (CGU) ont
                      pour objet de définir les modalités et conditions dans
                      lesquelles Metalya met à la disposition de ses
                      utilisateurs le site et les services disponibles sur le
                      site et d'autre part, la manière par laquelle
                      l'utilisateur accède au site et utilise ses services.
                    </p>
                    <p>
                      Toute connexion au site est subordonnée au respect des
                      présentes conditions. Pour l'utilisateur, le simple accès
                      au site de l'Éditeur à l'adresse URL suivante{" "}
                      <strong>www.metalya.fr</strong> implique l'acceptation de
                      l'ensemble des conditions décrites ci-après.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <div className="w-full h-px bg-neutral-200" />

            <FadeIn>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-100 rounded-lg mt-1">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-neutral-900 mb-4">
                    2. Accès au site
                  </h2>
                  <div className="prose prose-neutral text-neutral-600">
                    <p>
                      Le site est accessible gratuitement en tout lieu à tout
                      utilisateur ayant un accès à Internet. Tous les frais
                      supportés par l'utilisateur pour accéder au service
                      (matériel informatique, logiciels, connexion Internet,
                      etc.) sont à sa charge.
                    </p>
                    <p>
                      L'Éditeur met en œuvre tous les moyens mis à sa
                      disposition pour assurer un accès de qualité à ses
                      services. L'obligation étant de moyens, le site ne
                      s'engage pas à atteindre ce résultat. Tout événement dû à
                      un cas de force majeure ayant pour conséquence un
                      dysfonctionnement du réseau ou du serveur n'engage pas la
                      responsabilité de Metalya.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <div className="w-full h-px bg-neutral-200" />

            <FadeIn>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-100 rounded-lg mt-1">
                  <Copyright className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-neutral-900 mb-4">
                    3. Propriété Intellectuelle
                  </h2>
                  <div className="prose prose-neutral text-neutral-600">
                    <p>
                      La structure générale du site Metalya, ainsi que les
                      textes, graphiques, images, sons et vidéos la composant,
                      sont la propriété de l'éditeur ou de ses partenaires.
                      Toute représentation et/ou reproduction et/ou exploitation
                      partielle ou totale des contenus et services proposés par
                      le site, par quelque procédé que ce soit, sans
                      l'autorisation préalable et par écrit de Metalya Media est
                      strictement interdite et serait susceptible de constituer
                      une contrefaçon au sens des articles L 335-2 et suivants
                      du Code de la propriété intellectuelle.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <div className="w-full h-px bg-neutral-200" />

            <FadeIn>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-rose-100 rounded-lg mt-1">
                  <AlertTriangle className="w-5 h-5 text-rose-700" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-neutral-900 mb-4">
                    4. Responsabilité & Force Majeure
                  </h2>
                  <div className="prose prose-neutral text-neutral-600">
                    <p>
                      Les informations diffusées sur le site Metalya sont
                      réputées fiables. Toutefois, le site ne garantit pas qu'il
                      soit exempt de défauts, d'erreurs ou d'omissions. Les
                      informations communiquées sont présentées à titre
                      indicatif et général sans valeur contractuelle.
                    </p>
                    <p>
                      Metalya ne pourra être tenu responsable des dommages
                      directs et indirects causés au matériel de l'utilisateur,
                      lors de l'accès au site. De plus, l'utilisateur du site
                      s'engage à accéder au site en utilisant un matériel
                      récent, ne contenant pas de virus et avec un navigateur de
                      dernière génération mis-à-jour.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <div className="bg-neutral-900 p-8 rounded-2xl text-white">
              <h3 className="font-serif text-xl mb-4">
                6. Droit applicable et juridiction
              </h3>
              <p className="text-neutral-300 text-sm">
                La législation française s'applique au présent contrat. En cas
                d'absence de résolution amiable d'un litige né entre les
                parties, les tribunaux français seront seuls compétents pour en
                connaître. Pour toute question relative à l’application des
                présentes CGU, vous pouvez joindre l’éditeur aux coordonnées
                inscrites dans les mentions légales.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
