// withAuth is a NextAuth wrapper around Next.js middleware. It automatically reads the NextAuth session token from the request cookies, so you don't have to manually parse JWT cookies yourself. It injects the token into the authorized callback.
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next();
    },
    {
        callbacks: {
            // req — the incoming request (gives you the URL, headers, etc.)
            // token — the decoded JWT from the NextAuth session cookie, or null if not logged in
            authorized({ req, token }) {
                const { pathname } = req.nextUrl;

                // Public auth routes — always allow
                // /api/auth is NextAuth's own internal routes (signin, signout, session, csrf). If you blocked these, nobody could ever log in.
                if (pathname.startsWith("/api/auth") || pathname === "/login" || pathname === "/register") {
                    return true;
                }

                // Public content routes — always allow
                if (pathname === "/" || pathname.startsWith("/api/videos")) {
                    return true;
                }

                return !!token;
            }
        }
    }
)


// This tells Next.js which paths the middleware should actually run on.Without it, middleware runs on every single request including static files, which is wasteful.
export const config = {
    matcher: [
        /*
            * Match all request paths except:
            * - _next/static (static files)
            * - _next/image (image optimization files)
            * - favicon.ico(favicon file)
            * - public folder
        */
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ]
}

/*
    * This is a Next.js middleware that runs on every request before it reaches your pages or API routes. It acts as a route guard — deciding who is allowed to access what.

    Request comes in
        ↓
    Middleware runs (proxy.ts)
        ↓
    Is it a public route? → allow through
        ↓
    Is there a valid token? → allow through
        ↓
    No token? → redirect to /api/auth/signin (NextAuth default)
    
*/