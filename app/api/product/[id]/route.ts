import { ActionResponse } from "@/interface/actionType";
import { prisma } from "@/lib/prisma"
import type { Product } from "@prisma/client"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ActionResponse<Product>>> {
    try {
        const { id: productId } = await params
        console.log(`is executed GET product ${ productId }`)
        if (productId) {
            return NextResponse.json(
                {
                    message: "Invalid product ID",
                    success: false,
                },
                { status: 400 }
            )
        }

        const productData = await prisma.product.findUnique({
            where: { id: productId },
        })

        if (!productData) {
            return NextResponse.json(
                {
                    message: "Product not found",
                    success: false,
                },
                { status: 404 }
            )
        }

        return NextResponse.json({
            data: productData,
            success: true,
            message: `Product ${ productId } has been successfully retrieved`,
        })

    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        return NextResponse.json(
            {
                message,
                success: false,
            },
            {
                status: 500,
                // statusText: "Internal Server Error",
            }
        )
    }
}
