"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteGroupButton({
  id,
  groupName,
}: {
  id: string;
  groupName: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${groupName}"?\n\nThis will also delete all messages in the group and cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/group/${id}/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete group");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete group");
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center rounded-xl border border-red-800 bg-red-950/60 px-4 py-2 text-sm font-medium text-red-300 transition hover:border-red-600 hover:bg-red-900/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDeleting ? "Deleting..." : "Delete Group"}
      </button>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}