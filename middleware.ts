import { signJwt, verifyJwt } from "@/action/jwt-token";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPaths = [
    "/dashboard", '/pos', '/test', "/profile", "/setting",//
    '/products', '/inventory', '/customers',//
    '/reports',
];

const adminPaths = [ "/admin",
    // "/admin/settings",
    // "/dashboard", '/pos', '/test', "/setting",//
    // '/products', '/inventory', '/customers',//
    // '/reports',//
];
const userPaths = [ '/user',
    '/user/home'

];

const guestOnlyPaths = [ "/login", "/register" ];

const REFRESH_THRESHOLD_SECONDS = 60 * 5; // 5 minutes before expiry, refresh token

export async function middleware(request: NextRequest) {

    // console.log('test')
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;

    // No token: For GUEST
    if (!token) {
        if (guestOnlyPaths.some(path => {
            const isInclude = path.includes(pathname)
            // console.log('guest only Path', path);
            // console.log('guest only Pathname', pathname);
            console.log('guest only isInclude', isInclude);
            return isInclude
        })) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/login", request.url));
    } else {
        // if (guestOnlyPaths.some(path => path === pathname)) {
        //     if()
        //     return NextResponse.next();
        // }
    }

    // Have Token
    const payload = await verifyJwt(token);
    if (!payload) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // current is http://localhost:3000/admin/dashboard
    // FOR USER
    // console.log('----- FOR USER start')
    if (userPaths.some(path => {
            const userPath = pathname.includes(path)
            // console.log('userPaths : path', path);
            // console.log('userPaths : pathname', pathname);
            // console.log(`userPaths : role ${payload.role}`, payload.role !== "USER");
            // console.log('userPaths : userPath is', userPath);
            return userPath
        }
    ) && payload.role !== "USER") {
        // console.log('will redirect to', payload.role);
        // return NextResponse.redirect(new URL("/user/home", request.url));
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (payload.role === "USER") {
        console.log('USER is Valid')
    }

    // console.log('----- FOR USER end')
    //
    // console.log('----- FOR ADMIN start')
    //FOR ADMIN
    if (adminPaths.some(path => {
            const adminPath = pathname.includes(path)
            // console.log('adminPaths : path', path);
            // console.log('adminPaths : pathname', pathname);
            // console.log('adminPaths : adminPath is ', adminPath);
            return adminPath
        }
    ) && payload.role !== "ADMIN") {

        return NextResponse.redirect(new URL("/user/home", request.url));
        // return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (payload.role === "ADMIN") {
        console.log('ADMIN is Valid')
    }
    // console.log('----- FOR ADMIN end')


    // console.log('is end : ' + payload.role)
    // console.log('is end : ')

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
