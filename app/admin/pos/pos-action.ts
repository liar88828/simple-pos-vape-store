'use server'

import { ActionResponse, CartItem, } from "@/interface/actionType";
import { ERROR, STATUS_TRANSACTION } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { CustomerModelNew, CustomerModelType } from "@/lib/schema";
import { Customer, SalesItemOptionalDefaults } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

export async function createTransactionAction(product: CartItem[], customer: Customer | null): Promise<ActionResponse> {
    // console.log('execute');
    try {
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
                    items: product.length,
                    total: product.reduce((a, b) => a + (b.price * b.quantity), 0),
                    date: new Date(),
                    customerId: customer.id,
                    statusTransaction: STATUS_TRANSACTION.PENDING
                    , typeTransaction: 'Sistem Dev'//'Cash'
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

// Action
// Create a new customer
export async function createCustomerNew(formData: CustomerModelType): Promise<ActionResponse<Customer>> {
    try {
        const valid = CustomerModelNew.safeParse(formData);
        if (!valid.success) {
            return {
                data: valid.data,
                message: "Pelanggan gagal ditambahkan",
                error: valid.error.flatten().fieldErrors,
                success: false,
            };
        }
        const customer = await prisma.customer.create({
            data: {
                status: "pending",
                age: 0,
                lastPurchase: new Date(),
                name: valid.data.name,
                totalPurchase: 0,
            }
        });

        revalidatePath("/"); // Refresh halaman agar data baru tampil
        logger.info("success createCustomerNew ", customer);
        return {
            data: customer,
            success: true,
            message: "Pelanggan berhasil ditambahkan",
        };
    } catch (error) {
        // console.log(error);
        logger.error("error createCustomerNew ", error);

        return {
            success: true,
            message: "Pelanggan berhasil ditambahkan",
        };
    }

}
