"use client";

import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import {
  Loader2,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";

export function Newsletter() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (formData: FormData) => {
    setStatus("idle");
    setMessage("");

    startTransition(async () => {
      const res = await subscribeToNewsletter(formData);
      if (res.error) {
        setStatus("error");
        setMessage(res.error);
      } else {
        setStatus("success");
        setMessage(res.success!);
      }
    });
  };

  return (
    <section className="relative my-16 overflow-hidden rounded-4xl bg-neutral-950 py-16 md:my-24 md:py-24">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -left-24 -top-24 h-[500px] w-[500px] rounded-full bg-indigo-500 blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 h-[500px] w-[500px] rounded-full bg-purple-500 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <FadeIn>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-300 backdrop-blur-md">
            <Sparkles size={14} />
            <span>Hebdomadaire & Gratuit</span>
          </div>

          <h2 className="font-serif text-4xl font-medium text-white md:text-5xl lg:text-6xl">
            Le futur, directement <br className="hidden md:block" />
            dans votre boîte mail.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-400">
            Rejoignez Metalya. Recevez chaque semaine notre sélection des
            meilleurs articles Tech, Culture et Voyage. Pas de spam, promis.
          </p>

          <div className="mx-auto mt-10 max-w-md">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 rounded-2xl bg-white/10 p-6 text-emerald-400 backdrop-blur-md border border-white/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="font-medium text-white">{message}</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  action={handleSubmit}
                  className="relative flex flex-col gap-3 sm:flex-row"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="votre@email.com"
                      disabled={isPending}
                      className="h-14 w-full rounded-full border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder-neutral-500 backdrop-blur-md transition-all focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="group flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-neutral-950 transition-all hover:bg-indigo-50 hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-70"
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        S'inscrire
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-red-400"
              >
                {message}
              </motion.p>
            )}

            <p className="mt-6 text-xs text-neutral-500">
              En vous inscrivant, vous acceptez notre{" "}
              <a
                href="/privacy"
                className="text-neutral-400 underline hover:text-white transition-colors"
              >
                politique de confidentialité
              </a>
              .
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
