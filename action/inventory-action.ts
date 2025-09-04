'use server'
import { ActionResponse } from "@/interface/actionType";
import { prisma } from "@/lib/prisma";
import { Product } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function oldpreOrderProduct(
    data: { quantity: number, date: Date },
    product: Product,
): Promise<ActionResponse> {

    // const dataPreorder = await prisma.preOrder.create({
    //     data: {
    //         productId: product.id,
    //         estimatedDate: data.date,
    //         status: 'Order',
    //         quantity: data.quantity,
    //     }
    // })

    revalidatePath('/')

    return {
        success: true,
        message: "Successfully ordered",
        // data: dataPreorder
    }
}

export async function validPreorderProduct(id: string): Promise<ActionResponse> {
    const dataFind = await prisma.preOrder.findUnique({
        where: { id }
    })
    if (!dataFind) {
        return {
            success: false,
            message: "Preorder Is not found",
        }
    }

    const response = await prisma.$transaction(async (tx) => {

        const dataPreorder = await tx.preOrder.update({
            where: { id },
            data: { status: 'Success' }
        })

        await tx.product.update({
            where: { id: dataPreorder.productId },
            data: { stock: { increment: dataPreorder.quantity }, }
        })
        return dataPreorder
    })

    revalidatePath('/')

    return {
        success: true,
        message: "Successfully ordered",
        data: response
    }
}
