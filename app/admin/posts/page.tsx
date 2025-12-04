import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, PostStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { formatDate, cn } from "@/lib/utils";
import {
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import { updatePostStatus, deletePostAdmin } from "@/app/actions/admin";
import { AdminPagination } from "@/components/admin/admin-pagination";

interface PostsAdminPageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function PostsAdminPage(props: PostsAdminPageProps) {
  const session = await auth();
  const searchParams = await props.searchParams;

  if (!session?.user) redirect("/login");

  const isAdmin =
    session.user.role === UserRole.ADMIN ||
    session.user.role === UserRole.SUPER_ADMIN;
  const isRedacteur = session.user.role === UserRole.REDACTEUR;

  const statusParam = searchParams.status;
  const currentStatus = statusParam || "ALL";
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = 10;

  const where: any = {};

  if (
    currentStatus !== "ALL" &&
    Object.values(PostStatus).includes(currentStatus as PostStatus)
  ) {
    where.status = currentStatus as PostStatus;
  }

  // Transaction pour récupérer les données et le compte total en une fois (optimisation)
  const [totalItems, posts] = await prisma.$transaction([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      include: { author: true },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const tabs = [
    { label: "Tous", value: "ALL" },
    { label: "Publiés", value: PostStatus.PUBLISHED },
    { label: "En attente", value: PostStatus.PENDING },
    { label: "Brouillons", value: PostStatus.DRAFT },
    { label: "Rejetés", value: PostStatus.REJECTED },
  ];

  return (
    <div className="py-10">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold text-neutral-900">
            Articles
          </h1>
          <Link
            href="/admin/create"
            className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
          >
            Nouvel Article
          </Link>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={
                tab.value === "ALL" ? "/admin/posts" : `?status=${tab.value}`
              }
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                currentStatus === tab.value
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-100"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="grid gap-4">
          {posts.map((post) => {
            const isOwner = post.authorId === session.user.id;
            const canEdit =
              isAdmin ||
              (isRedacteur && isOwner && post.status !== "PUBLISHED");
            const canPublish = isAdmin;

            return (
              <div
                key={post.id}
                className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md md:flex-row md:items-center md:justify-between"
              >
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        post.status === "PUBLISHED" &&
                          "bg-emerald-100 text-emerald-700",
                        post.status === "PENDING" &&
                          "bg-amber-100 text-amber-700",
                        post.status === "DRAFT" &&
                          "bg-neutral-100 text-neutral-600",
                        post.status === "REJECTED" && "bg-red-100 text-red-700"
                      )}
                    >
                      {post.status === "PUBLISHED" && <CheckCircle size={12} />}
                      {post.status === "PENDING" && <Clock size={12} />}
                      {post.status === "DRAFT" && <FileText size={12} />}
                      {post.status === "REJECTED" && <XCircle size={12} />}
                      {post.status}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="text-xs font-medium text-neutral-600">
                      par {post.author.name}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-neutral-900">
                    {post.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 border-t border-neutral-100 pt-4 md:border-t-0 md:pt-0">
                  {canPublish && post.status === "PENDING" && (
                    <>
                      <form
                        action={async () => {
                          "use server";
                          await updatePostStatus(post.id, "PUBLISHED");
                        }}
                      >
                        <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">
                          Valider
                        </button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await updatePostStatus(post.id, "REJECTED");
                        }}
                      >
                        <button className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">
                          Rejeter
                        </button>
                      </form>
                    </>
                  )}

                  {canEdit && (
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </Link>
                  )}

                  {canEdit && (
                    <form
                      action={async () => {
                        "use server";
                        await deletePostAdmin(post.id);
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

          {posts.length === 0 && (
            <div className="py-20 text-center text-neutral-500">
              Aucun article trouvé dans cette catégorie.
            </div>
          )}
        </div>

        <AdminPagination totalPages={totalPages} />
      </Container>
    </div>
  );
}
