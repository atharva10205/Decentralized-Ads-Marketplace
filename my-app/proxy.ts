import { NextResponse } from "next/server"
import { auth } from "./app/api/auth/[...nextauth]/route"

export default auth((req) => {
    const token = req.auth;
    const userRole = token?.user?.role;

    if (!token) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    const path = req.nextUrl.pathname

    if (!userRole && path !== "/Role") {
        return NextResponse.redirect(new URL("/Role", req.url))
    }

    if (userRole && path === "/Role") {
        if (userRole === "publisher") {
            return NextResponse.redirect(new URL("/Publisher/Dashboard", req.url))
        }
        if (userRole === "advertiser") {
            return NextResponse.redirect(new URL("/Advertiser/Dashboard", req.url))
        }
    }
    
    if (userRole === "advertiser" && path.startsWith("/Publisher")) {
        return NextResponse.redirect(new URL("/Advertiser/Dashboard", req.url))
    }

    if (userRole === "publisher" && path.startsWith("/Advertiser")) {
        return NextResponse.redirect(new URL("/Publisher/Dashboard", req.url))
    }
    
    return NextResponse.next()
})

export const config = {
    matcher: [
        "/Publisher/:path*",
        "/Advertiser/:path*",
        "/Role",
    ]
}