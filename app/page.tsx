import { auth } from "@/auth";
import SignIn from "./components/auth/sign-in";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="relative min-h-screen w-full bg-linear-to-b from-gray-950 via-gray-950 to-black text-white flex items-center justify-center">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-16 sm:px-6">
        <header className="mb-12 text-center sm:mb-14">
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome to Group Chat
          </h1>
        </header>
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-400">
            Create a space for your team or open an existing group below.
          </p>
          <SignIn />
        </div>
      </main>
    </div>
  );
}
