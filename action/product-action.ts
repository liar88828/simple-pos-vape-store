'use server'

import { InventoryPaging } from "@/app/admin/inventory/inventory-page";
import { ActionResponse, ContextPage, SaleCustomers } from "@/interface/actionType";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { Customer, Market, PreOrder, Product, } from "@/lib/validation";
import { Prisma, } from "@prisma/client";
import { revalidatePath } from 'next/cache'

export type TopSellingProduct = Product & {
    totalSold: number;
}
export type BrandsProps = { brand: string | null }[];

export type ProductPreorder = Product & { PreOrders: PreOrder[] }

export type ProductPreorderShop = Product & {
    PreOrders: (PreOrder & {
        Market: Market
    })[]
};

export type ProductPaging = {
    data: ProductPreorder[],
    total: number,
    // brands: BrandsProps
};

export type PreorderProductCustomer = PreOrder & {
    Customer: Customer
    Product: Product
};

export type PreorderProduct = PreOrder & {
    Product: Product
};

export const getProduct = async (
    context: ContextPage,
    shopId?: string | null,
): Promise<ProductPaging> => {
    const {
        productName,
        productBrand,
        productCategory,
        productTypeDevice,
        productNicotine,
        productResistant,
        productCoil,
        productBattery,
        productCotton,
        productFluid,
        productLimit,
        productPage,
    } = await context.searchParams

    const limit = Number(productLimit ?? 10);
    const page = Number(productPage ?? 0);

    const where: Prisma.ProductWhereInput = {

        name: productName && productName !== '-'
            ? { contains: productName, }
            : undefined,

        resistanceSize: productResistant && productResistant !== '-'
            ? { contains: productResistant, }
            : undefined,

        cottonSize: productCotton && productCotton !== '-'
            ? { contains: productCotton, }
            : undefined,

        batterySize: productBattery && productBattery !== '-'
            ? { contains: productBattery, }
            : undefined,

        brand: productBrand && productBrand !== '-'
            ? { contains: productBrand, }
            : undefined,

        category: productCategory && productCategory !== '-'
            ? { contains: productCategory, }
            : undefined,

        coilSize: productCoil && productCoil !== '-'
            ? { contains: productCoil, }
            : undefined,

        type: productTypeDevice && productTypeDevice !== '-'
            ? { contains: productTypeDevice, }
            : undefined,

        nicotineLevel: productNicotine && productNicotine !== '-'
            ? { contains: productNicotine, }
            : undefined,

        fluidLevel: productFluid && productFluid !== '-'
            ? { contains: productFluid, }
            : undefined,

        PreOrders: shopId
            ? { some: { marketId_sellIn: shopId } }
            : undefined
    }

    const data = await prisma.product.findMany({
        where,
        take: limit,
        skip: page * limit,
        include: {
            PreOrders: {
                orderBy: {
                    updatedAt: 'desc'
                }
            }
        },
        orderBy: { updatedAt: 'desc' },
    })
    logger.info('data : getProduct')

    return {
        data,
        total: await prisma.product.count({ where }),
    }
}

// export const getProductPage = async (
//     context: ContextPage,
//     shopId: string | null,
// ): Promise<ProductPaging> => {
//     return getProduct({
//         shopId,
//         productName: await getContextPage(context, 'productName'),
//         productBrand: await getContextPage(context, 'productBrand'),
//         productCategory: await getContextPage(context, 'productCategory'),
//         productTypeDevice: await getContextPage(context, 'productTypeDevice'),
//         productNicotine: await getContextPage(context, 'productNicotine'),
//         productResistant: await getContextPage(context, 'productResistant'),
//         productCoil: await getContextPage(context, 'productCoil'),
//         productBattery: await getContextPage(context, 'productBattery'),
//         productCotton: await getContextPage(context, 'productCotton'),
//         productFluid: await getContextPage(context, 'productFluid'),
//         productLimit: await getContextPage(context, 'productLimit'),
//         productPage: await getContextPage(context, 'productPage')
//     })
// }

export type LowStockProducts = { stock: number, minStock: number, id: number };

export async function getProductLowStock(): Promise<LowStockProducts[]> {
    'use cache'
    const data = await prisma.$queryRaw<
        Array<{ stock: number; minStock: number; id: number }>
    >(Prisma.sql`
        SELECT id, stock, minStock
        FROM Product
        WHERE stock <= minStock
    `);
    logger.info('data : getProductLowStock')
    return data
}

export async function getProductLowStockComplete(): Promise<Product[]> {
    const data = await prisma.$queryRaw<
        Array<Product>
    >(Prisma.sql`
        SELECT *
        FROM Product
        WHERE stock <= minStock
    `);
    logger.info('data : getProductLowStockComplete')
    return data
}

export const deleteProductAction = async (idProduct: Product['id']): Promise<ActionResponse> => {
    // logger.info('action input : deleteProduct')

    if (await prisma.product.findUnique({ where: { id: idProduct }, select: { id: true } })) {
        revalidatePath('/') // agar halaman ter-refresh
        logger.info('success : deleteProduct')
        const product = await prisma.$transaction(async (tx) => {

            await tx.preOrder.deleteMany({
                where: {
                    productId: idProduct,
                }
            })

            await tx.salesItem.deleteMany({
                where: {
                    productId: idProduct
                }
            })
            return tx.product.delete({
                where: { id: idProduct },
            })
        })
        revalidatePath('/')
        return {
            success: true,
            data: product,
            message: 'Success Delete Product'
        }
    }

    logger.error('error :  deleteProduct')
    return {
        success: false,
        message: 'Fail Delete Product'
    }
}

export const getBrands = async () => {
    'use cache'
    const response = await prisma.product.groupBy({ by: 'brand' })
    // logger.info('data : getBrands')
    return response.map(i => i.brand ?? '')
}

export const _getProductById = async (id: number): Promise<ActionResponse<ProductPreorder | null>> => {

    try {
        'use cache'
        const response = await fetch(`http://localhost:3000/api/product/${id}`, {
            method: "GET",
            // cache:"reload",
            next: {
                revalidate: 60,
                tags: [`product-${id}`], // tag used for cache control / revalidation
            },
        })

        const data = await response.json()
        logger.info('fetch success : getProductById', data)
        return data
    } catch (error) {
        logger.error('fetch error catch : getProductById', error)
        // console.error("Error fetching product:", error)
        return {
            data: null,
            success: false,
            message: "Failed to fetch product.",
        }
    }
}

export const _getSaleById = async (id: number): Promise<ActionResponse<SaleCustomers | null>> => {

    try {
        const response = await fetch(`http://localhost:3000/api/sale/${id}`, {
            method: "GET",
            // cache:"reload",
            next: {
                revalidate: 60,
                tags: [`sale-${id}`], // tag used for cache control / revalidation
            },
        })

        const data = await response.json()
        logger.info('fetch success : getSaleById', data)
        return data
    } catch (error) {
        logger.error("error catch fetching getSaleById:", error)
        return {
            data: null,
            success: false,
            message: "Failed to fetch product.",
        }
    }
}

export const getPreorder = async (
    filter: {
        inventoryName: string | undefined,
        inventoryStock: string | undefined,
        inventoryExpired: string | undefined,
        inventoryLimit: string | undefined,
        inventoryPage: string | undefined,
    },
): Promise<InventoryPaging> => {
// console.log(filter)

    const limit = Number(filter.inventoryLimit ?? 10);
    const page = Number(filter.inventoryPage ?? 0);

    // console.log(filter.inventoryStock)//'low'/"high"/'-'
    // console.log(filter.inventoryExpired)//'low'/"high"/'-'
    const where: Prisma.PreOrderWhereInput = {
        Product: filter.inventoryName && filter.inventoryName !== '-'
            ? { name: { contains: filter.inventoryName } }
            : undefined,

        // quantity:
        //     filter.inventoryStock === 'low'
        //         ? { lt: 5 }
        //         : filter.inventoryStock === 'high'
        //             ? { gte: 5 }
        //             : undefined,
        //
        // expired:
        //     filter.inventoryExpired === 'low'
        //         ? {
        //             lt: new Date(),
        //             not: null,
        //         }
        //         : filter.inventoryExpired === 'high'
        //             ? {
        //                 gte: new Date(),
        //                 not: null,
        //             }
        //             : undefined,
    };

    const orderBy: Prisma.PreOrderOrderByWithRelationInput[] = [];

    if (filter.inventoryStock === 'low') {
        orderBy.push({ quantity: 'asc' });
    } else if (filter.inventoryStock === 'high') {
        orderBy.push({ quantity: 'desc' });
    } else if (filter.inventoryExpired === 'low') {
        orderBy.push({ expired: 'asc' });
    } else if (filter.inventoryExpired === 'high') {
        orderBy.push({ expired: 'desc' });
    }
    // Always fallback sort
    orderBy.push({ updatedAt: 'desc' });

    const data = await prisma.preOrder.findMany({
        take: limit,
        skip: page * limit,
        orderBy,
        where,
        include: {
            Product: true, // optional
        },
    });
    const total = await prisma.preOrder.count({ where })

    logger.info('data : getPreorder')
    return { data, total }
}

