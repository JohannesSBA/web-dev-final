import { auth } from "@/auth";
import client from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const { message } = await request.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  await client.db("group-chat").collection("chats").insertOne({
    message,
    userId: session.user?.id,
    groupId: id,
    createdAt: new Date(),
    userName: session.user?.name,
  });
  return NextResponse.json({ message: "Message sent" });
}
