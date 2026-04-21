import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAppSession } from "@/lib/dev-session";

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAppSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid group id" }, { status: 400 });
  }

  const groupsCollection = client.db("group-chat").collection("groups");
  const chatsCollection = client.db("group-chat").collection("chats");

  const group = await groupsCollection.findOne({ _id: new ObjectId(id) });

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const currentUserId = session.user?.id;

  if (!currentUserId || group.ownerId !== currentUserId) {
    return NextResponse.json(
      { error: "Only the group owner can delete this group" },
      { status: 403 },
    );
  }

  await chatsCollection.deleteMany({ groupId: id });
  await groupsCollection.deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ message: "Group deleted successfully" });
}