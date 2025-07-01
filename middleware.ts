import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { signJwt, verifyJwt } from "@/action/jwt-token";

const protectedPaths = [
    "/dashboard", '/pos', '/test', "/profile", "/setting",//
    '/products', '/inventory', '/customers',//
    '/reports',//
];

const adminPaths = ["/admin",
    // "/admin/settings",
    // "/dashboard", '/pos', '/test', "/setting",//
    // '/products', '/inventory', '/customers',//
    // '/reports',//
];
const userPaths = ['/user',
    '/user/home'



];

const guestOnlyPaths = ["/login", "/register"];

const REFRESH_THRESHOLD_SECONDS = 60 * 5; // 5 minutes before expiry, refresh token

export async function middleware(request: NextRequest) {

    console.log('test')
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;

    // No token: redirect if accessing protected path
    if (!token) {
        if (protectedPaths.some((path) => pathname.startsWith(path))) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }

    const payload = await verifyJwt(token);
    const isAuthenticated = payload && typeof payload !== "string";

    if (guestOnlyPaths.some(path => path.includes(pathname))) {
        if (isAuthenticated) {
            if (payload.role === "USER") {
                return NextResponse.redirect(new URL("/user/home", request.url));
            } else if (payload.role === "ADMIN") {
                return NextResponse.redirect(new URL("/admin/dashboard", request.url));
            }
        }
        console.log('is guestOnlyPaths validate')
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!isAuthenticated) {
        if (protectedPaths.some((path) => pathname.includes(path))) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }
    // console.log(` is  role: ${payload.role}`)

    //FOR USER
    // Example: Block ADMIN from accessing /user-only routes (optional)
    // console.log(` is  admin: ${userPaths.some(path => pathname.startsWith(path))}`)
    if (userPaths.some(path => pathname.includes(path)) && payload.role !== "USER") {
        return NextResponse.redirect(new URL("/user/home", request.url));
    }
    // if (pathname.startsWith("/user-dashboard") && payload.role !== "USER") {
    //     return NextResponse.redirect(new URL("/403", request.url));
    // }


    //FOR ADMIN
    // Example: Block USER from accessing /admin routes
    // console.log(` is user : ${adminPaths.some(path => pathname.startsWith(path))}`)
    if (adminPaths.some(path => pathname.includes(path)) && payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        // return NextResponse.redirect(new URL("/profile", request.url));

    }
    // if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
    //     return NextResponse.redirect(new URL("/403", request.url)); // or show unauthorized
    // }


    // console.log('is end : ' + payload.role)
    console.log('is end : ')


    // ⬇️ Refresh token if needed
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const exp = (payload as any).exp;

    if (exp && exp - currentTimestamp < REFRESH_THRESHOLD_SECONDS) {
        const { exp, iat, ...userPayload } = payload as any;
        const newToken = await signJwt(userPayload);

        const response = NextResponse.next();

        response.cookies.set({
            name: "token",
            value: newToken,
            httpOnly: true,
            path: "/",
            maxAge: 60 * 15,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return response;
    }
    return NextResponse.next();
}
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
