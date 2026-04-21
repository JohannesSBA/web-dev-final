import { auth } from "@/auth";
import client from "@/lib/mongodb";
import { redirect } from "next/navigation";
import SignOut from "../components/auth/sing-out";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const groups = await client
    .db("group-chat")
    .collection("groups")
    .find()
    .toArray();

  return (
    <div className="relative min-h-screen w-full bg-linear-to-b from-gray-950 via-gray-950 to-black text-white">
      <div className="absolute top-4 right-4">
        <SignOut />
      </div>

      <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-16 sm:px-6">
        <header className="mb-12 text-center sm:mb-14">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Group chat
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome, {session.user?.name ?? "there"}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-400">
            Create a space for your team or open an existing group below.
          </p>
          <Link
            href="/create-group"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            Create a new group chat
          </Link>
        </header>
        <section aria-labelledby="groups-heading" className="flex-1">
          <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="groups-heading"
                className="text-xl font-semibold sm:text-2xl"
              >
                All group chats
              </h2>
              <p className="text-sm text-gray-400">
                {groups.length === 0
                  ? "No groups yet — create the first one."
                  : `${groups.length} group${groups.length === 1 ? "" : "s"} available`}
              </p>
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {groups.map((group) => (
              <li key={group._id.toString()}>
                <Link
                  href={`/group/${group._id.toString()}`}
                  className="group block h-full rounded-2xl border border-gray-800 bg-gray-900/60 p-5 shadow-md transition hover:border-gray-600 hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  <p className="text-lg font-semibold text-white group-hover:text-blue-100 truncate">
                    {group.groupName as string}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-400">
                    {(group.groupDescription as string) || "No description"}
                  </p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Owner ·{" "}
                    <span className="normal-case text-gray-400">
                      {group.ownerName as string}
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
