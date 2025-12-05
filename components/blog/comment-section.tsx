"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { createComment, deleteComment } from "@/app/actions/comments";
import { formatDate } from "@/lib/utils";
import {
  Send,
  Trash2,
  MessageSquare,
  Loader2,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!content.trim()) return;

    startTransition(async () => {
      const res = await createComment(postId, content);
      if (res.error) {
        setError(res.error);
      } else {
        setContent("");
      }
    });
  };

  const handleDelete = (commentId: string) => {
    if (confirm("Supprimer ce commentaire ?")) {
      startTransition(async () => {
        await deleteComment(commentId);
      });
    }
  };

  return (
    <section id="comments" className="mt-16 border-t border-neutral-200 pt-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
          <MessageSquare size={16} />
        </div>
        <h3 className="font-serif text-2xl font-bold text-neutral-900">
          Commentaires ({comments.length})
        </h3>
      </div>

      {/* Formulaire */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-12 flex gap-4">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-200">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-neutral-400">
                <UserIcon size={20} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Partagez votre avis..."
              rows={3}
              className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={isPending || !content.trim()}
                className="flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2 text-xs font-bold text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <Send size={14} />
                )}
                Publier
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-12 rounded-xl bg-neutral-50 p-6 text-center">
          <p className="text-sm text-neutral-600">
            Vous devez être connecté pour participer à la discussion.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-full bg-neutral-900 px-6 py-2 text-xs font-bold text-white hover:bg-neutral-800"
          >
            Se connecter
          </Link>
        </div>
      )}

      {/* Liste des commentaires */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-200">
              {comment.author.image ? (
                <Image
                  src={comment.author.image}
                  alt={comment.author.name || "Auteur"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                  <UserIcon size={20} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900">
                    {comment.author.name || "Anonyme"}
                  </span>
                  <span className="text-xs text-neutral-400">
                    • {formatDate(comment.createdAt)}
                  </span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-neutral-400 hover:text-red-600"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <p className="text-sm leading-relaxed text-neutral-700">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
