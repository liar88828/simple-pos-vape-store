'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from "@/lib/prisma";
import { ProductModel, } from "@/lib/generated/zod";
import { ActionResponse, LowStockProducts } from "@/interface/actionType";
import { ProductModelType } from "@/lib/schema";
import { Prisma, } from "@prisma/client";
import { Customer, PreOrder, Product, ProductOptionalDefaults } from "@/lib/generated/zod_gen";

export type TopSellingProduct = Product & {
    totalSold: number;
}
export const getProduct = async (
    name: string = '',
    limit: number = 100,
) => await prisma.product.findMany({
    where: { name: { contains: name } },
    take: limit
})

export async function getProductLowStock(): Promise<LowStockProducts[]> {
    return prisma.$queryRaw<
        Array<{ stock: number; minStock: number; id: number }>
    >(Prisma.sql`
        SELECT id, stock, minStock
        FROM Product
        WHERE stock <= minStock
    `);
}

export async function getProductLowStockComplete(): Promise<Product[]> {
    return prisma.$queryRaw<
        Array<Product>
    >(Prisma.sql`
        SELECT *
        FROM Product
        WHERE stock <= minStock
    `);
}

// export async function getProductLowStockComplete(): Promise<Product[]> {
//     return prisma.product.findMany({ where: { stock: { lte: 5 } } });
// }

export const deleteProduct = async (idProduct: ProductModelType['id']): Promise<ActionResponse> => {
    if (await prisma.product.findUnique({ where: { id: idProduct }, select: { id: true } })) {
        revalidatePath('/') // agar halaman ter-refresh
        return {
            success: true,
            data: await prisma.product.delete({ where: { id: idProduct } }),
            message: 'Success Delete Product'
        }
    }
    return {
        success: false,
        message: 'Fail Delete Product'
    }
}

export async function upsertProduct(formData: ProductOptionalDefaults): Promise<ActionResponse> {
    if (formData.id) return await updateProduct(formData)
    else return await addProduct(formData)

}

export async function addProduct(formData: ProductOptionalDefaults): Promise<ActionResponse> {
    try {

    const valid = ProductModel.safeParse(formData)

    if (!valid.success) {
        // console.error('Validation failed:', valid.error.flatten())
        // throw new Error('Data produk tidak valid.')
        return {
            data: valid.data,
            message: "Product Gagal di Tambahkan",
            error: valid.error.flatten().fieldErrors,
            success: false
        }
    }
    const { id, ...rest } = valid.data
    await prisma.product.create({
        data: rest
    })

    revalidatePath('/') // agar halaman ter-refresh
    return {
        data: valid.data,
        success: true,
        message: 'Produk berhasil ditambahkan'
    };
    } catch (error) {
        console.log(error)
        return {
            data: null,
            success: false,
            message: 'Something went wrong addProduct'
        }
    }
}

export async function updateProduct(formData: ProductOptionalDefaults): Promise<ActionResponse> {
    try {

    const valid = ProductModel.safeParse(formData)
    const productFound = await prisma.product.findUnique({ where: { id: formData.id }, select: { id: true } })
    if (!productFound) {
        return {
            data: valid.data,
            success: true,
            message: "Product Tidak Di Temukan",

        };
    }

    if (!valid.success) {
        return {
            data: valid.data,
            message: "Product Gagal diperbarui",
            error: valid.error.flatten().fieldErrors,
            success: false
        }
    }
    const { id, ...rest } = valid.data
    await prisma.product.update({
        where: { id },
        data: rest
    })

    revalidatePath('/') // agar halaman ter-refresh
    return {
        data: valid.data,
        success: true,
        message: 'Produk berhasil diperbarui'
    };

    } catch (error) {
        console.log(error)
        return {
            data: null,
            success: false,
            message: 'Something went wrong updateProduct'
        }
    }

}

export type PreorderProduct = PreOrder & {
    customer: Customer
    product: Product
};

export async function getPreOrder(): Promise<PreorderProduct[]> {
    return prisma.preOrder.findMany({
        orderBy: {},
        include: {
            customer: true,
            product: true
        }
    })
}

export async function getTopSellingProduct(limit: number = 5): Promise<TopSellingProduct[]> {
    const topProducts = await prisma.salesItem.groupBy({
        by: [ 'productId' ],
        _sum: { quantity: true },
        orderBy: {
            _sum: { quantity: 'desc' },
        },
        take: limit,
    });

    const productIds = topProducts.map(item => item.productId);

    const products = await prisma.product.findMany({

        where: {
            id: { in: productIds },
        },
        include: {
            SalesItems: {
                select: {
                    quantity: true,
                },
            },
        },
    });

    return topProducts.map(item => {
        const product = products.find(p => p.id === item.productId)
        if (product) {
            return {
                type: product.type,
                minStock: product.minStock,
                stock: product.stock,
                price: product.price,
                flavor: product.flavor,
                description: product.description,
                nicotineLevel: product.nicotineLevel,
                id: product.id,
                name: product.name,
                category: product.category,
                image: product.image,
                totalSold: item._sum.quantity ?? 0,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                sold: product.sold,
                expired: product.expired,
            } satisfies TopSellingProduct
        }
    }).filter(item => item !== undefined)
}

export async function getTodayVsYesterdaySales() {
    const now = new Date();

    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfTomorrow = new Date(now.setHours(24, 0, 0, 0));

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const endOfYesterday = new Date(startOfToday);

    const today = await prisma.sale.aggregate({
        _sum: { total: true },
        where: { date: { gte: startOfToday, lt: startOfTomorrow } },
    });

    const yesterday = await prisma.sale.aggregate({
        _sum: { total: true },
        where: { date: { gte: startOfYesterday, lt: endOfYesterday } },
    });

    const todayTotal = today._sum.total ?? 0;
    const yesterdayTotal = yesterday._sum.total ?? 0;

    const percentChange = yesterdayTotal === 0
        ? 100
        : ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;

    return { todayTotal, percentChange };
}