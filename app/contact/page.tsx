"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSchema, ContactInput } from "@/lib/schemas";
import { sendContactMessage } from "@/app/actions/contact";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { Loader2, Send, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Note: Les métadonnées SEO doivent être dans un layout ou page.tsx serveur si besoin,
// mais ici c'est un Client Component. Pour le SEO parfait, on pourrait séparer en 2 fichiers,
// mais pour simplifier et garder l'interactivité, on peut définir le titre via le layout parent ou config.

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (values: ContactInput) => {
    setError(null);
    startTransition(async () => {
      const res = await sendContactMessage(values);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        form.reset();
      }
    });
  };

  return (
    <div className="flex mb-20 min-h-[80vh] flex-col pt-10 md:pt-20">
      <Container>
        <FadeIn>
          <header className="mb-16 max-w-3xl text-center md:mb-24 md:text-left">
            <h1 className="font-serif text-5xl font-medium tracking-tight text-neutral-950 sm:text-7xl">
              Parlons ensemble.
            </h1>
            <p className="mt-6 text-lg text-neutral-500 md:text-xl">
              Une question, une suggestion ou une envie de collaborer ?<br />
              Notre équipe éditoriale est à votre écoute.
            </p>
          </header>
        </FadeIn>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-24">
          {/* --- COLONNE INFOS --- */}
          <div className="lg:col-span-4">
            <FadeIn delay={0.2}>
              <div className="space-y-12">
                <div>
                  <h3 className="mb-4 font-serif text-2xl font-medium text-neutral-900">
                    Coordonnées
                  </h3>
                  <div className="space-y-6 text-neutral-600">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-900">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Email</p>
                        <a
                          href="mailto:contact@metalya.fr"
                          className="transition-colors hover:text-neutral-900 hover:underline"
                        >
                          contact@metalya.fr
                        </a>
                        <p className="mt-1 text-sm text-neutral-400">
                          Réponse sous 24h ouvrées
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-900">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Bureau</p>
                        <p>
                          12 Avenue des Champs-Élysées
                          <br />
                          75008 Paris, France
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-neutral-950 p-8 text-neutral-400">
                  <h4 className="mb-2 font-serif text-xl font-medium text-white">
                    Presse & Partenariats
                  </h4>
                  <p className="text-sm leading-relaxed">
                    Pour les demandes média ou les opportunités publicitaires,
                    veuillez mentionner [Presse] dans l&apos;objet de votre
                    message pour un traitement prioritaire.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* --- COLONNE FORMULAIRE --- */}
          <div className="lg:col-span-8">
            <FadeIn delay={0.3}>
              <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm md:p-12">
                {success ? (
                  <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="font-serif text-3xl font-medium text-neutral-900">
                      Message envoyé !
                    </h3>
                    <p className="mt-4 max-w-md text-neutral-500">
                      Merci de nous avoir contactés. Nous avons bien reçu votre
                      message et nous reviendrons vers vous très rapidement.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="mt-8 rounded-full border border-neutral-200 px-8 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-semibold uppercase tracking-wider text-neutral-500"
                        >
                          Nom complet
                        </label>
                        <input
                          {...form.register("name")}
                          id="name"
                          type="text"
                          disabled={isPending}
                          placeholder="Jean Dupont"
                          className="w-full border-b border-neutral-200 bg-transparent py-3 text-lg font-medium outline-none transition-colors focus:border-neutral-900 placeholder:text-neutral-300"
                        />
                        {form.formState.errors.name && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-semibold uppercase tracking-wider text-neutral-500"
                        >
                          Email
                        </label>
                        <input
                          {...form.register("email")}
                          id="email"
                          type="email"
                          disabled={isPending}
                          placeholder="jean@exemple.com"
                          className="w-full border-b border-neutral-200 bg-transparent py-3 text-lg font-medium outline-none transition-colors focus:border-neutral-900 placeholder:text-neutral-300"
                        />
                        {form.formState.errors.email && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-semibold uppercase tracking-wider text-neutral-500"
                      >
                        Sujet
                      </label>
                      <input
                        {...form.register("subject")}
                        id="subject"
                        type="text"
                        disabled={isPending}
                        placeholder="Proposition d'article..."
                        className="w-full border-b border-neutral-200 bg-transparent py-3 text-lg font-medium outline-none transition-colors focus:border-neutral-900 placeholder:text-neutral-300"
                      />
                      {form.formState.errors.subject && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-semibold uppercase tracking-wider text-neutral-500"
                      >
                        Message
                      </label>
                      <textarea
                        {...form.register("message")}
                        id="message"
                        rows={6}
                        disabled={isPending}
                        placeholder="Bonjour, je vous contacte car..."
                        className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-base leading-relaxed outline-none transition-colors focus:border-neutral-900 focus:bg-white placeholder:text-neutral-400"
                      />
                      {form.formState.errors.message && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.message.message}
                        </p>
                      )}
                    </div>

                    {error && (
                      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isPending}
                        className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-neutral-800 hover:shadow-lg disabled:opacity-70"
                      >
                        {isPending ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <>
                            Envoyer le message
                            <Send
                              size={16}
                              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                            />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </div>
  );
}
