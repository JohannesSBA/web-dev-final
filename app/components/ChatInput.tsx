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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button>Send</button>
    </form>
  );
}
