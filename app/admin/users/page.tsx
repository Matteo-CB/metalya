import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { UserRoleSelector } from "@/components/admin/user-role-selector";
import { UserSearch } from "@/components/admin/user-search";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { formatDate, cn } from "@/lib/utils";
import { ShieldAlert, User } from "lucide-react";
import Link from "next/link";

interface UsersAdminPageProps {
  searchParams: Promise<{
    q?: string;
    role?: string;
    page?: string;
  }>;
}

export default async function UsersAdminPage(props: UsersAdminPageProps) {
  const session = await auth();
  const searchParams = await props.searchParams;

  if (session?.user?.role !== UserRole.SUPER_ADMIN) {
    redirect("/admin/posts");
  }

  const query = searchParams.q || "";
  const roleFilter = (searchParams.role as UserRole | "ALL") || "ALL";
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = 10;

  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ];
  }

  if (roleFilter !== "ALL") {
    where.role = roleFilter;
  }

  const [totalItems, users] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const roles = [
    { label: "Tous", value: "ALL" },
    { label: "Utilisateurs", value: UserRole.USER },
    { label: "Rédacteurs", value: UserRole.REDACTEUR },
    { label: "Admins", value: UserRole.ADMIN },
    { label: "Super Admins", value: UserRole.SUPER_ADMIN },
  ];

  return (
    <div className="py-6 lg:py-10">
      <Container>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-neutral-900 lg:text-3xl">
              Utilisateurs
            </h1>
            <p className="text-sm text-neutral-500 lg:text-base">
              {totalItems} comptes enregistrés
            </p>
          </div>
          <div className="w-full md:w-64">
            <UserSearch />
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {roles.map((r) => (
            <Link
              key={r.value}
              href={`?role=${r.value}${query ? `&q=${query}` : ""}`}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors lg:text-sm",
                roleFilter === r.value
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-100"
              )}
            >
              {r.label}
            </Link>
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-6 py-4 font-medium">Utilisateur</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Rôle</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-neutral-100 text-neutral-500">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt=""
                            className="h-full w-full object-cover"
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
                  <td className="px-6 py-4 text-right">
                    {user.email !== session.user.email && (
                      <DeleteUserButton userId={user.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 md:hidden">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-100 text-neutral-500">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">
                      {user.name || "Sans nom"}
                    </p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                </div>
                {user.email !== session.user.email && (
                  <DeleteUserButton userId={user.id} />
                )}
              </div>

              <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                <div className="text-xs text-neutral-400">
                  Inscrit le {formatDate(user.createdAt)}
                </div>
                <div>
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
                </div>
              </div>
            </div>
          ))}
        </div>

        <AdminPagination totalPages={totalPages} />
      </Container>
    </div>
  );
}
