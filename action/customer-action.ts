'use server'

import { ActionResponse } from "@/interface/actionType";
import { STATUS_USER } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { CustomerModelNew, CustomerModelType } from "@/lib/schema";
import { Customer } from "@/lib/validation";
import { ROLE_USER } from "@prisma/client";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function createCustomer(
    name: string,
    password?: string,
    email?: string
) {
    return prisma.$transaction(async (tx) => {
        const isEmail = email ?? `${ name }@shop.com`
        const isPassword = password ?? await bcrypt.hash(isEmail, 10)

        const userDB = await tx.user.create({
            data: {
                name: name,
                role: ROLE_USER.USER,
                email: isEmail,
                password: isPassword,
                marketId_workIn: null,
            }
        })

        await tx.customer.create({
            data: {
                buyer_userId: userDB.id,
                name: userDB.name,
                lastPurchase: new Date(),
                status: STATUS_USER.PENDING,
                totalPurchase: 0,
                age: 0,
            }
        });
    })
}



// Create a new customer/ In POS admin
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
        const customer = await prisma.$transaction(async (tx) => {
            const name = `${ valid.data.name }@create.com`
            const userDB = await tx.user.create({
                data: {
                    name: valid.data.name,
                    email: name,
                    password: await bcrypt.hash(name, 10),
                    role: ROLE_USER.USER

                }
            });

            return tx.customer.create({
                data: {
                    buyer_userId: userDB.id,
                    status: "pending",
                    age: 0,
                    lastPurchase: new Date(),
                    name: valid.data.name,
                    totalPurchase: 0,
                }
            });
        })


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
