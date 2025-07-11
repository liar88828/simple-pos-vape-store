'use server'
import { ProductPreorder, TopSellingProduct } from "@/action/product-action";
import { ActionResponse, CartItem, RangeStats, SaleCustomers, SessionPayload } from "@/interface/actionType";
import { ERROR, STATUS_TRANSACTION } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { Customer, Product, Sale, SalesItemOptionalDefaults } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getSessionUserPage } from "./auth-action";
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

export type TopSellingProducts = {
    productId: number,
    totalSold: number,
    totalPrice: number,
    product?: ProductPreorder | null,
};

export async function getSaleCustomers(range: RangeStats): Promise<SaleCustomers[]> {
    const now = new Date();
    let startDate: Date;

    switch (range) {
        case "today":
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;

        case "week":
            // Assuming week starts on Sunday
            const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
            startDate.setDate(now.getDate() - dayOfWeek);
            break;

        case "month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;

        case "year":
            startDate = new Date(now.getFullYear(), 0, 1);
            break;

        default:
            startDate = new Date(0); // fallback, basically no filter
            break;
    }

    const data = await prisma.sale.findMany({
        take: 10,
        orderBy: { date: "desc" },
        where: {
            date: {
                gte: startDate,
            },
        },
        include: {
            customer: true,
            SaleItems: {
                include: {
                    product: true,
                },
            },
        },
    });
    logger.info('data : getSaleCustomers')
    return data
}

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

type LastBuyer = Customer & {
    Sales: Sale[]
};
export async function lastBuyer(): Promise<LastBuyer[]> {
    return prisma.customer.findMany({
        take: 5,
        include: { Sales: true },
        orderBy: {
            lastPurchase: 'desc',
            // updatedAt:'desc'
        }
    })
}

export async function lastBuyerPending(): Promise<SaleCustomers[]> {
    const data = prisma.sale.findMany({
        take: 10,
        orderBy: { date: "desc" },
        where: {
            statusTransaction: STATUS_TRANSACTION.PENDING
        },
        include: {
            customer: true,
            SaleItems: {
                include: {
                    product: true,
                },
            },
        },
    });
    logger.info("data : lastBuyerPending");
    return data
}

export const getTransactionCountToday = async () => {
    return prisma.sale.count({
        where: {
            date: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lt: new Date(new Date().setHours(24, 0, 0, 0)),
            },
        }
    })
}

export const getHistories = async (session: SessionPayload): Promise<SaleCustomers[]> => prisma.sale.findMany({
    orderBy: { date: "desc" },
    where: {
        customer: {
            name: session.name
        }
    },
    include: {
        customer: true,
        SaleItems: {
            include: {
                product: true
            }
        },

    }
})
export const getHistoriesById = async (id: number): Promise<SaleCustomers | null> => await prisma.sale.findUnique({
    where: { id },
    include: {
        customer: true,
        SaleItems: {
            include: {
                product: true
            }
        }
    }
})

export async function getTotalSoldToday() {
    const result = await prisma.salesItem.aggregate({
        _sum: {
            quantity: true,
        },
        where: {
            sale: {
                date: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lt: new Date(new Date().setHours(24, 0, 0, 0)),
                },
            },
        }
    })

    return result._sum.quantity ?? 0;
}

// export async function getMonthlySalesChange(range: RangeStats) {
//     const now = new Date();
//     const currentMonth = now.getMonth();
//     const currentYear = now.getFullYear();

//     const startOfThisMonth = new Date(currentYear, currentMonth, 1);
//     const startOfNextMonth = new Date(currentYear, currentMonth + 1, 1);

//     const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
//     const startOfThisMonthCopy = new Date(currentYear, currentMonth, 1);

//     const thisMonth = await prisma.salesItem.aggregate({
//         _sum: { price: true },
//         where: {
//             sale: {
//                 date: {
//                     gte: startOfThisMonth,
//                     lt: startOfNextMonth,
//                 },
//             },
//         },
//     });

//     const lastMonth = await prisma.salesItem.aggregate({
//         _sum: { price: true },
//         where: {
//             sale: {
//                 date: {
//                     gte: startOfLastMonth,
//                     lt: startOfThisMonthCopy,
//                 },
//             },
//         },
//     });

//     const currentTotal = thisMonth._sum.price ?? 0;
//     const previousTotal = lastMonth._sum.price ?? 0;

//     const percentageChange =
//         previousTotal === 0
//             ? 100
//             : ((currentTotal - previousTotal) / previousTotal) * 100;

//     const isUp = percentageChange >= 0;
//     const formattedChange = Math.abs(percentageChange).toFixed(1);

//     return {
//         changeText: `${isUp ? "Trending up" : "Trending down"} by ${formattedChange}% this month`,
//         isUp,
//         value: currentTotal,
//     };
// }

export async function getMonthlySalesChange(range: RangeStats) {
    const now = new Date();
    let startCurrent: Date;
    let endCurrent: Date;
    let startPrevious: Date;
    let endPrevious: Date;

    switch (range) {
        case "today":
            // today (from midnight to next midnight)
            startCurrent = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endCurrent = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

            startPrevious = new Date(startCurrent);
            startPrevious.setDate(startPrevious.getDate() - 1);
            endPrevious = new Date(startCurrent);
            break;

        case "week":
            // week starts Sunday
            const dayOfWeek = now.getDay();
            startCurrent = new Date(now);
            startCurrent.setHours(0, 0, 0, 0);
            startCurrent.setDate(startCurrent.getDate() - dayOfWeek);
            endCurrent = new Date(startCurrent);
            endCurrent.setDate(endCurrent.getDate() + 7);

            startPrevious = new Date(startCurrent);
            startPrevious.setDate(startPrevious.getDate() - 7);
            endPrevious = new Date(startCurrent);
            break;

        case "month":
            startCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
            endCurrent = new Date(now.getFullYear(), now.getMonth() + 1, 1);

            startPrevious = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endPrevious = new Date(now.getFullYear(), now.getMonth(), 1);
            break;

        case "year":
            startCurrent = new Date(now.getFullYear(), 0, 1);
            endCurrent = new Date(now.getFullYear() + 1, 0, 1);
            startPrevious = new Date(now.getFullYear() - 1, 0, 1);
            endPrevious = new Date(now.getFullYear(), 0, 1);
            break;

        default:
            throw new Error("Invalid range");
    }

    const thisPeriod = await prisma.salesItem.aggregate({
        _sum: { priceAtBuy: true },
        where: {
            sale: {
                date: {
                    gte: startCurrent,
                    lt: endCurrent,
                },
            },
        },
    });

    const lastPeriod = await prisma.salesItem.aggregate({
        _sum: { priceAtBuy: true },
        where: {
            sale: {
                date: {
                    gte: startPrevious,
                    lt: endPrevious,
                },
            },
        },
    });

    const currentTotal = thisPeriod._sum.priceAtBuy ?? 0;
    const previousTotal = lastPeriod._sum.priceAtBuy ?? 0;

    const percentageChange =
        previousTotal === 0
            ? 100
            : ((currentTotal - previousTotal) / previousTotal) * 100;

    const isUp = percentageChange >= 0;
    const formattedChange = Math.abs(percentageChange).toFixed(1);
    const data = {
        changeText: `${ isUp ? "Trending up" : "Trending down" } by ${ formattedChange }% this ${ range }`,
        isUp,
        value: currentTotal,
    };
    logger.info('data : getMonthlySalesChange')
    return data
}

export type DashboardStats = {
    totalSales: number;      // e.g. 12450000
    salesGrowth: number;     // e.g. 15 (percent)
    transactions: number;    // e.g. 156
    transactionsGrowth: number; // e.g. 8 (percent)
    avgTransaction: number;  // e.g. 79800
    avgTransactionGrowth: number; // e.g. 3 (percent)
    topProduct: {
        product: Product | null;          // e.g. "Salt Nic Liquid"
        unitsSold: number;     // e.g. 45
    };
}

export async function getDashboardStats(range: RangeStats) {
    const now = new Date();

    // Helper: get start/end for range
    function getDateRanges(range: RangeStats) {
        let startCurrent: Date;
        let endCurrent: Date;
        let startPrevious: Date;
        let endPrevious: Date;

        switch (range) {
            case "today":
                startCurrent = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                endCurrent = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

                startPrevious = new Date(startCurrent);
                startPrevious.setDate(startPrevious.getDate() - 1);
                endPrevious = new Date(startCurrent);
                break;

            case "week":
                const dayOfWeek = now.getDay();
                startCurrent = new Date(now);
                startCurrent.setHours(0, 0, 0, 0);
                startCurrent.setDate(startCurrent.getDate() - dayOfWeek);
                endCurrent = new Date(startCurrent);
                endCurrent.setDate(endCurrent.getDate() + 7);

                startPrevious = new Date(startCurrent);
                startPrevious.setDate(startPrevious.getDate() - 7);
                endPrevious = new Date(startCurrent);
                break;

            case "month":
                startCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
                endCurrent = new Date(now.getFullYear(), now.getMonth() + 1, 1);

                startPrevious = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endPrevious = new Date(now.getFullYear(), now.getMonth(), 1);
                break;

            case "year":
                startCurrent = new Date(now.getFullYear(), 0, 1);
                endCurrent = new Date(now.getFullYear() + 1, 0, 1);

                startPrevious = new Date(now.getFullYear() - 1, 0, 1);
                endPrevious = new Date(now.getFullYear(), 0, 1);
                break;

            default:
                throw new Error("Invalid range");
        }

        return { startCurrent, endCurrent, startPrevious, endPrevious };
    }

    const { startCurrent, endCurrent, startPrevious, endPrevious } = getDateRanges(range);

    // 1. Total sales current period
    const currentSales = await prisma.sale.aggregate({
        _sum: { total: true },
        where: { date: { gte: startCurrent, lt: endCurrent } },
    });

    // 2. Total sales previous period
    const previousSales = await prisma.sale.aggregate({
        _sum: { total: true },
        where: { date: { gte: startPrevious, lt: endPrevious } },
    });

    // 3. Total transactions current period
    const currentTransactionCount = await prisma.sale.count({
        where: { date: { gte: startCurrent, lt: endCurrent } },
    });

    // 4. Total transactions previous period
    const previousTransactionCount = await prisma.sale.count({
        where: { date: { gte: startPrevious, lt: endPrevious } },
    });

    // 5. Average transaction current period
    const avgTransactionCurrent =
        currentTransactionCount > 0
            ? (currentSales._sum.total ?? 0) / currentTransactionCount
            : 0;

    // 6. Average transaction previous period
    const avgTransactionPrevious =
        previousTransactionCount > 0
            ? (previousSales._sum.total ?? 0) / previousTransactionCount
            : 0;

    // 7. Top-selling product current period by units sold
    const topProduct = await prisma.salesItem.groupBy({
        by: [ "productId" ],
        _sum: { quantity: true },
        where: { sale: { date: { gte: startCurrent, lt: endCurrent } } },
        orderBy: { _sum: { quantity: "desc" } },
        take: 1,
    });

    // console.log(topProduct,'--------');
    const topProductInfo =
        topProduct.length > 0
            ? {
                product: await prisma.product.findUnique({ where: { id: topProduct[0].productId } }),
                unitsSold: topProduct[0]._sum.quantity ?? 0,
            }
            : {
                product: null,
                unitsSold: 0,
            };

    function calculateGrowth(current: number, previous: number) {
        if (previous === 0) return 100;
        return ((current - previous) / previous) * 100;
    }

    const responseData: DashboardStats = {
        totalSales: currentSales._sum.total ?? 0,
        salesGrowth: calculateGrowth(currentSales._sum.total ?? 0, previousSales._sum.total ?? 0),

        transactions: currentTransactionCount,
        transactionsGrowth: calculateGrowth(currentTransactionCount, previousTransactionCount),

        avgTransaction: avgTransactionCurrent,
        avgTransactionGrowth: calculateGrowth(avgTransactionCurrent, avgTransactionPrevious),

        topProduct: topProductInfo,
    };
    logger.info('data : getMonthlySalesChange')
    return responseData;
}

export async function getTopSellingProductsByRangeReport(
    range: RangeStats,
    limit = 10
): Promise<TopSellingProducts[]> {

    function getRangeDate(range: RangeStats): Date {
        const date = new Date();
        switch (range) {
            case "today":
                date.setHours(0, 0, 0, 0);
                return date;
            case "week":
                date.setDate(date.getDate() - 7);
                return date;
            case "month":
                date.setMonth(date.getMonth() - 1);
                return date;
            case "year":
                date.setFullYear(date.getFullYear() - 1);
                return date;
            default:
                return date;
        }
    }

    const startDate = getRangeDate(range);
    const grouped = await prisma.salesItem.groupBy({
        // sale: { statusTransaction: STATUS_TRANSACTION.SUCCESS }
        by: [ "productId", 'priceAtBuy' ],
        where: { updatedAt: { gte: startDate, }, },
        _sum: {
            quantity: true,
            priceAtBuy: true,
        },
        orderBy: { _sum: { quantity: "desc", }, },
        take: limit,
    });
    // console.log("grouped getTopSellingProductsByRangeReport", grouped);
    // [
    //     { productId: 8, totalSold: 2, totalPrice: 10000 },
    //     { productId: 8, totalSold: 2, totalPrice: 15000 }
    // ]

    // Gabungkan data berdasarkan productId
    const merged = Object.values(
        grouped.reduce((accumulator, current) => {
            const productId = current.productId;
            const quantity = current._sum.quantity ?? 0;
            const price = current.priceAtBuy ?? 0;

            // Jika belum ada data productId ini, buat dulu
            if (!accumulator[productId]) {
                accumulator[productId] = {
                    productId: productId,
                    totalSold: 0,
                    totalPrice: 0,
                };
            }

            // Tambahkan jumlah terjual dan total harga
            accumulator[productId].totalSold += quantity;
            accumulator[productId].totalPrice += quantity * price;

            return accumulator;
        }, {} as Record<number, {
            productId: number;
            totalSold: number;
            totalPrice: number;
        }>)
    );

    const productIds = merged.map((item) => item.productId);

    const products = await prisma.product.findMany({
        include: { PreOrders: { take: 1 } },
        where: {
            id: { in: productIds },
        },
    });

    const data = merged.map((item): TopSellingProducts => ({
        productId: item.productId,
        totalSold: item.totalSold,
        totalPrice: item.totalPrice,
        product: products.find((p) => p.id === item.productId),
    }));

    logger.info("data : getTopSellingProductsByRangeReport");
    return data
}

export async function transactionStatusAction(
    statusTransaction: string,
    sale: Sale
): Promise<ActionResponse> {
    try {

        const response = await prisma.sale.update({
            where: { id: sale.id },
            data: { statusTransaction }
        })
        revalidatePath('/')
        logger.info('success : transactionStatusAction')

        return {
            message: 'Success Update Status Transaction id : ' + sale.id,
            data: response,
            success: true
        }

    } catch {
        logger.error('error catch : transactionStatusAction')
        return {
            success: false,
            message: 'Fail Update Status Transaction id : ' + sale.id,
        }
    }
}

// const datas={
//     productId: number,// produk id
//     totalSold: number,// _sum semua
//     actualPrice: number, // data asli
//     product: Product ,
// }
export async function getTopSellingProductDashboard_(
    date: Date,
    limit: number = 10): Promise<TopSellingProduct[]> {
    const grouped = await prisma.salesItem.groupBy({
        where: { updatedAt: { gte: date, }, },
        by: [ "productId", 'priceAtBuy' ],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' }, },
        take: limit,
    });

    // Gabungkan data berdasarkan productId
    const merged = Object.values(
        grouped.reduce((accumulator, current) => {
            const productId = current.productId;
            const quantity = current._sum.quantity ?? 0;
            const price = current.priceAtBuy ?? 0;

            // Jika belum ada data productId ini, buat dulu
            if (!accumulator[productId]) {
                accumulator[productId] = {
                    productId: productId,
                    totalSold: 0,
                    totalPrice: 0,
                };
            }

            // Tambahkan jumlah terjual dan total harga
            accumulator[productId].totalSold += quantity;
            accumulator[productId].totalPrice += quantity * price;

            return accumulator;
        }, {} as Record<number, {
            productId: number;
            totalSold: number;
            totalPrice: number;
        }>)
    );

    const productIds = merged.map(item => item.productId);

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

    return merged.map(item => {
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
                totalSold: item.totalSold,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                sold: product.sold,
                // expired: product.expired,
            } satisfies TopSellingProduct
        }
    }).filter(item => item !== undefined)
}