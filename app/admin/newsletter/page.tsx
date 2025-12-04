import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { formatDate, cn } from "@/lib/utils";
import { UserRole } from "@prisma/client";
import {
  Mail,
  Plus,
  Clock,
  CheckCircle2,
  FileEdit,
  Trash2,
  Send,
  XCircle,
  Edit,
} from "lucide-react";
import Link from "next/link";
import {
  sendCampaign,
  deleteCampaign,
  updateNewsletterStatus,
} from "@/app/actions/campaigns";

export default async function NewsletterDashboard() {
  const session = await auth();
  if (!session?.user) return null;

  const newsletters = await prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  const isAdmin =
    session.user.role === UserRole.ADMIN ||
    session.user.role === UserRole.SUPER_ADMIN;

  return (
    <div className="py-10">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-neutral-900">
              Newsletter
            </h1>
            <p className="text-neutral-500">Gérez vos campagnes d'e-mailing.</p>
          </div>
          <Link
            href="/admin/newsletter/create"
            className="flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
          >
            <Plus size={18} />
            Nouvelle Campagne
          </Link>
        </div>

        <div className="grid gap-4">
          {newsletters.map((item) => {
            const isOwner = item.authorId === session.user.id;
            // On peut modifier si on est admin OU si c'est notre brouillon/rejet
            const canEdit = isAdmin || (isOwner && item.status !== "SENT");

            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md md:flex-row md:items-center md:justify-between"
              >
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        item.status === "SENT" &&
                          "bg-emerald-100 text-emerald-700",
                        item.status === "PENDING" &&
                          "bg-amber-100 text-amber-700",
                        item.status === "DRAFT" &&
                          "bg-neutral-100 text-neutral-600",
                        item.status === "REJECTED" && "bg-red-100 text-red-700"
                      )}
                    >
                      {item.status === "SENT" && <CheckCircle2 size={12} />}
                      {item.status === "PENDING" && <Clock size={12} />}
                      {item.status === "DRAFT" && <FileEdit size={12} />}
                      {item.status === "REJECTED" && <XCircle size={12} />}
                      {item.status === "SENT"
                        ? "Envoyé"
                        : item.status === "PENDING"
                        ? "En attente"
                        : item.status === "REJECTED"
                        ? "Rejeté"
                        : "Brouillon"}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {formatDate(item.createdAt)}
                    </span>
                    <span className="text-xs font-medium text-neutral-600">
                      par {item.author.name}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    {item.subject}
                  </h3>
                  {item.sentAt && (
                    <p className="mt-1 text-xs text-neutral-400">
                      Envoyé le {formatDate(item.sentAt)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 border-t border-neutral-100 pt-4 md:border-t-0 md:pt-0">
                  {canEdit && item.status !== "SENT" && (
                    <Link
                      href={`/admin/newsletter/${item.id}/edit`}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </Link>
                  )}

                  {isAdmin && item.status === "PENDING" && (
                    <>
                      <form
                        action={async () => {
                          "use server";
                          await sendCampaign(item.id);
                        }}
                      >
                        <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">
                          <Send size={14} />
                          Valider
                        </button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await updateNewsletterStatus(item.id, "REJECTED");
                        }}
                      >
                        <button className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">
                          <XCircle size={14} />
                          Rejeter
                        </button>
                      </form>
                    </>
                  )}

                  {isAdmin && item.status === "DRAFT" && (
                    <form
                      action={async () => {
                        "use server";
                        await sendCampaign(item.id);
                      }}
                    >
                      <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700">
                        <Send size={14} />
                        Envoyer
                      </button>
                    </form>
                  )}

                  {item.status !== "SENT" && (
                    <form
                      action={async () => {
                        "use server";
                        await deleteCampaign(item.id);
                      }}
                    >
                      <button
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}

          {newsletters.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-20 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <Mail size={24} className="text-neutral-400" />
              </div>
              <h3 className="font-medium text-neutral-900">
                Aucune newsletter
              </h3>
              <p className="text-sm text-neutral-500">
                Commencez par en créer une nouvelle.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
