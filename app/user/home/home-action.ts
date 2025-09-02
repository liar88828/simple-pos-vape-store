'use server'
import { getSessionUserPage } from "@/action/auth-action";
import { ActionResponse, CartItem, SaleCustomers } from "@/interface/actionType";
import { ERROR, STATUS_TRANSACTION } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { SalesItemOptionalDefaults } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError

export async function createTransactionUserAction(product: CartItem[]): Promise<ActionResponse> {
    // console.log('execute');
    try {
        let customerId
        const session = await getSessionUserPage()
        const customer = await prisma.customer.findFirst({ where: { name: session?.name } })

        if (!customer) {
            const customerDB = await prisma.customer.create({
                data: {
                    name: session?.name ?? '',
                    age: 0,
                    lastPurchase: new Date(),
                    status: "Pending",
                    totalPurchase: 0
                }
            })

            customerId = customerDB?.id
        } else {
            customerId = customer.id
        }

        const dataTransaction = await prisma.$transaction(async (tx) => {

            const saleDB = await tx.sale.create({
                data: {
                    items: product.length,
                    total: product.reduce((a, b) => a + (b.price * b.quantity), 0),
                    date: new Date(),
                    customerId: customerId,
                    statusTransaction: STATUS_TRANSACTION.PENDING,
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
                where: { id: customerId },
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
        logger.info('data : createTransactionUserAction')
        return {
            data: dataTransaction,
            message: "Success Create Data",
            success: true,
        }

    } catch (error) {
        logger.error('error catch createTransactionUserAction')
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

export async function createTransactionUserPendingAction(
    product: CartItem[],
    salePending: SaleCustomers
): Promise<ActionResponse> {
    // console.log('execute pending');
    try {
        const dataTransaction = await prisma.$transaction(async (tx) => {

            const saleDB = await tx.sale.update({
                where: { id: salePending.id },
                data: {
                    items: product.length,
                    total: product.reduce((a, b) => a + (b.price * b.quantity), 0),
                    date: new Date(),
                }
            })
            await tx.salesItem.deleteMany({ where: { saleId: saleDB.id } })
            logger.debug('executed salesItem.deleteMany')

            // Old Data--------
            const saleItemListOld = salePending.SaleItems.map(item => {
                return {
                    saleId: saleDB.id,
                    productId: item.productId,
                    quantity: item.quantity, // from origin product
                    priceAtBuy: item.priceAtBuy,// from origin product
                } satisfies Omit<SalesItemOptionalDefaults, 'id'>
            })

            for (const item of saleItemListOld) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { increment: item.quantity },
                        sold: { decrement: item.quantity }
                    },
                });
            }
            logger.debug('executed saleItemListOld OLD')

            // Now Data --------
            // console.log('execute product.update NOW')

            const saleItemListNew = product.map(item => {
                return {
                    saleId: saleDB.id,
                    productId: item.id,
                    quantity: item.quantity, // from origin product
                    priceAtBuy: item.price,// from origin product

                    // category: item.category,
                } satisfies Omit<SalesItemOptionalDefaults, 'id'>
            })

            const saleItemDB = await tx.salesItem.createMany({ data: saleItemListNew })

            for (const item of saleItemListNew) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity },
                        sold: { increment: item.quantity }
                    },
                });
            }
            logger.debug('executed saleItemListNew NEW')

            const totalBuyNow = saleItemListNew.reduce((a, b) => a + b.priceAtBuy * b.quantity, 0);
            const totalBuyOld = saleItemListOld.reduce((a, b) => a + b.priceAtBuy * b.quantity, 0);

            await tx.customer.update({
                where: { id: salePending.customerId },
                data: {
                    lastPurchase: new Date(),
                    totalPurchase: { increment: totalBuyNow - totalBuyOld },
                },
            });
            logger.debug('executed customer.update')
            // Now Data --------

            // console.log('execute finish')

            return { saleItemDB, saleDB }
        })

        // console.log('execute revalidatePath')
        revalidatePath('/')
        logger.info('data : createTransactionUserPending')
        return {
            data: dataTransaction,
            message: "Success Create Data",
            success: true,
        }

    } catch (error) {
        logger.error('error catch : createTransactionUserPending');
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

