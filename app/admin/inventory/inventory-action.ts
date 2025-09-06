'use server'

import { getSessionEmployeePage } from "@/action/auth-action";
import { getPreorder, PreorderProduct } from "@/action/product-action";
import { InventoryPaging } from "@/app/admin/inventory/inventory-page";
import { ActionResponse, ContextPage } from "@/interface/actionType";
import { getContextPage } from "@/lib/context-action";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { PreOrderOptionalDefaults } from "@/lib/validation";
import { STATUS_PREORDER } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getExpiredProduct = async (): Promise<PreorderProduct[]> => {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const data = await prisma.preOrder.findMany({
        where: {
            expired: {
                not: null,
                gte: oneYearAgo, // expired date >= 1 year ago
                lte: now,        // expired date <= today
            },
        },
        include: {
            Product: true, // optional
        },
    });
    logger.info('data : getExpiredProduct')
    return data
}

export async function preOrderProductAction(
    preorder: PreOrderOptionalDefaults
): Promise<ActionResponse> {
    // logger.info(`input data preOrderProductAction`)

    try {
        const session = await getSessionEmployeePage()
        await prisma.$transaction(async (tx) => {
            const preOrderDB = await tx.preOrder.create({
                data: {
                    ...preorder,
                    sellIn_shopId: session.shopId,
                    userId: session.userId,
                    status: STATUS_PREORDER.Pending,
                },
            })
            const productDB = await tx.product.update({
                where: { id: preorder.productId },
                data: { stock: { increment: preorder.quantity } }
            })
            return { preOrderDB, productDB }
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
        const session = getSessionEmployeePage()

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
                    stock: { decrement: diff, /* subtract diff */ }
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

export async function deletePreorderProduct(id: string): Promise<ActionResponse> {

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
        const preOrderDB = await tx.preOrder.delete({ where: { id } })
        await prisma.product.update({
            where: { id: preOrderDB.productId },
            data: {
                stock: { decrement: preOrderDB.quantity }
            },
        })

        return preOrderDB
    })

    revalidatePath('/')
    return {
        success: true,
        message: "Successfully ordered",
        data: response
    }
}

export const getPreorderPage = async (context: ContextPage): Promise<InventoryPaging> => {
    return await getPreorder({
        inventoryName: await getContextPage(context, 'inventoryName'),
        inventoryStock: await getContextPage(context, 'inventoryStock'),
        inventoryExpired: await getContextPage(context, 'inventoryExpired'),
        inventoryLimit: await getContextPage(context, 'inventoryLimit'),
        inventoryPage: await getContextPage(context, 'inventoryPage'),
    })
}