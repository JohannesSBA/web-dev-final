import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";
import ChatInput from "@/app/components/ChatInput";
import Messages from "@/app/components/Messages";
import DeleteGroupButton from "@/app/components/DeleteGroupButton";
import { MessageType } from "@/app/types/Message";
import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/dev-session";

type Participant = {
  userId: string;
  userName: string;
};

export default async function Group({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getAppSession();

  if (!session) {
    redirect("/");
  }

  if (!ObjectId.isValid(id)) {
    redirect("/dashboard");
  }

  const group = await client
    .db("group-chat")
    .collection("groups")
    .findOne({ _id: new ObjectId(id) });

  if (!group) {
    redirect("/dashboard");
  }

  const messages = await client
    .db("group-chat")
    .collection("chats")
    .find({ groupId: id })
    .sort({ createdAt: 1 })
    .toArray();

  const serializedMessages: MessageType[] = messages.map((message) => ({
    id: message._id.toString(),
    messageId: message.messageId as string | undefined,
    message: message.message as string,
    userId: message.userId as string,
    userName: message.userName as string | undefined,
    groupId: message.groupId as string,
    createdAt: new Date(message.createdAt).toString(),
  }));

  const participantMap = new Map<string, Participant>();

  for (const message of serializedMessages) {
    const userId = message.userId;
    const userName =
      message.userName?.trim() || `User ${message.userId.slice(0, 6)}`;

    if (!participantMap.has(userId)) {
      participantMap.set(userId, {
        userId,
        userName,
      });
    }
  }

  const participants = Array.from(participantMap.values());

  const pusherKey =
    process.env.PUSHER_APP_KEY ?? process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "";
  const pusherCluster =
    process.env.PUSHER_CLUSTER ?? process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "";

  const currentUserId = session.user?.id as string;
  const isOwner = group.ownerId === currentUserId;
  const groupName = String(group.groupName ?? "Unnamed Group");

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-gray-950 via-gray-950 to-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-xl border border-gray-700 bg-gray-900/70 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-gray-500 hover:bg-gray-800"
          >
            ← Back to Dashboard
          </Link>

          {isOwner ? (
            <DeleteGroupButton id={id} groupName={groupName} />
          ) : null}
        </div>

        <div className="mb-5 rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="break-words text-3xl font-bold">{groupName}</h1>
              <p className="mt-2 break-words text-gray-400">
                {String(group.groupDescription ?? "No description")}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Owner
              </p>
              <p className="text-sm text-gray-300">
                {String(group.ownerName ?? "Unknown")}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <ChatInput id={id} />
        </div>

        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-h-[520px] rounded-2xl border border-gray-800 bg-gray-900/60 p-4 lg:h-[calc(100vh-280px)] lg:min-h-0">
            <Messages
              initialMessages={serializedMessages}
              id={id}
              pusherKey={pusherKey}
              pusherCluster={pusherCluster}
              userId={currentUserId}
            />
          </div>

          <aside className="h-fit rounded-2xl border border-gray-800 bg-gray-900/60 p-5 lg:sticky lg:top-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Participants ({participants.length})
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Users who have appeared in this conversation
              </p>
            </div>

            {participants.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-700 px-4 py-6 text-sm text-gray-400">
                No participants found yet.
              </div>
            ) : (
              <ul className="space-y-3">
                {participants.map((participant) => {
                  const isCurrentUser = participant.userId === currentUserId;

                  return (
                    <li
                      key={participant.userId}
                      className="rounded-xl border border-gray-800 bg-gray-950/70 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">
                            {participant.userName}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {participant.userId}
                          </p>
                        </div>

                        {isCurrentUser ? (
                          <span className="rounded-full bg-blue-600/20 px-2 py-1 text-xs font-medium text-blue-300">
                            You
                          </span>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}