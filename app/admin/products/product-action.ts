'use server'
import { ProductData } from "@/app/admin/products/products-page";
import { ActionResponse } from "@/interface/actionType";
import { STATUS_PREORDER } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import {
    PreOrderOptionalDefaults,
    PreOrderOptionalDefaultsSchema, ProductOptionalDefaults,
    ProductOptionalDefaultsSchema
} from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function upsertProductAction(formData: ProductData): Promise<ActionResponse> {
    if (formData.id) return await updateProductAction(formData)
    else return await addProductAction(formData)
}

export async function addProductAction({ priceNormal, expired, ...formData }: ProductData): Promise<ActionResponse> {
    logger.info('action addProductAction')

    try {
        const valid = ProductOptionalDefaultsSchema.safeParse(formData)
        if (!valid.success) {
            const errorValidation = valid.error.flatten().fieldErrors
            logger.error('error validation addProductAction', errorValidation)
            // console.error('Validation failed:', valid.error.flatten())
            // throw new Error('Data produk tidak valid.')
            return {
                data: valid.data,
                message: "Product Gagal di Tambahkan",
                error: errorValidation,
                success: false
            }
        }

        const { id, ...data } = valid.data
        await prisma.$transaction(async (tx) => {
            const productDB = await tx.product.create({ data })

            await tx.preOrder.create({
                data: PreOrderOptionalDefaultsSchema.parse({
                    productId: productDB.id,
                    quantity: productDB.stock,
                    status: STATUS_PREORDER.SUCCESS,
                    priceSell: productDB.price,
                    priceNormal: priceNormal ?? 0,
                    expired,
                } satisfies PreOrderOptionalDefaults)
            })
        })

        revalidatePath('/') // agar halaman ter-refresh
        logger.info('success addProductAction')
        return {
            data: valid.data,
            success: true,
            message: 'Produk berhasil ditambahkan'
        };
    } catch (error) {
        // console.log(error)
        logger.error('error catch addProductAction')
        return {
            data: null,
            success: false,
            message: 'Something went wrong addProductAction'
        }
    }
}

export async function updateProductAction(formData: ProductOptionalDefaults): Promise<ActionResponse> {
    logger.info('action input updateProductAction')

    try {
        const valid = ProductOptionalDefaultsSchema.safeParse(formData)
        const productFound = await prisma.product.findUnique({ where: { id: formData.id }, select: { id: true } })
        if (!productFound) {
            logger.error('error DB updateProductAction')
            return {
                data: valid.data,
                success: true,
                message: "Product Tidak Di Temukan",

            };
        }

        if (!valid.success) {
            const dataValidation = valid.error.flatten().fieldErrors
            logger.error('error validation updateProductAction', dataValidation)
            return {
                data: valid.data,
                message: "Product Gagal diperbarui",
                error: dataValidation,
                success: false
            }
        }
        const { id, ...rest } = valid.data
        await prisma.product.update({
            where: { id },
            data: rest
        })

        revalidatePath('/') // agar halaman ter-refresh
        logger.info('success : updateProductAction')
        return {
            data: valid.data,
            success: true,
            message: 'Produk berhasil diperbarui'
        };

    } catch (error) {
        // console.log(error)
        logger.error('error catch updateProductAction')
        return {
            data: null,
            success: false,
            message: 'Something went wrong updateProduct'
        }
    }

}
