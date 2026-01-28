import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;

        if (!token) {
            return NextResponse.redirect(new URL("/", req.url))
        }

        const path = req.nextUrl.pathname
        console.log("Middleware - Path:", path)
        console.log("Middleware - Token:", token)

        if (!token.role && path !== "/Role") {
            return NextResponse.redirect(new URL("/Role", req.url))
        }

        if (token.role && path === "/Role") {
            if (token.role === "publisher") {
                return NextResponse.redirect(new URL("/Publisher/Dashboard", req.url))
            }
            if (token.role === "advertiser") {
                return NextResponse.redirect(new URL("/Advertiser/Dashboard", req.url))
            }
        } 
        if (token.role === "advertiser" && path.startsWith("/Publisher")) {
            return NextResponse.redirect(new URL("/Advertiser/Dashboard", req.url))
        }

        if (token.role === "publisher" && path.startsWith("/Advertiser")) {
            return NextResponse.redirect(new URL("/Publisher/Dashboard", req.url))
        }
        return NextResponse.next()

    }, {
    callbacks: {
        authorized: ({ token }) => {
            return true
        }
    }
}
)

export const config = {
    matcher: [
        "/Publisher/:path*",
        "/Advertiser/:path*",
        "/Role",
    ]
}

