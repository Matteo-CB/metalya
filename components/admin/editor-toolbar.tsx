"use client";

import { Image as ImageIcon, Video, Type, List, Quote } from "lucide-react";

interface EditorToolbarProps {
  onInsert: (template: string) => void;
}

export function EditorToolbar({ onInsert }: EditorToolbarProps) {
  const tools = [
    { icon: ImageIcon, label: "Image", template: "![Alt](https://...)" },
    { icon: Video, label: "Vidéo", template: "\nhttps://video.mp4\n" },
    { icon: Type, label: "Titre", template: "\n## Titre\n" },
    { icon: Quote, label: "Citation", template: "\n> Citation\n" },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-neutral-100 bg-neutral-50/50 p-2">
      {tools.map((tool) => (
        <button
          key={tool.label}
          type="button"
          onClick={() => onInsert(tool.template)}
          className="rounded p-2 text-neutral-500 hover:bg-white hover:text-neutral-900 hover:shadow-sm transition-all"
          title={tool.label}
        >
          <tool.icon size={18} />
        </button>
      ))}
    </div>
  );
}
