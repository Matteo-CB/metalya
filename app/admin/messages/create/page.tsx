import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { UserRole } from "@prisma/client";
import { Send, Users, User } from "lucide-react";
import Link from "next/link";
import { sendMessage } from "@/app/actions/messaging";

export default async function CreateMessagePage() {
  const session = await auth();
  if (!session?.user) return null;

  // Récupérer tous les utilisateurs sauf soi-même pour la liste des destinataires
  const users = await prisma.user.findMany({
    where: {
      id: { not: session.user.id },
      // Optionnel : Filtrer pour ne montrer que les membres de l'équipe (Admins, Rédacteurs)
      role: { in: [UserRole.REDACTEUR, UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    },
    orderBy: { role: "desc" },
  });

  return (
    <div className="py-10 bg-neutral-50 min-h-screen">
      <Container className="max-w-3xl">
        <div className="mb-8">
          <Link
            href="/admin/messages"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 mb-4 inline-block"
          >
            ← Retour
          </Link>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">
            Nouveau Message
          </h1>
        </div>

        <form action={sendMessage} className="flex flex-col gap-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <label className="mb-4 flex items-center gap-2 text-sm font-bold text-neutral-900">
              <Users size={16} />
              Destinataires
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
              {users.map((u) => (
                <label
                  key={u.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-100 p-3 transition-colors hover:bg-neutral-50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50"
                >
                  <input
                    type="checkbox"
                    name="recipients"
                    value={u.id}
                    className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 overflow-hidden rounded-full bg-neutral-200">
                      {u.image ? (
                        <img
                          src={u.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User
                          size={14}
                          className="m-auto mt-1 text-neutral-400"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {u.name}
                      </p>
                      <p className="text-[10px] font-bold uppercase text-neutral-400">
                        {u.role}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-bold text-neutral-900">
                Sujet
              </label>
              <input
                name="subject"
                required
                className="w-full rounded-lg border border-neutral-200 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Objet du message..."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-neutral-900">
                Message
              </label>
              <textarea
                name="content"
                required
                rows={6}
                className="w-full resize-none rounded-lg border border-neutral-200 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Écrivez votre message ici..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-neutral-800 hover:shadow-lg"
            >
              <Send size={18} />
              Envoyer le message
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
}
