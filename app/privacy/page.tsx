import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { Lock, Eye, Database, Share2, Cookie, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Metalya",
  description:
    "Notre engagement absolu pour la protection de vos données personnelles et le respect de votre vie privée.",
};

export default function PrivacyPage() {
  const lastUpdate = "8 Décembre 2025";

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-neutral-900 py-24 sm:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-neutral-950 opacity-50" />
        <Container className="relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium uppercase tracking-widest mb-6">
              <Lock className="w-3 h-3" />
              RGPD & Privacy First
            </div>
            <h1 className="font-serif text-4xl font-medium tracking-tight text-white sm:text-6xl mb-6">
              Politique de Confidentialité
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-neutral-400">
              Votre confiance est notre actif le plus précieux. Nous ne vendons
              pas vos données. Nous les protégeons comme si c'étaient les
              nôtres.
            </p>
            <p className="mt-8 text-sm text-neutral-500">
              Dernière mise à jour : {lastUpdate}
            </p>
          </FadeIn>
        </Container>
      </div>

      <Container className="py-24">
        <div className="mx-auto max-w-4xl space-y-16">
          {/* Introduction */}
          <FadeIn className="prose prose-lg prose-neutral max-w-none">
            <p className="lead text-xl md:text-2xl font-serif text-neutral-900">
              Bienvenue sur Metalya. Cette politique détaille de manière
              transparente comment nous traitons les informations que nous
              recueillons lorsque vous utilisez notre site web et nos services.
              En utilisant Metalya, vous acceptez les pratiques décrites ici.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Responsable */}
            <FadeIn
              delay={0.1}
              className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-neutral-900 m-0">
                  1. Responsable du Traitement
                </h3>
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Le responsable du traitement des données est l'agence{" "}
                <strong>Hidden Lab</strong>, agissant pour le compte de Metalya
                Media.
                <br />
                <br />
                Pour toute question relative à la protection de vos données,
                notre Délégué à la Protection des Données (DPO) est disponible à
                l'adresse :{" "}
                <a
                  href="mailto:contact@metalya.fr"
                  className="text-indigo-600 font-medium"
                >
                  contact@metalya.fr
                </a>
                .
              </p>
            </FadeIn>

            {/* Collecte */}
            <FadeIn
              delay={0.2}
              className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-neutral-900 m-0">
                  2. Données Collectées
                </h3>
              </div>
              <ul className="text-neutral-600 text-sm space-y-2 list-disc pl-4">
                <li>
                  <strong>Identité :</strong> Nom, prénom, pseudo (si création
                  de compte).
                </li>
                <li>
                  <strong>Contact :</strong> Adresse email.
                </li>
                <li>
                  <strong>Technique :</strong> Adresse IP (anonymisée), logs de
                  connexion, type de navigateur.
                </li>
                <li>
                  <strong>Interactions :</strong> Commentaires, articles
                  favoris, préférences de lecture.
                </li>
              </ul>
            </FadeIn>
          </div>

          {/* Usage des données */}
          <FadeIn delay={0.3}>
            <div className="border-l-4 border-indigo-500 pl-6 py-2">
              <h2 className="font-serif text-3xl text-neutral-900 mb-6">
                3. Pourquoi collectons-nous ces données ?
              </h2>
              <div className="prose prose-neutral max-w-none text-neutral-600">
                <p>
                  Nous sommes des minimalistes de la donnée. Nous ne collectons
                  que ce qui est strictement nécessaire pour :
                </p>
                <ul>
                  <li>
                    <strong>Assurer le service :</strong> Vous permettre de
                    créer un compte, de commenter et d'accéder à vos contenus
                    sauvegardés.
                  </li>
                  <li>
                    <strong>Sécurité :</strong> Détecter et prévenir les
                    activités frauduleuses, les spams et les incidents de
                    sécurité.
                  </li>
                  <li>
                    <strong>Communication :</strong> Vous envoyer notre
                    newsletter (uniquement avec votre consentement explicite) ou
                    des notifications transactionnelles (réinitialisation de mot
                    de passe).
                  </li>
                  <li>
                    <strong>Amélioration :</strong> Comprendre comment notre
                    site est utilisé via des statistiques anonymes pour
                    améliorer l'expérience utilisateur.
                  </li>
                </ul>
              </div>
            </div>
          </FadeIn>

          {/* Partage et Tiers */}
          <FadeIn delay={0.4}>
            <h2 className="font-serif text-3xl text-neutral-900 mb-8 flex items-center gap-3">
              <Share2 className="w-8 h-8 text-neutral-400" />
              4. Partage des Données et Tiers
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <p className="text-neutral-800 font-medium text-lg mb-4">
                  Nous ne vendons, ne louons et ne commercialisons JAMAIS vos
                  données personnelles à des tiers.
                </p>
                <p className="text-neutral-600 mb-6">
                  Cependant, pour faire fonctionner Metalya, nous collaborons
                  avec des prestataires de confiance qui respectent le RGPD :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <span className="block font-bold text-neutral-900">
                      Vercel & MongoDB
                    </span>
                    <span className="text-sm text-neutral-500">
                      Hébergement sécurisé et base de données chiffrée.
                    </span>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <span className="block font-bold text-neutral-900">
                      Resend
                    </span>
                    <span className="text-sm text-neutral-500">
                      Service d'envoi d'emails transactionnels.
                    </span>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <span className="block font-bold text-neutral-900">
                      Google Analytics
                    </span>
                    <span className="text-sm text-neutral-500">
                      Statistiques anonymisées (IP masquées).
                    </span>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <span className="block font-bold text-neutral-900">
                      Réseaux Sociaux
                    </span>
                    <span className="text-sm text-neutral-500">
                      Uniquement si vous utilisez les boutons de partage (API
                      Pinterest, Twitter...).
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Cookies & Droits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FadeIn delay={0.5}>
              <h3 className="font-serif text-2xl text-neutral-900 mb-4 flex items-center gap-2">
                <Cookie className="w-5 h-5 text-amber-600" />
                5. Politique de Cookies
              </h3>
              <p className="text-neutral-600 mb-4">
                Nous utilisons des cookies pour améliorer votre navigation. Vous
                avez le contrôle total via votre navigateur.
              </p>
              <ul className="text-sm text-neutral-600 space-y-2 list-disc pl-4">
                <li>
                  <strong>Cookies essentiels :</strong> Indispensables au
                  fonctionnement (session).
                </li>
                <li>
                  <strong>Cookies de performance :</strong> Pour analyser le
                  trafic de manière anonyme.
                </li>
              </ul>
            </FadeIn>

            <FadeIn delay={0.6}>
              <h3 className="font-serif text-2xl text-neutral-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                6. Vos Droits (RGPD)
              </h3>
              <p className="text-neutral-600 mb-4">
                Vous restez maître de vos données. À tout moment, vous pouvez
                demander :
              </p>
              <ul className="text-sm text-neutral-600 space-y-2 list-disc pl-4">
                <li>L'accès à toutes vos données.</li>
                <li>La rectification ou la suppression ("Droit à l'oubli").</li>
                <li>La portabilité de vos données.</li>
                <li>Le retrait de votre consentement.</li>
              </ul>
            </FadeIn>
          </div>

          {/* Contact Final */}
          <FadeIn
            delay={0.7}
            className="mt-12 bg-neutral-900 rounded-3xl p-8 md:p-12 text-center"
          >
            <h3 className="text-2xl font-serif text-white mb-4">
              Une question sur votre vie privée ?
            </h3>
            <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
              Notre équipe dédiée à la conformité est là pour répondre à toutes
              vos interrogations. Nous nous engageons à répondre sous 48h.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-neutral-900 font-bold rounded-full hover:bg-indigo-50 transition-colors duration-300"
            >
              Contacter le DPO
            </Link>
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}
