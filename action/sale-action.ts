'use server'
import { ProductPreorder, TopSellingProduct } from "@/action/product-action";
import { RangeStats, SaleCustomers } from "@/interface/actionType";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { Customer, Product, Sale } from "@/lib/validation";

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

export type TopSellingProducts = {
    productId: number,
    totalSold: number,
    totalPrice: number,
    product?: ProductPreorder | null,
};

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

export async function lastBuyer(): Promise<(Customer & {
    Sales: Sale[]
})[]> {
    return prisma.customer.findMany({
        take: 5,
        include: { Sales: true },
        orderBy: {
            lastPurchase: 'desc',
            // updatedAt:'desc'
        }
    })
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