import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { UserRoleSelector } from "@/components/admin/user-role-selector";
import { formatDate } from "@/lib/utils";
import { ShieldAlert, User } from "lucide-react";

export default async function UsersAdminPage() {
  const session = await auth();

  if (session?.user?.role !== UserRole.SUPER_ADMIN) {
    redirect("/admin/posts");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-10">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-neutral-900">
              Utilisateurs
            </h1>
            <p className="text-neutral-500">
              Gestion des rôles et permissions de l'équipe.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700 border border-purple-100">
            <ShieldAlert size={14} />
            Zone Super Admin
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-6 py-4 font-medium">Utilisateur</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Date d'inscription</th>
                <th className="px-6 py-4 font-medium">Rôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt=""
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <User size={16} />
                        )}
                      </div>
                      <span className="font-medium text-neutral-900">
                        {user.name || "Sans nom"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-500">{user.email}</td>
                  <td className="px-6 py-4 text-neutral-400 tabular-nums">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    {user.email === session.user.email ? (
                      <span className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                        Vous
                      </span>
                    ) : (
                      <UserRoleSelector
                        userId={user.id}
                        currentRole={user.role}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}
