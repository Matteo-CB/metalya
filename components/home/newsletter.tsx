"use client";

import { Mail, Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { useState, useTransition } from "react";

export function Newsletter() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function onSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const res = await subscribeToNewsletter(formData);
      if (res.error) setMessage({ type: "error", text: res.error });
      if (res.success) setMessage({ type: "success", text: res.success });
    });
  }

  return (
    <section className="relative mb-24 overflow-hidden rounded-3xl bg-neutral-900 px-6 py-16 text-center text-white sm:px-12 lg:py-24">
      <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-800 opacity-50 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-2xl space-y-6">
        <Mail className="mx-auto h-12 w-12 text-neutral-400" />
        <h3 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
          Restez inspiré.
        </h3>
        <p className="mx-auto max-w-lg text-lg text-neutral-400">
          Recevez notre sélection hebdomadaire. Pas de spam, juste de la
          qualité.
        </p>

        <form
          action={onSubmit}
          className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row"
        >
          <input
            name="email"
            type="email"
            required
            placeholder="votre@email.com"
            className="w-full rounded-full border border-neutral-700 bg-neutral-800/50 px-5 py-3 text-white placeholder:text-neutral-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
          />
          <button
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-neutral-900 transition-transform hover:scale-105 hover:bg-neutral-200 disabled:opacity-70"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "S'abonner"
            )}
          </button>
        </form>
        {message && (
          <p
            className={
              message.type === "error" ? "text-red-400" : "text-green-400"
            }
          >
            {message.text}
          </p>
        )}
      </div>
    </section>
  );
}
