'use server'
import { DashboardStats } from "@/action/sale-action";
import { ActionResponse, RangeStats, SaleCustomers } from "@/interface/actionType";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { Sale } from "@/lib/validation";
import { revalidatePath } from "next/cache";

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
