"use client";

import type Pusher from "pusher-js";

let client: Pusher | null = null;

type PusherPublicConfig = { key: string; cluster: string };

export async function getPusherClient(
  config: PusherPublicConfig,
): Promise<Pusher> {
  if (client) return client;

  const key =
    config.key.trim() || (process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "").trim();
  const cluster =
    config.cluster.trim() ||
    (process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "").trim();

  if (!key || !cluster) {
    throw new Error(
      "Pusher key or cluster is missing. Set PUSHER_APP_KEY and PUSHER_CLUSTER in .env.local and pass them from the server page, or set NEXT_PUBLIC_PUSHER_APP_KEY and NEXT_PUBLIC_PUSHER_CLUSTER.",
    );
  }

  const mod = await import("pusher-js");
  const PusherCtor = mod.default;

  client = new PusherCtor(key, { cluster });

  return client;
}
