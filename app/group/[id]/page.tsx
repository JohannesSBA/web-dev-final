import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function Group({ params }: { params: { id: string } }) {
  const { id } = await params;
  const group = await client
    .db("group-chat")
    .collection("groups")
    .findOne({ _id: new ObjectId(id) });
  return (
    <div>
      <h1>{group?.groupName}</h1>
      <p>{group?.groupDescription}</p>
    </div>
  );
}
