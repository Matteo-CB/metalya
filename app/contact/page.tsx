"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSchema, ContactInput } from "@/lib/schemas";
import { sendContactMessage } from "@/app/actions/contact";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import {
  Loader2,
  Send,
  Mail,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Newspaper,
  HelpCircle,
} from "lucide-react";

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
    <div className="relative min-h-screen bg-neutral-50 pb-24 pt-32 md:pt-40 overflow-hidden">
      {/* --- AMBIANCE BACKGROUND --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] overflow-hidden -z-10 pointer-events-none opacity-50">
        <div className="absolute top-[-100px] right-0 w-[800px] h-[800px] bg-indigo-50/80 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[100px] left-[-200px] w-[600px] h-[600px] bg-rose-50/80 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      <Container>
        {/* --- HEADER MAGNIFIQUE & OPTIMISÉ SEO --- */}
        <FadeIn className="mb-20 text-center md:mb-28">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-500 shadow-sm backdrop-blur-sm">
              <MessageSquare size={12} />
              <span>Support & Partenariats</span>
            </div>

            <h1 className="font-serif text-5xl font-medium tracking-tight text-neutral-950 sm:text-7xl leading-[1.1] mb-8">
              Créons des liens <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">
                durables.
              </span>
            </h1>

            <p className="text-lg leading-relaxed text-neutral-600 md:text-xl">
              Une question sur nos articles <strong>Tech</strong>,{" "}
              <strong>Culture</strong> ou <strong>Voyage</strong> ? Une
              proposition de collaboration ? Metalya est à votre écoute pour
              façonner le futur de l'information numérique.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* --- COLONNE GAUCHE : CARTE D'INFO --- */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
            <FadeIn delay={0.1}>
              {/* Carte Email Principal */}
              <div className="group rounded-3xl bg-white p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-neutral-100 transition-all hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:border-indigo-100">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <Mail size={24} />
                </div>
                <h3 className="mb-2 font-serif text-2xl font-medium text-neutral-900">
                  Rédaction
                </h3>
                <p className="mb-6 text-neutral-500 text-sm leading-relaxed">
                  Pour les lecteurs et les contributeurs. Nous lisons chaque
                  message avec attention.
                </p>
                <a
                  href="mailto:contact@metalya.fr"
                  className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-neutral-900 transition-colors hover:text-indigo-600"
                >
                  contact@metalya.fr
                  <ArrowRight size={16} />
                </a>
              </div>

              {/* Carte Presse (Plus petite) */}
              <div className="rounded-3xl border border-neutral-200 bg-transparent p-8 transition-colors hover:bg-white hover:border-transparent hover:shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-rose-500">
                    <Newspaper size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1">
                      Presse & Média
                    </h4>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      Besoin d'un kit média ou d'une interview ? <br />
                      Mentionnez{" "}
                      <span className="font-mono text-xs bg-neutral-100 px-1 py-0.5 rounded text-neutral-700">
                        [Presse]
                      </span>{" "}
                      dans votre objet.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* --- COLONNE DROITE : FORMULAIRE --- */}
          <div className="lg:col-span-7">
            <FadeIn delay={0.2}>
              <div className="relative rounded-[2.5rem] bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-neutral-100 md:p-12">
                {success ? (
                  <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                    <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 animate-in zoom-in duration-500">
                      <Sparkles size={40} />
                    </div>
                    <h3 className="font-serif text-3xl font-medium text-neutral-900 mb-4">
                      Bien reçu !
                    </h3>
                    <p className="max-w-xs text-neutral-500 mb-10 text-lg leading-relaxed">
                      Votre message est entre de bonnes mains. Nous vous
                      répondrons sous 24h.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="group inline-flex items-center gap-2 rounded-full bg-neutral-50 px-8 py-3 text-sm font-bold text-neutral-900 transition-all hover:bg-neutral-100"
                    >
                      <ArrowRight
                        size={16}
                        className="rotate-180 transition-transform group-hover:-translate-x-1"
                      />
                      Nouveau message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-10">
                      <h3 className="font-serif text-2xl font-bold text-neutral-900">
                        Envoyez-nous un mot
                      </h3>
                      <p className="text-neutral-500 mt-2 text-sm">
                        Tous les champs marqués sont requis.
                      </p>
                    </div>

                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-2 group">
                          <label
                            htmlFor="name"
                            className="text-xs font-bold uppercase tracking-widest text-neutral-400 transition-colors group-focus-within:text-indigo-600 ml-1"
                          >
                            Nom complet
                          </label>
                          <input
                            {...form.register("name")}
                            id="name"
                            type="text"
                            disabled={isPending}
                            placeholder="Jean Dupont"
                            className="w-full rounded-xl border-0 bg-neutral-50 px-4 py-4 text-neutral-900 placeholder:text-neutral-400 ring-1 ring-inset ring-neutral-200 transition-all focus:bg-white focus:ring-2 focus:ring-indigo-600"
                          />
                          {form.formState.errors.name && (
                            <p className="text-xs text-red-500 ml-1 font-medium">
                              {form.formState.errors.name.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 group">
                          <label
                            htmlFor="email"
                            className="text-xs font-bold uppercase tracking-widest text-neutral-400 transition-colors group-focus-within:text-indigo-600 ml-1"
                          >
                            Email
                          </label>
                          <input
                            {...form.register("email")}
                            id="email"
                            type="email"
                            disabled={isPending}
                            placeholder="jean@exemple.com"
                            className="w-full rounded-xl border-0 bg-neutral-50 px-4 py-4 text-neutral-900 placeholder:text-neutral-400 ring-1 ring-inset ring-neutral-200 transition-all focus:bg-white focus:ring-2 focus:ring-indigo-600"
                          />
                          {form.formState.errors.email && (
                            <p className="text-xs text-red-500 ml-1 font-medium">
                              {form.formState.errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 group">
                        <label
                          htmlFor="subject"
                          className="text-xs font-bold uppercase tracking-widest text-neutral-400 transition-colors group-focus-within:text-indigo-600 ml-1"
                        >
                          Sujet
                        </label>
                        <input
                          {...form.register("subject")}
                          id="subject"
                          type="text"
                          disabled={isPending}
                          placeholder="Proposition de collaboration..."
                          className="w-full rounded-xl border-0 bg-neutral-50 px-4 py-4 text-neutral-900 placeholder:text-neutral-400 ring-1 ring-inset ring-neutral-200 transition-all focus:bg-white focus:ring-2 focus:ring-indigo-600"
                        />
                        {form.formState.errors.subject && (
                          <p className="text-xs text-red-500 ml-1 font-medium">
                            {form.formState.errors.subject.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 group">
                        <label
                          htmlFor="message"
                          className="text-xs font-bold uppercase tracking-widest text-neutral-400 transition-colors group-focus-within:text-indigo-600 ml-1"
                        >
                          Message
                        </label>
                        <textarea
                          {...form.register("message")}
                          id="message"
                          rows={6}
                          disabled={isPending}
                          placeholder="Votre message ici..."
                          className="w-full resize-none rounded-xl border-0 bg-neutral-50 px-4 py-4 text-base leading-relaxed text-neutral-900 placeholder:text-neutral-400 ring-1 ring-inset ring-neutral-200 transition-all focus:bg-white focus:ring-2 focus:ring-indigo-600"
                        />
                        {form.formState.errors.message && (
                          <p className="text-xs text-red-500 ml-1 font-medium">
                            {form.formState.errors.message.message}
                          </p>
                        )}
                      </div>

                      {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-3">
                          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                          {error}
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isPending}
                          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-neutral-900 py-4.5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/20 active:scale-[0.99] disabled:opacity-70 disabled:active:scale-100"
                        >
                          {isPending ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <>
                              <span>Envoyer le message</span>
                              <Send
                                size={16}
                                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                              />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </div>
  );
}
