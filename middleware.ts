import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * First gate on /admin.
 *
 * `useAuth` mirrors the access token into an `access_token` cookie on login, so
 * the edge can tell a signed-in visitor from an anonymous one before any admin
 * HTML is served. It deliberately checks presence only: the cookie is not
 * verified here, and the role it belongs to is not visible at this layer.
 *
 * The real checks live behind it — `AdminGuard` verifies the role client-side,
 * and the API rejects a token that is missing, expired, or not an admin's. This
 * exists so an anonymous visitor never reaches the panel at all.
 */
export function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;

    if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        url.searchParams.set("signin", "1");
        url.searchParams.set("next", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
