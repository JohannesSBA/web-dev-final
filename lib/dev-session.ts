import { auth } from "@/auth";

type DevSession = {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export async function getAppSession(): Promise<DevSession | null> {
  const session = await auth();

  if (session) {
    return session;
  }

  if (process.env.DEV_BYPASS_AUTH === "true") {
    return {
      user: {
        id: "local-dev-user",
        name: "Local Dev User",
        email: "local@example.com",
        image: null,
      },
    };
  }

  return null;
}