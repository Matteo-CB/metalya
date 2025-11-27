import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostEditorClient } from "./client";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage(props: EditPostPageProps) {
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  return <PostEditorClient post={post} />;
}
