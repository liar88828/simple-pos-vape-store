'use server'

import { getSessionUserPage } from "@/action/auth-action";
import { ActionResponse, CartItem, } from "@/interface/actionType";
import { ERROR } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { Customer, SalesItemOptionalDefaults } from "@/lib/validation";
import { Prisma, STATUS_PREORDER } from "@prisma/client";
import { revalidatePath } from "next/cache";
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

export async function createTransactionAction(
    product: CartItem[],
    customer: Customer | null,
    marketId: string,
): Promise<ActionResponse> {
    // console.log('execute');

    try {

        const user = await getSessionUserPage()
        if (!customer) {
            logger.error("error : customer data is not found createTransaction ");
            return {
                error: ERROR.NOT_FOUND,
                message: "Please Select Customer Data",
                success: false,
            }
        }

        const dataTransaction = await prisma.$transaction(async (tx) => {

            const saleDB = await tx.sale.create({
                data: {
                    marketId,
                    seller_userId: user.userId,
                    items: product.length,
                    total: product.reduce((a, b) => a + (b.price * b.quantity), 0),
                    date_buy: new Date(),
                    buyer_customerId: customer.id,
                    statusTransaction: STATUS_PREORDER.Pending,
                    typeTransaction: 'Sistem Dev'//'Cash'
                }
            })
            // console.log('execute saleItemList')
            const saleItemList = product.map(item => {
                return {
                    saleId: saleDB.id,
                    productId: item.id,
                    quantity: item.quantity, // from origin product
                    priceAtBuy: item.price,// from origin product
                    preorderId: item.preorderId
                    // category: item.category,
                } satisfies Omit<SalesItemOptionalDefaults, 'id'>
            })
            const saleItemDB = await tx.salesItem.createMany({ data: saleItemList })

            // console.log('execute product.update')
            for (const item of saleItemList) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity },
                        sold: { increment: item.quantity }
                    },
                });
            }
            // console.log('execute customer.update')
            await tx.customer.update({
                where: { id: customer.id },
                data: {
                    lastPurchase: new Date(),
                    totalPurchase: { increment: saleItemList.reduce((a, b) => a + b.priceAtBuy * b.quantity, 0) },
                },
            });

            // console.log('execute finish')

            return { saleItemDB, saleDB }
        })

        // console.log('execute revalidatePath')
        revalidatePath('/')
        logger.info('data : createTransaction')
        return {
            data: dataTransaction,
            message: "Success Create Data",
            success: true,
        }

    } catch (error) {
        logger.error('error catch : createTransaction');
        if (error instanceof PrismaClientKnownRequestError) {
            return {
                success: false,
                data: null,
                error: ERROR.DATABASE,
                message: error.message
            }
        }

        return {
            error: ERROR.SYSTEM,
            message: "Fail Create Data",
            success: false,
        }
    }
}
