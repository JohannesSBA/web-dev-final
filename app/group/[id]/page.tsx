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

  const messages = (await client
    .db("group-chat")
    .collection("chats")
    .find({ groupId: id })
    .sort({ createdAt: -1 })
    .toArray()) as MessageType[];

  return (
    <div>
      <h1>{group?.groupName}</h1>
      <p>{group?.groupDescription}</p>
      <ChatInput id={id} />
      <Messages messages={messages} />
    </div>
  );
}
