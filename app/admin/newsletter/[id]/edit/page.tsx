import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { EditorClient } from "./client";
import { NewsletterStatus, UserRole } from "@prisma/client";

interface EditNewsletterPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNewsletterPage(
  props: EditNewsletterPageProps
) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const newsletter = await prisma.newsletter.findUnique({
    where: { id: params.id },
  });

  if (!newsletter) notFound();

  const isOwner = newsletter.authorId === session.user.id;
  const isAdmin =
    session.user.role === UserRole.ADMIN ||
    session.user.role === UserRole.SUPER_ADMIN;

  // Le rédacteur doit pouvoir modifier ses propres brouillons ou pending
  if (!isAdmin && !isOwner) {
    return <div>Accès refusé</div>;
  }

  if (newsletter.status === NewsletterStatus.SENT) {
    return <div>Impossible de modifier une campagne déjà envoyée.</div>;
  }

  return <EditorClient newsletter={newsletter} />;
}
