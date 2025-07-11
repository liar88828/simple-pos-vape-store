'use server'
import { PreorderProduct } from "@/action/product-action";
import { ActionResponse } from "@/interface/actionType";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { PreOrderOptionalDefaults, Product } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function preOrderProductAction(
    preorder: PreOrderOptionalDefaults
): Promise<ActionResponse> {
    // logger.info(`input data preOrderProductAction`)

    try {
        await prisma.$transaction(async (tx) => {
            await tx.preOrder.create({ data: preorder })
            await tx.product.update({
                where: { id: preorder.productId },
                data: { stock: { increment: preorder.quantity } }
            })
        })

        revalidatePath('/')
        // console.log('success preOrderProductAction')
        logger.info(`success : preOrderProductAction`)
        return {
            success: true,
            message: "Successfully ordered",
            // data: dataPreorder
        }
    } catch (error) {
        logger.error(`error catch : ${ error }`)
        return {
            success: false,
            message: 'Something went wrong preOrderProduct'
        }
    }
}

export async function preOrderAction(
    preorder_new: PreOrderOptionalDefaults,
    preorder_old: PreorderProduct
): Promise<ActionResponse> {
    // console.log(preorder_new)
    // console.log("preorder_new")
    // console.log(preorder_new)
    // console.log("preorder_old")
    // console.log(preorder_old)
    try {
        await prisma.$transaction(async (tx) => {

            const product = await tx.product.findUniqueOrThrow({
                where: { id: preorder_new.productId },
                select: { stock: true },
            });

            const beforeStock = product.stock;
            const oldQty = preorder_old.quantity ?? 0;
            const newQty = preorder_new.quantity;
            const diff = oldQty - newQty; // final adjustment
            const quantityDiff = preorder_new.quantity - (preorder_old.quantity ?? 0);

            // console.log({
            //     beforeStock,
            //     oldQty,
            //     newQty,
            //     diff,
            //     expectedStock: beforeStock + diff
            // });

            await tx.product.update({
                where: { id: preorder_new.productId },
                data: {
                    // stock: adjustedStock
                    // stock: { increment: (preorder_old.quantity ?? 0) - preorder_new.quantity }
                    stock: {
                        decrement: diff, // subtract diff
                    }
                }
            })
            await tx.preOrder.update({
                where: { id: preorder_new.id },
                data: preorder_new
            })
        })

        revalidatePath('/')
        logger.info("success preOrderAction",)
        return {
            success: true,
            message: "Successfully Edit ordered",
            // data: dataPreorder
        }
    } catch (error) {
        logger.error(`error catch preOrderAction : ${ error }`,)
        return {
            success: false,
            message: 'Something went wrong Edit preOrderProduct'
        }
    }
}

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

export async function validPreorderProduct(id: number): Promise<ActionResponse> {
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

export async function deletePreorderProduct(id: number): Promise<ActionResponse> {

    const dataFind = await prisma.preOrder.findUnique({
        where: { id }
    })
    if (!dataFind) {
        return {
            success: false,
            message: "Preorder Is not found",
        }
    }

    const response = prisma.preOrder.delete({ where: { id } })

    revalidatePath('/')

    return {
        success: true,
        message: "Successfully ordered",
        data: response
    }
}

export async function getPreOrderStatusCount(status: 'Pending' | 'Success') {
    const data = await prisma.preOrder.count({
        where: { status }
    })
    logger.info("data : getPreOrderStatusCount",)
    return data
}

