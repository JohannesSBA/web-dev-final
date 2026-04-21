import { signOut } from "@/auth";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="bg-red-500 hover:bg-red-600 text-white transition-all p-4 rounded-lg border border-gray-700 hover:border-gray-500 w-full truncate"
    >
      <button type="submit">Sign out</button>
    </form>
  );
}
