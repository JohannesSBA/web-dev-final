import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import ChatInput from "@/app/components/ChatInput";
import Messages from "@/app/components/Messages";
import { MessageType } from "@/app/types/Message";

export default async function Group({ params }: { params: { id: string } }) {
  const { id } = await params;
  const group = await client
    .db("group-chat")
    .collection("groups")
    .findOne({ _id: new ObjectId(id) });

  const messages = await client
    .db("group-chat")
    .collection("chats")
    .find({ groupId: id })
    .sort({ createdAt: -1 })
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
    process.env.PUSHER_CLUSTER ??
    process.env.NEXT_PUBLIC_PUSHER_CLUSTER ??
    "";

  return (
    <div>
      <h1>{group?.groupName}</h1>
      <p>{group?.groupDescription}</p>
      <ChatInput id={id} />
      <Messages
        initialMessages={serializedMessages}
        id={id}
        pusherKey={pusherKey}
        pusherCluster={pusherCluster}
      />
    </div>
  );
}
