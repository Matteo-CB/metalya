"use client";

import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Quote,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Loader2,
} from "lucide-react";
import { uploadImage } from "@/app/actions/media";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  onInsert: (text: string) => void;
}

export function EditorToolbar({ onInsert }: EditorToolbarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation basique
    if (!file.type.startsWith("image/")) {
      alert("Le fichier doit être une image.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Utilisation de votre action server existante
      const url = await uploadImage(formData);

      // Insertion du markdown image avec l'URL retournée par Vercel Blob
      onInsert(`\n![Description de l'image](${url})\n`);
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Erreur lors de l'upload de l'image. Vérifiez votre connexion.");
    } finally {
      setIsUploading(false);
      // Reset pour permettre de ré-uploader le même fichier si besoin
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const tools = [
    {
      icon: Bold,
      label: "Gras",
      action: () => onInsert("**gras**"),
    },
    {
      icon: Italic,
      label: "Italique",
      action: () => onInsert("*italique*"),
    },
    {
      icon: Heading1,
      label: "Titre 1",
      action: () => onInsert("\n# Titre 1\n"),
    },
    {
      icon: Heading2,
      label: "Titre 2",
      action: () => onInsert("\n## Titre 2\n"),
    },
    {
      icon: Quote,
      label: "Citation",
      action: () => onInsert("\n> Citation\n"),
    },
    {
      icon: List,
      label: "Liste",
      action: () => onInsert("\n- Element 1\n- Element 2\n"),
    },
    {
      icon: Code,
      label: "Code",
      action: () => onInsert("\n```tsx\n// Votre code ici\n```\n"),
    },
    {
      icon: LinkIcon,
      label: "Lien",
      action: () => onInsert("[Texte du lien](https://)"),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1">
      {tools.map((tool) => (
        <button
          key={tool.label}
          onClick={tool.action}
          className="p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 rounded-md transition-colors"
          title={tool.label}
          type="button"
        >
          <tool.icon size={18} />
        </button>
      ))}

      <div className="w-px h-4 bg-neutral-200 mx-1" />

      {/* Bouton d'Upload Image */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={cn(
          "p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 rounded-md transition-colors relative",
          isUploading && "cursor-not-allowed opacity-50"
        )}
        title="Insérer une image"
        type="button"
      >
        {isUploading ? (
          <Loader2 size={18} className="animate-spin text-indigo-600" />
        ) : (
          <ImageIcon size={18} />
        )}
      </button>

      {/* Input caché pour le fichier */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp, image/gif"
        onChange={handleImageUpload}
      />
    </div>
  );
}
