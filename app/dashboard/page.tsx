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
      <div className="w-full h-full flex flex-col justify-center items-center gap-6">
        <h2 className="text-3xl font-bold">Welcome {session.user?.name}</h2>
        <a href="/create-group" className="inline-block bg-gray-900 border border-gray-600 hover:border-blue-500 hover:bg-gray-700 px-6 py-3 rounded-lg transition-all duration-200">
            Create a new Group Chat
        </a>
        <p className="text-2xl font-bold">
            Browse through all the Group Chats Below
        </p>
        <div className="w-1/3 h-full flex flex-col justify-center items-center gap-4 rounded-md shadow-md">
          {groups.map((group) => (
            <a
              key={group._id.toString()}
              href={`/group/${group._id.toString()}`}
              className="bg-gray-900 hover:bg-gray-700 text-white transition-all p-4 rounded-lg border border-gray-700 hover:border-gray-500 w-full truncate"
            >
              {group.groupName}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
