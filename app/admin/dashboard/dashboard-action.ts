'use server'
import { SaleCustomers } from "@/interface/actionType";
import { STATUS_TRANSACTION } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

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

export async function getPreOrderStatusCount(status: 'Pending' | 'Success') {
    const data = await prisma.preOrder.count({
        where: { status }
    })
    logger.info("data : getPreOrderStatusCount",)
    return data
}

