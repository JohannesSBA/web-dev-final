import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl dark:text-white">
          Welcome {session.user?.name}
        </h2>
        <div className="mt-10 flex items-center gap-x-6">
          <a
            href="#"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
          >
            Create a new Group Chat
          </a>
          <p className="text-sm/6 font-semibold text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Browse through all the Group Chats Below
          </p>
        </div>
      </div>
    </div>
  );
}
