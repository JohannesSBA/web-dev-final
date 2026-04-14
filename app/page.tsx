import { auth } from "@/auth";
import SignIn from "./components/auth/sign-in";
import SignOut from "./components/auth/sing-out";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <SignIn />
    </div>
  );
}
