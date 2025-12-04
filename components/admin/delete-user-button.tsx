"use client";

import { deleteUser } from "@/app/actions/user";
import { Trash2, Loader2 } from "lucide-react";
import { useTransition } from "react";

interface DeleteUserButtonProps {
  userId: string;
}

export function DeleteUserButton({ userId }: DeleteUserButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
      )
    ) {
      startTransition(async () => {
        await deleteUser(userId);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-neutral-400 hover:text-red-600 transition-colors disabled:opacity-50"
      aria-label="Supprimer l'utilisateur"
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}
