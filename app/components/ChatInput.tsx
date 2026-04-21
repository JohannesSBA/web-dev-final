"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ChatInput({ id }: { id: string }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`/api/chat/${id}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to send message");
      }

      setMessage("");

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex w-full items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900/60 p-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          disabled={isPending}
          className="flex-1 rounded-xl bg-transparent px-3 py-3 text-white outline-none placeholder:text-gray-500"
        />

        <button
          type="submit"
          disabled={isPending || !message.trim()}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Sending..." : "Send"}
        </button>
      </div>

      {error ? (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      ) : null}
    </form>
  );
}