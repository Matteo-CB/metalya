"use client";

import { Mail, Loader2, Send, Sparkles } from "lucide-react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <section className="relative mb-24 mt-24 w-full">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-950 px-6 py-24 text-center md:px-12 lg:py-32">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-[100px]"
        />

        <div className="relative z-10 mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-neutral-300 backdrop-blur-md">
              <Sparkles size={14} className="text-yellow-400" />
              <span className="uppercase tracking-widest text-[10px]">
                Hebdomadaire
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl font-medium tracking-tight text-white md:text-7xl"
          >
            Restez{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-200 via-white to-indigo-200">
              inspiré.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-neutral-400 md:text-xl"
          >
            Rejoignez <strong>Metalya</strong>. Recevez notre sélection triée
            sur le volet : tech, culture et voyage. Pas de bruit, juste le
            signal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <form
              action={onSubmit}
              className="relative mx-auto flex max-w-md flex-col gap-2 sm:flex-row"
            >
              <div className="relative w-full group">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-white">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                  className="h-14 w-full rounded-full border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-neutral-600 outline-none transition-all focus:border-white/30 focus:bg-white/10 focus:ring-4 focus:ring-white/5"
                />
              </div>

              <button
                disabled={isPending}
                className="group relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 font-bold text-neutral-950 transition-all hover:scale-105 hover:bg-neutral-200 disabled:opacity-70 sm:w-auto"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>S'abonner</span>
                    <Send
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium backdrop-blur-sm",
                  message.type === "error"
                    ? "bg-red-500/10 text-red-200 border border-red-500/20"
                    : "bg-emerald-500/10 text-emerald-200 border border-emerald-500/20"
                )}
              >
                {message.type === "success" && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
                {message.text}
              </motion.div>
            )}

            <p className="mt-6 text-xs text-neutral-600">
              Désinscription en un clic. Nous respectons votre inbox.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
