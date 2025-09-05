'use server'
import { getSessionUserPage } from "@/action/auth-action";
import {
    ActionResponse,
    CartItem,
    SaleCustomers,
    SessionEmployeePayload,
    SessionUserPayload
} from "@/interface/actionType";
import { ERROR, STATUS_PREORDER } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { SalesItemOptionalDefaults } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

const PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError

export async function createTransactionUserAction(
    product: CartItem[],
    shopId: string
): Promise<ActionResponse> {

    try {
        console.log('execute');
        const session = await getSessionUserPage()
        const customer = await prisma.customer.findUnique({
            where: { buyer_userId: session.userId }
        })
        if (!customer) {
            redirect('/login')
        }
        const dataTransaction = await prisma.$transaction(async (tx) => {
            const saleDB = await tx.sale.create({
                data: {
                    shopId: shopId,
                    seller_userId: null,
                    buyer_customerId:
                    customer.id,
                    items: product.length,
                    total: product.reduce((a, b) => a + (b.price * b.quantity), 0),
                    date: new Date(),
                    statusTransaction:
                    STATUS_PREORDER.PENDING,
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
        logger.info('data : createTransactionUserAction')
        return {
            data: dataTransaction,
            message: "Success Create Data",
            success: true,
        }

    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

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

export async function deleteSale(saleId: string): Promise<ActionResponse> {
    try {
        const session = await getSessionUserPage()
        const customer = await prisma.customer.findUnique({
            select: { id: true },
            where: { buyer_userId: session.userId }
        })
        if (!customer) {
            redirect('/login')
        }
        const dataTransaction = await prisma.$transaction(async (tx) => {
            // Find sale
            const saleDB = await tx.sale.findUnique({
                where: {
                    id: saleId,
                    buyer_customerId: customer.id
                },
                include: { SaleItems: true }
            })
            if (!saleDB) {
                throw new Error("Sale not found")
            }

            // Restore product stock and sold count
            for (const item of saleDB.SaleItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { increment: item.quantity },
                        sold: { decrement: item.quantity }
                    },
                })
            }

            // Update customer purchase total
            if (saleDB.buyer_customerId) {
                const rollbackTotal = saleDB.SaleItems.reduce(
                    (a, b) => a + b.priceAtBuy * b.quantity,
                    0
                )
                await tx.customer.update({
                    where: { id: saleDB.buyer_customerId },
                    data: {
                        totalPurchase: { decrement: rollbackTotal }
                    }
                })
            }

            // Delete saleItems
            await tx.salesItem.deleteMany({
                where: { saleId: saleDB.id }
            })

            // Delete sale itself
            await tx.sale.delete({
                where: { id: saleDB.id }
            })

            return { saleDB }
        })

        revalidatePath('/')
        logger.info('data : deleteSale')
        return {
            data: dataTransaction,
            message: "Success Delete Data",
            success: true,
        }
    } catch (error) {
        logger.error('error catch deleteSale')
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
            message: "Fail Delete Data",
            success: false,
        }
    }
}

export async function createTransactionUserPendingAction(
    product: CartItem[],
    salePending: SaleCustomers
): Promise<ActionResponse> {
    console.log('execute pending is update');
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
                where: { id: salePending.buyer_customerId },
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

export async function getHistoriesUser(session: SessionUserPayload): Promise<SaleCustomers[]> {
    const customer = await prisma.customer.findUnique({
        where: {
            buyer_userId: session.userId
        }
    })
    if (!customer) {
        redirect('/login')
    }

    return prisma.sale.findMany({
        orderBy: { date: "desc" },
        where: {
            buyer_customerId: customer.id
        },
        include: {
            Customer: true,
            SaleItems: {
                include: {
                    product: true
                }
            },
        }
    })
}

export async function getHistoriesEmployee(session: SessionEmployeePayload): Promise<SaleCustomers[]> {

    return prisma.sale.findMany({
        orderBy: { date: "desc" },
        where: { shopId: session.shopId, },
        include: {
            Customer: true,
            SaleItems: {
                include: {
                    product: true
                }
            },
        }
    })
}