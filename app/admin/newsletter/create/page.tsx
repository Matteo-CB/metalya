"use client";

import { useState, useTransition } from "react";
import { createCampaign } from "@/app/actions/campaigns";
import { EditorToolbar } from "@/components/admin/editor-toolbar";
import { Loader2, Save, Send } from "lucide-react";
import { Container } from "@/components/ui/container";
import Link from "next/link";

export default function CreateNewsletterPage() {
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [isPending, startTransition] = useTransition();

  const insertText = (t: string) => setContent((prev) => prev + t);

  return (
    <div className="py-10 bg-neutral-50 min-h-screen">
      <Container className="max-w-4xl">
        <div className="mb-8">
          <Link
            href="/admin/newsletter"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 mb-4 inline-block"
          >
            ← Retour
          </Link>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">
            Rédiger une Newsletter
          </h1>
        </div>

        <form
          action={(formData) => {
            startTransition(async () => {
              await createCampaign(formData);
            });
          }}
          className="flex flex-col gap-6"
        >
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Sujet de l'email
            </label>
            <input
              name="subject"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 p-4 text-lg font-medium outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              placeholder="Ex: Le futur de l'IA en 2025..."
            />
          </div>

          <div className="flex min-h-[500px] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            <EditorToolbar onInsert={insertText} />
            <textarea
              name="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 resize-none p-8 font-mono text-sm leading-relaxed outline-none"
              placeholder="# Bonjour...
              
Écrivez votre contenu ici en Markdown."
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="submit"
              name="action"
              value="draft"
              disabled={isPending}
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-bold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              <Save size={18} />
              Enregistrer brouillon
            </button>

            <button
              type="submit"
              name="action"
              value="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3 text-sm font-bold text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
              Proposer / Envoyer
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
}
