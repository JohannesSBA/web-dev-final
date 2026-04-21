import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import ChatInput from "@/app/components/ChatInput";
import Messages from "@/app/components/Messages";
import { MessageType } from "@/app/types/Message";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Group({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const group = await client
    .db("group-chat")
    .collection("groups")
    .findOne({ _id: new ObjectId(id) });

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

  const pusherKey =
    process.env.PUSHER_APP_KEY ?? process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "";
  const pusherCluster =
    process.env.PUSHER_CLUSTER ?? process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "";

  return (
    <div className="relative min-h-screen w-full bg-linear-to-b from-gray-950 via-gray-950 to-black text-white">
      <div className="w-full h-full flex flex-col justify-center items-center gap-6">
        <h1 className="text-3xl font-bold mt-4">
          Group Name: {group?.groupName}
        </h1>
        <p className="text-2xl">Description: {group?.groupDescription}</p>
        <ChatInput id={id} />
        <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col gap-3">
          <Messages
            initialMessages={serializedMessages}
            id={id}
            pusherKey={pusherKey}
            pusherCluster={pusherCluster}
            userId={session.user?.id as string}
          />
        </div>
      </div>
    </div>
  );
}
