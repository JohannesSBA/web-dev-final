import { MessageType } from "@/app/types/Message";

export default function Messages({ messages }: { messages: MessageType[] }) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div key={message._id.toString()} className="w-1/4 p-4 rounded-md">
          <p>{message.message}</p>
          <p>{message.userName ?? message.userId}</p>
          <p>{message.createdAt.toISOString()}</p>
        </div>
      ))}
    </div>
  );
}
