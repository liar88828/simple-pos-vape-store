'use server'
import { ProductPreorder } from "@/action/product-action";
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
    productId: string,
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
    type MergedResult = {
        productId: string
        totalSold: number
        totalPrice: number
    }

    function mergeByProductId<T extends { productId: string; _sum: { quantity: number | null }; priceAtBuy?: number }>(
        grouped: T[]
    ): MergedResult[] {
        return Object.values(
            grouped.reduce((acc, curr) => {
                const productId = String(curr.productId)

                if (!acc[productId]) {
                    acc[productId] = { productId, totalSold: 0, totalPrice: 0 }
                }

                const quantity = curr._sum.quantity ?? 0
                const price = curr.priceAtBuy ?? 0

                acc[productId].totalSold += quantity
                acc[productId].totalPrice += quantity * price

                return acc
            }, {} as Record<string, MergedResult>)
        )
    }

    const merged = mergeByProductId(grouped)
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

export const getHistoriesById = async (id: string): Promise<SaleCustomers | null> => await prisma.sale.findUnique({
    where: { id },
    include: {
        Customer: true,
        SaleItems: {
            include: {
                product: true
            }
        }
    }
})

