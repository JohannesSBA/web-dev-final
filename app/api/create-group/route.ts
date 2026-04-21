import { NextResponse } from "next/server";
import client from "@/lib/mongodb";
import { getAppSession } from "@/lib/dev-session";

export async function POST(request: Request) {
  const session = await getAppSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { groupName, groupDescription } = await request.json();

  if (!groupName || !groupDescription) {
    return NextResponse.json(
      { error: "Group name and description are required" },
      { status: 400 },
    );
  }

  const existingGroup = await client
    .db("group-chat")
    .collection("groups")
    .findOne({ groupName });

  if (existingGroup) {
    return NextResponse.json(
      { error: "Group already exists" },
      { status: 400 },
    );
  }

  const ownerId = session.user?.id ?? "unknown-user";
  const ownerName = session.user?.name?.trim() || "Unknown";

  const group = await client.db("group-chat").collection("groups").insertOne({
    groupName,
    groupDescription,
    ownerId,
    ownerName,
    createdAt: new Date(),
  });

  return NextResponse.json(group);
}