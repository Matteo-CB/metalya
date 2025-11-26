"use client";

import { useState, useTransition, useMemo } from "react";
import { sendNewsletterAction } from "@/app/actions/send-newsletter";
import { EditorToolbar } from "@/components/admin/editor-toolbar";
import { Loader2, Send, Eye, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderToStaticMarkup } from "react-dom/server";
import { MetalyaNewsletter } from "@/components/emails";

export default function NewsletterPage() {
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const insertText = (t: string) => setContent((prev) => prev + t);

  // Génération du HTML pour l'iframe de prévisualisation
  const emailHtml = useMemo(() => {
    const template = (
      <MetalyaNewsletter
        subject={subject || "Sujet de la newsletter"}
        content={content || "Commencez à rédiger votre contenu..."}
        unsubscribeUrl="#" // Lien factice pour la prévisualisation
      />
    );
    return renderToStaticMarkup(template);
  }, [subject, content]);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 p-6 lg:grid-cols-2">
        {/* Colonne Édition */}
        <div
          className={cn(
            "flex flex-col gap-6",
            viewMode === "preview" && "hidden lg:flex"
          )}
        >
          <form
            action={(formData) => {
              startTransition(async () => {
                const res = await sendNewsletterAction(formData);
                if (res.error) setStatus({ type: "error", text: res.error });
                if (res.success)
                  setStatus({ type: "success", text: res.success });
              });
            }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-neutral-500">
                Sujet
              </label>
              <input
                name="subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-md border border-neutral-200 p-3 outline-none focus:border-neutral-900"
                placeholder="Sujet de l'email..."
              />
            </div>

            <div className="flex min-h-[500px] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
              <EditorToolbar onInsert={insertText} />
              <textarea
                name="content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 resize-none p-6 font-mono text-sm leading-relaxed outline-none"
                placeholder="# Bonjour..."
              />
            </div>

            {status && (
              <div
                className={cn(
                  "rounded-md p-4 text-sm",
                  status.type === "error"
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600"
                )}
              >
                {status.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-4 font-bold text-white hover:bg-neutral-800 disabled:opacity-70"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              Envoyer à tous les abonnés
            </button>
          </form>
        </div>

        {/* Colonne Prévisualisation */}
        <div
          className={cn(
            "overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-sm",
            viewMode === "edit" && "hidden lg:block"
          )}
        >
          <div className="mb-4 border-b pb-2 text-xs font-bold uppercase text-neutral-400">
            Aperçu Email
          </div>
          <div className="h-[800px] w-full overflow-hidden rounded border border-neutral-100 bg-gray-50">
            <iframe
              srcDoc={emailHtml}
              className="h-full w-full border-none"
              title="Aperçu Newsletter"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
