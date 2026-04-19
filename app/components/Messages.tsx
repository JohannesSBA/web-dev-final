"use client";

import { MessageType } from "@/app/types/Message";
import { getPusherClient } from "@/lib/pusher-client";
import type Pusher from "pusher-js";
import { useEffect, useState } from "react";

export default function Messages({
  initialMessages,
  id,
  pusherKey,
  pusherCluster,
}: {
  initialMessages: MessageType[];
  id: string;
  pusherKey: string;
  pusherCluster: string;
}) {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);

  useEffect(() => {
    let cancelled = false;
    let channel: ReturnType<Pusher["subscribe"]> | null = null;
    let pusherClient: Pusher | null = null;
    let messageHandler: ((data: MessageType) => void) | null = null;

    getPusherClient({ key: pusherKey, cluster: pusherCluster })
      .then((client) => {
        if (cancelled) return;
        pusherClient = client;
        const ch = client.subscribe(id);
        channel = ch;

        messageHandler = (incoming: MessageType) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === incoming.id)) {
              return prev;
            }
            return [incoming, ...prev];
          });
        };

        ch.bind("incoming-message", messageHandler);
      })
      .catch((err) => {
        console.error("[Messages] Pusher client failed:", err);
      });

    return () => {
      cancelled = true;
      if (channel && messageHandler) {
        channel.unbind("incoming-message", messageHandler);
      }
      if (pusherClient) {
        pusherClient.unsubscribe(id);
      }
    };
  }, [id, pusherKey, pusherCluster]);

  return (
    <div className="flex flex-col gap-2 max-h-150 overflow-y-auto">
      {messages.map((message) => (
        <div key={message.id} className="w-full p-4 rounded-md">
            <span className="font-bold ">
                {message.userName ?? message.userId}:
            </span>{" "}
            <span className="break-words">
                {message.message}
            </span>
          <p>{new Date(message.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
