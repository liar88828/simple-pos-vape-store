import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const shops = await prisma.market.findMany()
    // console.log('api execute')
    return NextResponse.json({ data: shops })
}