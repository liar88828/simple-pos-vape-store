'use server'

import { getSessionEmployeePage } from "@/action/auth-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function handlerOrderIn(form: FormData): Promise<string> {
    try {

        const session = await getSessionEmployeePage()

        const { data, error } = z.object({
            quantity: z.string().min(1),
            idProduct: z.string().min(1),
            idPreorder: z.string().min(1),
        })
        .transform(data => ({
            quantity: Number(data.quantity),
            idProduct: data.idProduct,
            idPreorder: data.idPreorder
        }))
        .safeParse({
            quantity: form.get('quantity'),
            idProduct: form.get('idProduct'),
            idPreorder: form.get('idPreorder')
        })

        // console.log(data,error  );

        if (error) {
            throw new Error('Please Input Data')
            // return {
            //     success: false,
            //     message: ,
            // }
        }

        await prisma.$transaction(async (tx) => {

            const { id, userId, quantity, sellIn_shopId, ...preOrderDB } = await tx.preOrder.update({
                where: { id: data.idPreorder },
                data: { quantity: { decrement: data.quantity } }
            })
            if (quantity < 0) {//
                throw new Error('quantity cannot be minus')
            }
            await tx.preOrder.create({
                data: {
                    ...preOrderDB,
                    quantity: data.quantity,
                    userId: session.userId,
                    sellIn_shopId: session.shopId
                }
            })
            revalidatePath('/')
        })
        return "Stock could not be created!"

    } catch (e: unknown) {
        console.error('is error')
        if (e instanceof Error) {
            throw e.message
        }

        throw 'Something went wrong!'
    }

}