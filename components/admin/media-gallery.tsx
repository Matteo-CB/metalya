"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { uploadImage, deleteMedia } from "@/app/actions/media";
import {
  Upload,
  Trash2,
  Copy,
  Loader2,
  Image as ImageIcon,
  Check,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Type simplifié pour les blobs Vercel
type BlobAsset = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
};

export function MediaGallery({ initialMedia }: { initialMedia: BlobAsset[] }) {
  const [media, setMedia] = useState<BlobAsset[]>(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtrage
  const filteredMedia = media.filter((item) =>
    item.pathname.toLowerCase().includes(search.toLowerCase())
  );

  // Gestion de l'upload
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Appel au serveur (qui compresse et sauvegarde)
      const url = await uploadImage(formData);

      // 2. Mise à jour optimiste locale (on simule le nouveau fichier)
      const newBlob: BlobAsset = {
        url,
        pathname: `articles/${file.name}`, // Nom temporaire pour l'affichage
        size: file.size,
        uploadedAt: new Date(),
      };

      setMedia((prev) => [newBlob, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'upload.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // Gestion de la suppression
  function handleDelete(url: string) {
    if (!confirm("Voulez-vous vraiment supprimer cette image définitivement ?"))
      return;

    startTransition(async () => {
      try {
        await deleteMedia(url);
        setMedia((prev) => prev.filter((m) => m.url !== url));
      } catch (error) {
        alert("Impossible de supprimer l'image.");
      }
    });
  }

  // Copie du lien
  function copyToClipboard(url: string) {
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="space-y-8">
      {/* --- TOOLBAR --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher une image..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        {/* Upload Button */}
        <div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg hover:bg-neutral-800 transition-all disabled:opacity-50 font-medium text-sm"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Compression...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Uploader une image
              </>
            )}
          </button>
        </div>
      </div>

      {/* --- GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMedia.map((file) => (
            <motion.div
              layout
              key={file.url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative aspect-square bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden"
            >
              {/* Image Preview */}
              <div className="relative w-full h-full">
                <Image
                  src={file.url}
                  alt={file.pathname}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
              </div>

              {/* Actions Overlay (Hover) */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                <button
                  onClick={() => copyToClipboard(file.url)}
                  className="p-2 bg-white text-neutral-900 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-lg"
                  title="Copier le lien"
                >
                  <Copy size={18} />
                </button>
                <button
                  onClick={() => handleDelete(file.url)}
                  disabled={isPending}
                  className="p-2 bg-white text-neutral-900 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors shadow-lg"
                  title="Supprimer"
                >
                  {isPending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>

              {/* File Info Badge */}
              <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] text-white truncate font-mono">
                  {file.pathname.split("/").pop()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="text-neutral-400" size={32} />
          </div>
          <p className="text-neutral-500 font-medium">Aucune image trouvée</p>
          <p className="text-neutral-400 text-sm mt-1">
            Commencez par en uploader une.
          </p>
        </div>
      )}
    </div>
  );
}
