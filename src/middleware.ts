import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "./server/auth";
import { env } from "./env";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await getServerSession();

  if (request.nextUrl.pathname.startsWith("/recruiter")) {
    if (session.status === "unauthenticated") {
      const res = await fetch(
        `${env.SERVER_URL}/api/auth/oauth/signin?provider=google`,
        { redirect: "manual" }
      );
      const location = res.headers.get("location");
      if (location) {
        return NextResponse.redirect(location);
      }
    } else {
      if (
        session.status === "authenticated" &&
        session.data.recruiter === null &&
        request.nextUrl.pathname !== "/recruiter/register"
      ) {
        // console.log(env.SERVER_URL + "/recruiter/register");
        return NextResponse.redirect(env.SERVER_URL + "/recruiter/register");
      } else if (
        session.status === "authenticated" &&
        session.data.recruiter !== null &&
        request.nextUrl.pathname === "/recruiter/register"
      ) {
        return NextResponse.redirect(env.SERVER_URL + "/recruiter");
      }
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/recruiter/:path*"],
};
