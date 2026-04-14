import { auth } from "@/auth";
import client from "@/lib/mongodb";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const groups = await client
    .db("group-chat")
    .collection("groups")
    .find({ ownerId: session.user?.id })
    .toArray();

  return (
    <div className="min-h-screen w-full h-full flex justify-center items-center ">
      <div className="w-full h-full flex flex-col justify-center items-center gap-8">
        <h2 className="">Welcome {session.user?.name}</h2>
        <a href="/create-group">Create a new Group Chat</a>
        <p>Browse through all the Group Chats Below</p>
        <div className="w-1/2 h-full flex flex-col justify-center items-center gap-8  p-8 rounded-md shadow-md">
          {groups.map((group) => (
            <a
              key={group._id.toString()}
              href={`/group/${group._id.toString()}`}
              className="bg-indigo-500 p-4 rounded-md w-2/3"
            >
              {group.groupName}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
