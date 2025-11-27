"use client";

import { deletePost } from "@/app/actions/posts";
import { Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface PostActionsProps {
  postId: string;
}

export function PostActions({ postId }: PostActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deletePost(postId);
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Bouton Modifier */}
      <Link
        href={`/admin/posts/${postId}/edit`}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
      >
        <Edit size={14} />
        Modifier
      </Link>

      {/* Bouton Supprimer (avec confirmation) */}
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-600 transition-colors hover:bg-red-600 hover:text-white"
        >
          <Trash2 size={14} />
          Supprimer
        </button>
      ) : (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
          <span className="text-xs font-medium text-red-600">Sûr ?</span>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-70"
          >
            {isPending ? <Loader2 className="animate-spin" size={14} /> : "Oui"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
          >
            Non
          </button>
        </div>
      )}
    </div>
  );
}
