import { env } from "~/env";
import { clearSessionCache } from "~/hooks/useSession";
import { getClientInfo } from "./client-info";

export async function logOut() {
  return fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).then((response) => {
    if (response.ok) {
      clearSessionCache();
    }
    return response;
  });
}

export function SignInWithProvider(provider: string, redirect: string | null) {
  if (typeof window !== "undefined") {
    const clientInfo = getClientInfo();
    let url = `${env.NEXT_PUBLIC_SERVER_URL}/api/auth/oauth/signin?provider=${provider}`;
    if (redirect) {
      url += `&redirect=${redirect}`;
    }
    if (clientInfo) {
      url += `&clientInfo=${encodeURIComponent(JSON.stringify(clientInfo))}`;
    }
    window.location.href = url;
  }
}
