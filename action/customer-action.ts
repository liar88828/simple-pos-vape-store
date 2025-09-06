'use server'

import { STATUS_USER } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { ROLE_USER } from "@prisma/client";
import bcrypt from "bcrypt";

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
                workIn_shopId: null,
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