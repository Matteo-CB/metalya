import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Metalya",
  description:
    "Engagement de Metalya concernant la protection de vos données personnelles, l'utilisation des cookies et vos droits (RGPD).",
};

export default function PrivacyPage() {
  const lastUpdate = "8 Décembre 2025";

  return (
    <div className="pt-16 pb-24">
      <Container>
        <FadeIn className="mx-auto max-w-4xl">
          <header className="mb-16 border-b border-neutral-200 pb-10">
            <h1 className="font-serif text-4xl font-medium text-neutral-900 md:text-5xl">
              Politique de Confidentialité
            </h1>
            <p className="mt-6 text-lg text-neutral-500">
              La transparence est au cœur de notre éthique. Voici comment nous
              traitons vos données.
            </p>
            <p className="mt-2 text-sm text-neutral-400">
              Dernière mise à jour : {lastUpdate}
            </p>
          </header>

          <div className="prose prose-neutral prose-lg max-w-none text-neutral-600 prose-headings:font-serif prose-headings:font-medium prose-headings:text-neutral-900 prose-a:text-neutral-900 prose-a:no-underline hover:prose-a:underline">
            <p>
              Bienvenue sur <strong>Metalya</strong>. La protection de votre vie
              privée n'est pas une simple formalité légale pour nous, c'est un
              engagement de confiance. Cette politique décrit comment nous
              collectons, utilisons et protégeons vos informations lorsque vous
              utilisez notre plateforme et nos services associés.
            </p>

            <h2>1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données collectées sur le site
              Metalya est l'agence <strong>Hidden Lab</strong>, représentée par
              Matteo Biyikli.
              <br />
              Siège social : Paris, France.
              <br />
              Email de contact DPO :{" "}
              <a href="mailto:privacy@metalya.fr">privacy@metalya.fr</a>
            </p>

            <h2>2. Les données que nous collectons</h2>
            <p>
              Nous collectons différents types d'informations pour fournir et
              améliorer notre service :
            </p>

            <h3>2.1 Données que vous nous transmettez directement</h3>
            <ul>
              <li>
                <strong>Informations de compte :</strong> Lors de votre
                inscription, nous collectons votre adresse email, votre nom (ou
                pseudonyme) et un mot de passe sécurisé (haché).
              </li>
              <li>
                <strong>Communications :</strong> Lorsque vous nous contactez
                (via formulaire ou email), nous conservons une trace de ces
                échanges.
              </li>
              <li>
                <strong>Contenu utilisateur :</strong> Les commentaires,
                articles ou messages que vous publiez volontairement sur la
                plateforme.
              </li>
            </ul>

            <h3>2.2 Données collectées automatiquement</h3>
            <ul>
              <li>
                <strong>Données techniques :</strong> Adresse IP, type de
                navigateur, version du système d'exploitation, et identifiants
                de l'appareil.
              </li>
              <li>
                <strong>Données d'utilisation :</strong> Pages visitées, temps
                passé sur le site, liens cliqués et interactions.
              </li>
            </ul>

            <h3>
              2.3 Données issues de services tiers (API et Réseaux Sociaux)
            </h3>
            <p>
              Si vous choisissez de connecter votre compte à des services tiers
              (comme Google, Pinterest, Twitter ou LinkedIn) ou d'utiliser nos
              fonctionnalités de partage social :
            </p>
            <ul>
              <li>
                Nous pouvons recevoir des informations de profil public (avatar,
                nom) selon les autorisations que vous avez accordées à ces
                plateformes.
              </li>
              <li>
                Dans le cadre de l'utilisation de l'
                <strong>API Pinterest</strong>, nous respectons strictement
                leurs{" "}
                <a
                  href="https://developers.pinterest.com/terms/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Conditions d'utilisation pour les développeurs
                </a>
                . Nous n'utilisons ces données que pour permettre la publication
                ou l'épinglage de contenu Metalya sur vos tableaux, sans jamais
                stocker vos identifiants personnels tiers.
              </li>
            </ul>

            <h2>3. Utilisation des données</h2>
            <p>Vos données sont traitées pour les finalités suivantes :</p>
            <ul>
              <li>
                <strong>Fourniture du service :</strong> Gestion de votre
                compte, authentification (via NextAuth) et affichage
                personnalisé.
              </li>
              <li>
                <strong>Intégrations sociales :</strong> Permettre le partage
                automatisé de contenu sur vos réseaux sociaux (Pinterest,
                Twitter, etc.) à votre demande explicite.
              </li>
              <li>
                <strong>Sécurité et Maintenance :</strong> Détection des
                fraudes, prévention des attaques (DDoS, Brute-force) et débogage
                technique.
              </li>
              <li>
                <strong>Communication :</strong> Envoi de newsletters (si
                consentement) ou notifications transactionnelles
                (réinitialisation de mot de passe).
              </li>
            </ul>

            <h2>4. Partage des données</h2>
            <p>
              Nous ne vendons <strong>jamais</strong> vos données personnelles.
              Cependant, nous pouvons partager certaines informations avec des
              tiers de confiance nécessaires au service :
            </p>
            <ul>
              <li>
                <strong>Hébergement et Infrastructure :</strong> Vercel et
                MongoDB (base de données), qui respectent les normes de sécurité
                les plus strictes.
              </li>
              <li>
                <strong>Services d'envoi d'emails :</strong> Resend, pour
                l'acheminement de nos emails transactionnels.
              </li>
              <li>
                <strong>Plateformes sociales :</strong> Uniquement si vous
                utilisez les fonctionnalités de partage (ex: bouton "Pin It").
                Ces interactions sont régies par les politiques de
                confidentialité des plateformes respectives (Pinterest, Twitter,
                etc.).
              </li>
            </ul>

            <h2>5. Cookies et Traceurs</h2>
            <p>
              Nous utilisons des cookies pour améliorer votre expérience. Vous
              pouvez contrôler leur utilisation via les paramètres de votre
              navigateur.
            </p>
            <ul>
              <li>
                <strong>Cookies essentiels :</strong> Nécessaires au
                fonctionnement (session, sécurité). Exemptés de consentement.
              </li>
              <li>
                <strong>Cookies analytiques :</strong> Nous utilisons Google
                Analytics de manière anonymisée pour comprendre l'audience du
                site.
              </li>
            </ul>

            <h2>6. Conservation des données</h2>
            <p>
              Nous conservons vos données personnelles uniquement le temps
              nécessaire aux finalités poursuivies :
            </p>
            <ul>
              <li>
                <strong>Compte actif :</strong> Tant que votre compte est actif.
              </li>
              <li>
                <strong>Inactivité :</strong> Suppression après 3 ans
                d'inactivité totale.
              </li>
              <li>
                <strong>Obligations légales :</strong> Certaines données de
                facturation ou de logs peuvent être conservées plus longtemps
                pour répondre à nos obligations légales.
              </li>
            </ul>

            <h2>7. Vos droits (RGPD)</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données,
              vous disposez des droits suivants sur vos données :
            </p>
            <ul>
              <li>Droit d'accès et de rectification.</li>
              <li>Droit à l'effacement ("Droit à l'oubli").</li>
              <li>Droit à la limitation du traitement.</li>
              <li>Droit à la portabilité des données.</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez notre DPO à :{" "}
              <a href="mailto:contact@metalya.fr">contact@metalya.fr</a>. Nous
              nous engageons à répondre dans un délai maximum de 30 jours.
            </p>

            <h2>8. Sécurité des données</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques avancées
              : chiffrement des mots de passe (bcrypt), protocoles HTTPS/TLS
              pour tous les transferts, et restrictions d'accès strictes à nos
              bases de données.
            </p>

            <h2>9. Modifications de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique pour refléter les
              évolutions de nos services ou des réglementations. Nous vous
              informerons de tout changement majeur via notre site ou par email.
            </p>

            <div className="mt-12 rounded-2xl bg-neutral-100 p-8">
              <h3 className="mt-0 text-xl font-medium text-neutral-900">
                Une question ?
              </h3>
              <p className="mb-4">
                Notre équipe est à votre disposition pour toute question
                relative à vos données personnelles.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-sm font-semibold text-neutral-900 transition hover:text-neutral-600"
              >
                Nous contacter{" "}
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Link>
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
