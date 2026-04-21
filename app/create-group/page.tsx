"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedGroupName = groupName.trim();
    const trimmedGroupDescription = groupDescription.trim();

    if (!trimmedGroupName || !trimmedGroupDescription) {
      setError("Please enter both a group name and a group description.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/create-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupName: trimmedGroupName,
          groupDescription: trimmedGroupDescription,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to create group.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-gray-950 via-gray-950 to-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-8 sm:px-6">
        <div className="mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-xl border border-gray-700 bg-gray-900/70 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-gray-500 hover:bg-gray-800"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Group chat
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Create a New Group
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-400">
              Start a new conversation space for your team, friends, or project
              group.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="groupName"
                className="mb-2 block text-sm font-medium text-white"
              >
                Group Name
              </label>
              <input
                id="groupName"
                name="groupName"
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-gray-800 bg-gray-950/80 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="groupDescription"
                className="mb-2 block text-sm font-medium text-white"
              >
                Group Description
              </label>
              <textarea
                id="groupDescription"
                name="groupDescription"
                rows={5}
                placeholder="Write a few sentences about the group"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                disabled={isSubmitting}
                className="w-full resize-none rounded-xl border border-gray-800 bg-gray-950/80 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
              />
              <p className="mt-2 text-sm text-gray-400">
                Describe what this group is for so others know its purpose.
              </p>
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmitting || !groupName.trim() || !groupDescription.trim()}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Group"}
              </button>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-gray-700 bg-gray-900/70 px-6 py-3 text-sm font-medium text-gray-200 transition hover:border-gray-500 hover:bg-gray-800"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}