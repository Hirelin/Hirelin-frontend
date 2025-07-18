import { cookies } from "next/headers";
import { env } from "~/env";
import type { ServerSessionReturn, User } from "~/types/types";
import { SESSION_TOKEN_NAME } from "~/zod/constants";

export async function getServerSession(): Promise<ServerSessionReturn> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_TOKEN_NAME);

  const res = await fetch(`${env.SERVER_URL}/api/auth/session`, {
    method: "GET",
    headers: {
      Cookie: `session_id=${sessionId?.value};`,
    },
  });

  if (res.status === 200) {
    const data = await res.json();
    return {
      data: data.session.user as User,
      status: "authenticated",
      error: null,
    };
  } else {
    return {
      data: null,
      status: "unauthenticated",
      error: await res.text(),
    };
  }
}
