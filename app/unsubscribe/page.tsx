"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { unsubscribeAction } from "@/app/actions/newsletter";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    if (!id) {
      setStatus("error");
      return;
    }

    unsubscribeAction(id)
      .then((res) => {
        if (res.success) setStatus("success");
        else setStatus("error");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-neutral-50">
      <Container className="max-w-md text-center">
        <FadeIn>
          <div className="rounded-xl border border-neutral-200 bg-white p-12 shadow-sm">
            {status === "loading" && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-neutral-400" size={48} />
                <h1 className="font-serif text-2xl font-medium">
                  Traitement en cours...
                </h1>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-green-100 p-3 text-green-600">
                  <CheckCircle2 size={32} />
                </div>
                <h1 className="font-serif text-2xl font-medium">
                  Désabonnement confirmé
                </h1>
                <p className="text-neutral-500">
                  Vous ne recevrez plus la newsletter Metalya. <br />
                  Vous allez nous manquer !
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-block rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                >
                  Retour à l'accueil
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-red-100 p-3 text-red-600">
                  <XCircle size={32} />
                </div>
                <h1 className="font-serif text-2xl font-medium">
                  Une erreur est survenue
                </h1>
                <p className="text-neutral-500">
                  Le lien est invalide ou vous êtes déjà désabonné.
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-block rounded-full border border-neutral-200 bg-white px-6 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
                >
                  Retour à l'accueil
                </Link>
              </div>
            )}
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
