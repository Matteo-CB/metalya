import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="font-serif text-xl font-bold tracking-tight">
            Metalya Admin
          </span>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span>{session.user.email}</span>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl p-6 md:p-12">{children}</main>
    </div>
  );
}
