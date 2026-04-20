"use client";

import { useState } from "react";

export default function ChatInput({ id }: { id: string }) {
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(`/api/chat/${id}/send`, {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });
    if (response.ok) {
      setInput("");
    } else {
      console.error("Failed to send message");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-1/2 flex gap-2 items-center justify-center p-4 rounded-lg border border-gray-800"
    >
      <input
        type="text"
        placeholder="Enter your message"
        required
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 active:outline-none focus:outline-none"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </form>
  );
}
