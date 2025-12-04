"use client";

import { useState, useEffect, useTransition } from "react";
import { X, Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu la popup dans cette session
    const sessionShown = sessionStorage.getItem("exit-popup-shown");
    if (sessionShown) {
      setHasBeenShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasBeenShown) {
        setIsVisible(true);
        setHasBeenShown(true);
        sessionStorage.setItem("exit-popup-shown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasBeenShown]);

  const closePopup = () => setIsVisible(false);

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
        // Fermer la popup après 2 secondes en cas de succès
        setTimeout(() => setIsVisible(false), 2500);
      }
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <button
              onClick={closePopup}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-900 z-20"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="bg-neutral-900 p-8 text-white md:w-2/5 flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 opacity-20" />
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 relative z-10">
                  <Mail size={32} />
                </div>
                <h3 className="font-serif text-2xl font-bold relative z-10">
                  Attendez !
                </h3>
                <p className="mt-2 text-sm text-neutral-400 relative z-10">
                  Ne partez pas les mains vides.
                </p>
              </div>

              <div className="p-8 md:w-3/5 bg-white">
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center space-y-4"
                  >
                    <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={24} />
                    </div>
                    <p className="text-sm font-medium text-neutral-900">
                      {message}
                    </p>
                    <p className="text-xs text-neutral-500">
                      À bientôt dans votre boîte mail.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <h4 className="text-lg font-bold text-neutral-900">
                      Rejoignez l'élite.
                    </h4>
                    <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                      Recevez chaque semaine notre résumé des meilleures
                      actualités Tech, Culture et Voyage. Pas de spam, juste de
                      la qualité.
                    </p>

                    <form action={handleSubmit} className="mt-6 space-y-3">
                      <div className="relative">
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="votre@email.com"
                          className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 disabled:opacity-50"
                          disabled={isPending}
                        />
                      </div>

                      {status === "error" && (
                        <p className="text-xs text-red-500 font-medium">
                          {message}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isPending}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-70"
                      >
                        {isPending ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <>
                            Je m'inscris
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </form>

                    <p className="mt-4 text-center text-[10px] text-neutral-400">
                      Rejoignez Metalya.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
