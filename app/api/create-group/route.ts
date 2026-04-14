import { NextResponse } from "next/server";
import client from "@/lib/mongodb";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();
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

  const group = await client
    .db("group-chat")
    .collection("groups")
    .insertOne({ groupName, groupDescription, ownerId: session.user?.id });
  return NextResponse.json(group);
}
