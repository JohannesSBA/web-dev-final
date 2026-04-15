import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/mongodb";

export default async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const chats = await client
    .db("group-chat")
    .collection("chats")
    .find({ groupId: id })
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json({ chats });
}
