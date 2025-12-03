"use client";

import { EditorToolbar } from "@/components/admin/editor-toolbar";

interface MarkdownEditorProps {
  content: string;
  setContent: (v: string) => void;
  insertText: (t: string) => void;
}

export function MarkdownEditor({
  content,
  setContent,
  insertText,
}: MarkdownEditorProps) {
  return (
    <div className="flex h-full min-h-[600px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-neutral-900/5">
      <div className="border-b border-neutral-100 bg-neutral-50/50 px-4 py-2">
        <EditorToolbar onInsert={insertText} />
      </div>

      <div className="relative flex-1">
        <textarea
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="absolute inset-0 h-full w-full resize-none p-8 font-mono text-sm leading-loose text-neutral-800 outline-none placeholder:text-neutral-300"
          placeholder="# Commencez votre histoire ici...

Appuyez deux fois sur Entrée pour créer un nouveau paragraphe.
Utilisez **gras** pour mettre en évidence."
          spellCheck={false}
        />
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
        <span>Markdown Supporté</span>
        <span>
          {content.length} caractères • {content.split(/\s+/).length} mots
        </span>
      </div>
    </div>
  );
}
