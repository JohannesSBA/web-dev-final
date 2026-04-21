import client from "@/lib/mongodb";
import { pusherServer } from "@/lib/pusher-server";
import { NextRequest, NextResponse } from "next/server";
import { getAppSession } from "@/lib/dev-session";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAppSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { message: messageText } = await request.json();

  if (!messageText || typeof messageText !== "string") {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const userId = session.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messageId = crypto.randomUUID();
  const createdAt = new Date();

  const { insertedId } = await client.db("group-chat").collection("chats").insertOne({
    messageId,
    message: messageText,
    userId,
    groupId: id,
    createdAt,
    userName: session.user?.name ?? "Local Dev User",
  });

  const payload = {
    id: insertedId.toString(),
    messageId,
    message: messageText,
    userId,
    userName: session.user?.name ?? "Local Dev User",
    groupId: id,
    createdAt: createdAt.toString(),
  };

  await pusherServer.trigger(id, "incoming-message", payload);

  return NextResponse.json({ message: "Message sent" });
}