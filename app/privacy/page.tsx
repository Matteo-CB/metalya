import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description: "Comment Metalya gère et protège vos données personnelles.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-16 pb-24">
      <Container>
        <FadeIn className="mx-auto max-w-3xl">
          <header className="mb-12 border-b border-neutral-200 pb-8">
            <h1 className="font-serif text-4xl font-medium text-neutral-900 md:text-5xl">
              Politique de Confidentialité
            </h1>
            <p className="mt-4 text-neutral-500">
              Dernière mise à jour : 01/01/2025
            </p>
          </header>

          <div className="prose prose-neutral prose-lg text-neutral-600 prose-headings:font-serif prose-headings:font-medium prose-headings:text-neutral-900">
            <p>
              Chez <strong>Metalya</strong>, nous accordons une importance
              capitale à la confidentialité de vos données. Cette politique
              détaille les informations que nous collectons et l'usage que nous
              en faisons.
            </p>

            <h2>1. Données collectées</h2>
            <p>
              Nous collectons uniquement les données strictement nécessaires au
              bon fonctionnement du service :
            </p>
            <ul>
              <li>
                <strong>Compte Utilisateur :</strong> Nom, adresse email et mot
                de passe (crypté) lors de votre inscription.
              </li>
              <li>
                <strong>Données techniques :</strong> Adresse IP, type de
                navigateur (via nos logs serveur pour la sécurité).
              </li>
            </ul>

            <h2>2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>
                Gérer votre compte utilisateur et votre authentification (via
                NextAuth).
              </li>
              <li>
                Vous permettre de publier des articles (si vous êtes
                administrateur).
              </li>
              <li>Améliorer la sécurité du site.</li>
            </ul>
            <p>
              Nous ne vendons, ne louons et ne partageons{" "}
              <strong>jamais</strong> vos données personnelles à des tiers à des
              fins commerciales.
            </p>

            <h2>3. Cookies</h2>
            <p>Nous utilisons des cookies essentiels pour :</p>
            <ul>
              <li>
                Maintenir votre session active (cookie de session sécurisé).
              </li>
              <li>Mémoriser vos préférences d'affichage.</li>
            </ul>
            <p>
              Ces cookies sont exemptés de consentement selon les directives de
              la CNIL car ils sont strictement nécessaires au fonctionnement du
              service.
            </p>

            <h2>4. Vos droits</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données
              (RGPD), vous disposez d’un droit d’accès, de rectification et de
              suppression de vos données.
            </p>
            <p>
              Pour exercer ce droit, contactez-nous à :{" "}
              <a
                href="mailto:matteo.biyikli3224@gmail.com"
                className="text-neutral-900 underline"
              >
                matteo.biyikli3224@gmail.com
              </a>
            </p>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
