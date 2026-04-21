"use client";

import { MessageType } from "@/app/types/Message";
import { getPusherClient } from "@/lib/pusher-client";
import type Pusher from "pusher-js";
import { useEffect, useRef, useState } from "react";

export default function Messages({
  initialMessages,
  id,
  pusherKey,
  pusherCluster,
  userId,
}: {
  initialMessages: MessageType[];
  id: string;
  pusherKey: string;
  pusherCluster: string;
  userId: string;
}) {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

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
            return [...prev, incoming];
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

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="h-full min-h-[420px] lg:min-h-0">
      <div
        ref={scrollRef}
        className="flex h-full flex-col gap-3 overflow-y-auto pr-2"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-700 text-sm text-gray-400">
            No messages yet. Start the conversation.
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.userId === userId;

            return (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                  isCurrentUser
                    ? "self-end bg-blue-500 text-white"
                    : "self-start bg-gray-500 text-white"
                }`}
              >
                <p className="mb-1 text-sm font-semibold">
                  {message.userName ?? message.userId}
                </p>

                <p className="break-words text-sm leading-relaxed">
                  {message.message}
                </p>

                <p className="mt-2 text-xs opacity-80">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}