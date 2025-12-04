import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { AdminNav } from "@/components/admin/admin-nav";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== UserRole.ADMIN &&
      session.user.role !== UserRole.SUPER_ADMIN &&
      session.user.role !== UserRole.REDACTEUR)
  ) {
    redirect("/login");
  }

  // Compter les messages non lus
  const unreadCount = await prisma.messageRecipient.count({
    where: {
      userId: session.user.id,
      isRead: false,
    },
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-serif text-xl font-bold tracking-tight text-neutral-900"
            >
              Metalya<span className="text-neutral-300">.</span>
            </Link>
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
              {session.user.role}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500">
              {session.user.email}
            </span>
            <div className="h-8 w-8 overflow-hidden rounded-full bg-neutral-200">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
        <AdminNav role={session.user.role} unreadCount={unreadCount} />
      </header>
      <main>{children}</main>
    </div>
  );
}
