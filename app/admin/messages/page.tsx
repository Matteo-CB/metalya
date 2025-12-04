import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { formatDate, cn } from "@/lib/utils";
import { Inbox, Send, Plus, CheckCheck, User, Reply } from "lucide-react";
import Link from "next/link";
import { markAsRead, sendMessage } from "@/app/actions/messaging";

interface MessagesPageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function MessagesPage(props: MessagesPageProps) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const tab = searchParams.tab || "inbox";

  if (!session?.user) return null;

  let messages = [];

  if (tab === "sent") {
    messages = await prisma.message.findMany({
      where: { senderId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        recipients: { include: { user: true } },
      },
    });
  } else {
    const receipts = await prisma.messageRecipient.findMany({
      where: { userId: session.user.id },
      orderBy: { message: { createdAt: "desc" } },
      include: {
        message: {
          include: { sender: true },
        },
      },
    });
    messages = receipts.map((r) => ({
      ...r.message,
      isRead: r.isRead,
      recipientId: r.id,
    }));
  }

  return (
    <div className="py-6 lg:py-10">
      <Container>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:mb-8">
          <h1 className="font-serif text-2xl font-bold text-neutral-900 lg:text-3xl">
            Messagerie
          </h1>
          <Link
            href="/admin/messages/create"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-neutral-800 sm:w-auto"
          >
            <Plus size={18} />
            Nouveau Message
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:pb-0">
            <Link
              href="?tab=inbox"
              className={cn(
                "flex flex-1 items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors lg:justify-start",
                tab === "inbox"
                  ? "bg-indigo-50 text-indigo-700"
                  : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200 lg:border-transparent"
              )}
            >
              <Inbox size={18} />
              Boîte de réception
            </Link>
            <Link
              href="?tab=sent"
              className={cn(
                "flex flex-1 items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors lg:justify-start",
                tab === "sent"
                  ? "bg-indigo-50 text-indigo-700"
                  : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200 lg:border-transparent"
              )}
            >
              <Send size={18} />
              Envoyés
            </Link>
          </div>

          <div className="lg:col-span-3">
            <div className="flex flex-col gap-4">
              {messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={cn(
                    "relative flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md lg:p-6",
                    tab === "inbox" && !msg.isRead
                      ? "border-indigo-100 bg-indigo-50/30"
                      : "border-neutral-200"
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100 text-neutral-500">
                        {msg.sender?.image ? (
                          <img
                            src={msg.sender.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-neutral-900">
                          {tab === "sent" ? "À : " : "De : "}
                          {tab === "sent"
                            ? msg.recipients
                                .map((r: any) => r.user.name)
                                .join(", ")
                            : msg.sender.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatDate(msg.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      {tab === "inbox" && msg.isRead && (
                        <span className="flex items-center gap-1 text-xs font-medium text-neutral-400">
                          <CheckCheck size={14} /> Lu
                        </span>
                      )}
                      {tab === "inbox" && !msg.isRead && (
                        <form action={markAsRead.bind(null, msg.id)}>
                          <button className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white hover:bg-indigo-700">
                            Marquer comme lu
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-bold text-neutral-900">
                      {msg.subject}
                    </h3>
                    <div className="prose prose-sm max-w-none text-neutral-600">
                      {msg.content.split("\n").map((p: string, i: number) => (
                        <p key={i} className="mb-1 break-words">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>

                  {tab === "inbox" && (
                    <details className="group mt-2">
                      <summary className="flex cursor-pointer items-center gap-2 text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-800">
                        <Reply size={16} />
                        Répondre
                      </summary>
                      <form
                        action={sendMessage}
                        className="mt-4 flex flex-col gap-3"
                      >
                        <input
                          type="hidden"
                          name="recipients"
                          value={msg.sender.id}
                        />
                        <input
                          type="hidden"
                          name="subject"
                          value={`Re: ${msg.subject}`}
                        />
                        <textarea
                          name="content"
                          rows={3}
                          className="w-full rounded-lg border border-neutral-200 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="Écrivez votre réponse..."
                          required
                        />
                        <div className="flex justify-end">
                          <button className="flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800">
                            <Send size={14} />
                            Envoyer la réponse
                          </button>
                        </div>
                      </form>
                    </details>
                  )}
                </div>
              ))}

              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-500">
                  <Inbox size={48} className="mb-4 opacity-20" />
                  <p>Aucun message pour le moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
