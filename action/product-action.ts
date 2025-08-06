'use server'

import { InventoryPaging } from "@/components/page/inventory-page";
import { ProductData } from "@/components/page/products-page";
import { ActionResponse, ContextPage, SaleCustomers } from "@/interface/actionType";
import { STATUS_PREORDER } from "@/lib/constants";
import { getContextPage } from "@/lib/context-action";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import {
    Customer,
    PreOrder,
    PreOrderOptionalDefaults,
    PreOrderOptionalDefaultsSchema,
    Product,
    ProductOptionalDefaults,
    ProductOptionalDefaultsSchema,
} from "@/lib/validation";
import { Prisma, } from "@prisma/client";
import { revalidatePath } from 'next/cache'

export type TopSellingProduct = Product & {
    totalSold: number;
}
export type BrandsProps = { brand: string | null }[];

export type ProductPreorder = Product & { PreOrders: PreOrder[] }

export type ProductPaging = {
    data: ProductPreorder[],
    total: number,
    brands: BrandsProps
};

export type PreorderProductCustomer = PreOrder & {
    customer: Customer
    product: Product
};

export type PreorderProduct = PreOrder & {
    product: Product
};

export const getProduct = async (
    filter: {
        productBrand: string | undefined,
        productCategory: string | undefined,
        productTypeDevice: string | undefined,
        productCotton: string | undefined,
        productCoil: string | undefined,
        productBattery: string | undefined,
        productNicotine: string | undefined,
        productFluid: string | undefined,
        productResistant: string | undefined,
        productName: string | undefined,
        productLimit: string | undefined,
        productPage: string | undefined,
    },
): Promise<ProductPaging> => {
    const limit = Number(filter.productLimit ?? 10);
    const page = Number(filter.productPage ?? 0);

    const where: Prisma.ProductWhereInput = {
        name: filter.productName && filter.productName !== '-'
            ? { contains: filter.productName, }
            : undefined,

        resistanceSize: filter.productResistant && filter.productResistant !== '-'
            ? { contains: filter.productResistant, }
            : undefined,

        cottonSize: filter.productCotton && filter.productCotton !== '-'
            ? { contains: filter.productCotton, }
            : undefined,

        batterySize: filter.productBattery && filter.productBattery !== '-'
            ? { contains: filter.productBattery, }
            : undefined,

        brand: filter.productBrand && filter.productBrand !== '-'
            ? { contains: filter.productBrand, }
            : undefined,

        category: filter.productCategory && filter.productCategory !== '-'
            ? { contains: filter.productCategory, }
            : undefined,

        coilSize: filter.productCoil && filter.productCoil !== '-'
            ? { contains: filter.productCoil, }
            : undefined,

        type: filter.productTypeDevice && filter.productTypeDevice !== '-'
            ? { contains: filter.productTypeDevice, }
            : undefined,

        nicotineLevel: filter.productNicotine && filter.productNicotine !== '-'
            ? { contains: filter.productNicotine, }
            : undefined,

        fluidLevel: filter.productFluid && filter.productFluid !== '-'
            ? { contains: filter.productFluid, }
            : undefined,
    }
    // console.log(where)
    const data = await prisma.product.findMany({
        where,
        take: limit,
        skip: page * limit,
        include: {
            PreOrders: {
                take: 1,
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
        brands: await getBrands()
    }
}

export const getProductPage = async (context: ContextPage): Promise<ProductPaging> => {
    return getProduct({
        productName: await getContextPage(context, 'productName'),
        productBrand: await getContextPage(context, 'productBrand'),
        productCategory: await getContextPage(context, 'productCategory'),
        productTypeDevice: await getContextPage(context, 'productTypeDevice'),
        productNicotine: await getContextPage(context, 'productNicotine'),
        productResistant: await getContextPage(context, 'productResistant'),
        productCoil: await getContextPage(context, 'productCoil'),
        productBattery: await getContextPage(context, 'productBattery'),
        productCotton: await getContextPage(context, 'productCotton'),
        productFluid: await getContextPage(context, 'productFluid'),
        productLimit: await getContextPage(context, 'productLimit'),
        productPage: await getContextPage(context, 'productPage')
    })
}
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
        return {
            success: true,
            data: await prisma.product.delete({ where: { id: idProduct } }),
            message: 'Success Delete Product'
        }
    }

    logger.error('error :  deleteProduct')
    return {
        success: false,
        message: 'Fail Delete Product'
    }
}

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
    const data = { todayTotal, percentChange }
    logger.info('data : getTodayVsYesterdaySales')
    return data;
}

export const getBrands = async () => {
    'use cache'
    const data = await prisma.product.groupBy({ by: 'brand' })
    logger.info('data : getBrands')
    return data
}

export const getProductById = async (id: number): Promise<ActionResponse<ProductPreorder | null>> => {

    try {
        'use cache'
        const response = await fetch(`http://localhost:3000/api/product/${ id }`, {
            method: "GET",
            // cache:"reload",
            next: {
                revalidate: 60,
                tags: [ `product-${ id }` ], // tag used for cache control / revalidation
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

export const getSaleById = async (id: number): Promise<ActionResponse<SaleCustomers | null>> => {

    try {
        const response = await fetch(`http://localhost:3000/api/sale/${ id }`, {
            method: "GET",
            // cache:"reload",
            next: {
                revalidate: 60,
                tags: [ `sale-${ id }` ], // tag used for cache control / revalidation
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

export const getExpiredProduct = async (): Promise<PreorderProduct[]> => {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const data = await prisma.preOrder.findMany({
        where: {
            expired: {
                not: null,
                gte: oneYearAgo, // expired date >= 1 year ago
                lte: now,        // expired date <= today
            },
        },
        include: {
            product: true, // optional
        },
    });
    logger.info('data : getExpiredProduct')
    return data
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
    const limit = Number(filter.inventoryLimit ?? 10);
    const page = Number(filter.inventoryPage ?? 0);

    // console.log(filter.inventoryStock)//'low'/"high"/'-'
    // console.log(filter.inventoryExpired)//'low'/"high"/'-'
    const where: Prisma.PreOrderWhereInput = {
        product: filter.inventoryName && filter.inventoryName !== '-'
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
            product: true, // optional
        },
    });
    const total = await prisma.preOrder.count({ where })

    logger.info('data : getPreorder')
    return { data, total }
}

export const getPreorderPage = async (context: ContextPage): Promise<InventoryPaging> => {
    return await getPreorder({
        inventoryName: await getContextPage(context, 'inventoryName'),
        inventoryStock: await getContextPage(context, 'inventoryStock'),
        inventoryExpired: await getContextPage(context, 'inventoryExpired'),
        inventoryLimit: await getContextPage(context, 'inventoryLimit'),
        inventoryPage: await getContextPage(context, 'inventoryPage'),
    })
}