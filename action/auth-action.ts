"use server";

import { prisma } from "@/lib/prisma"; // Adjust this path
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

import { signJwt, signRefreshJwt, verifyJwt, verifyRefreshJwt } from "@/action/jwt-token";
import { cookies } from "next/headers";
import { ActionResponse } from "@/interface/actionType";
import { LoginFormData, loginSchema, RegisterFormData, registerSchema } from "@/lib/auth-schema";
import { revalidatePath } from "next/cache";

export async function registerAction(rawData: RegisterFormData): Promise<ActionResponse> {
    const parsed = registerSchema.safeParse(rawData);

    if (!parsed.success) {
        return {
            message: "Fail Validate Data",
            success: false,
            error: parsed.error.flatten().fieldErrors
        };
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return {
            success: false,
            message: `User already exists`,
            error: { email: ["Email is already registered"] }
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: { name, email, password: hashedPassword },
    });

    await prisma.customer.create({
        data: { name, age: 0, lastPurchase: new Date(), status: "Pending", totalPurchase: 0 }
    })




    redirect("/login"); // or wherever you want
}

export async function loginAction(rawData: LoginFormData): Promise<ActionResponse> {
    const parsed = loginSchema.safeParse(rawData);

    if (!parsed.success) {
        return {
            message: "Fail Validate Data",
            success: false,
            error: parsed.error.flatten().fieldErrors
        };
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return {
            message: "User Is not Found",
            success: false,
        };
    }
    if (!(await bcrypt.compare(password, user.password))) {
        return {
            message: "Passwords do not match",
            success: false,
        };
    }

    // Create access + refresh tokens
    const accessToken = await signJwt({ userId: user.id, email: user.email, role: user.role, name: user.name });
    const refreshToken = await signRefreshJwt({ userId: user.id });

    // Set cookie
    const cookieStore = await cookies()

    // Set HttpOnly cookies
    cookieStore.set({
        name: "token",
        value: accessToken,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 15, // 15 minutes
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    cookieStore.set({
        name: "refreshToken",
        value: refreshToken,
        httpOnly: true,
        path: "/api/auth/refresh", // restrict refresh token path
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    revalidatePath('/')
    redirect("/");

    // return {
    //     success: true,
    //     message: "Success Login",
    //     // data: { accessToken, refreshToken }
    // };
}

// Refresh token server action
export async function refreshTokenAction() {
    const cookieStore = await cookies();
    const token = cookieStore.get("refreshToken")?.value;

    if (!token) {
        redirect("/login");
    }

    const payload = await verifyRefreshJwt(token);

    if (!payload) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
            id: true,
            email: true,
            role: true,
            name: true
        }
    })
    if (!user) {
        redirect("/login");
    }

    // Issue new access token
    const newAccessToken = await signJwt({ userId: user.id, email: user.email, role: user.role, name: user.name });

    cookieStore.set({
        name: "token",
        value: newAccessToken,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 15,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    redirect("/dashboard");
}

export async function getUserFromRequest() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const payload = verifyJwt(token);
    if (!payload) return null;

    // Optionally fetch user from DB by payload.userId
    return payload;
}

export const deleteCookie = async () => {
    const cookieStore = await cookies()
    cookieStore.delete('token')
}

export async function getSessionUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value ?? ''
    // console.log("token : " + token)
    const payload = await verifyJwt(token);
    return payload
}


