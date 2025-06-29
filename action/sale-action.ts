'use server'
import { prisma } from "@/lib/prisma";
import { ActionResponse, CartItem, ChartData, LastBuyer, RangeStats } from "@/interface/actionType";
import { revalidatePath } from "next/cache";
import { Customer, Product } from "@/lib/generated/zod_gen";
import { SalesItemModelType } from "@/lib/schema";
import { Prisma } from "@prisma/client";
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

// type RangeStats = "today" | "week" | "month" | "year"
// export async function SaleCustomers(range: RangeStats): Promise<SaleCustomers[]> {
//     return prisma.sale.findMany({
//         take: 10,
//         orderBy: { date: 'desc' },
//         include: {
//             customer: true,
//             SaleItems: { include: { product: true } }
//         }
//     })
// }

export async function saleCustomersAction(range: RangeStats) {
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

    return prisma.sale.findMany({
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
}

// export async function getMonthlyChartData(range: RangeStats,) {
//     const now = new Date();
//     const chartData = [];

//     for (let offset = 5; offset >= 0; offset--) {
//         const year = new Date(now.getFullYear(), now.getMonth() - offset, 1).getFullYear();
//         const month = new Date(now.getFullYear(), now.getMonth() - offset, 1).getMonth();

//         const start = new Date(year, month, 1, 0, 0, 0, 0);
//         const end = new Date(year, month + 1, 1, 0, 0, 0, 0);

//         const sales = await prisma.salesItem.aggregate({
//             _sum: { price: true },
//             where: {
//                 sale: {
//                     date: {
//                         gte: start,
//                         lt: end,
//                     },
//                 },
//             },
//         });

//         chartData.push({
//             month: MONTH_NAMES[month],
//             desktop: sales._sum.price ?? 0,
//         });
//     }

//     return chartData;
// }

const DAY_NAMES = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Main dispatcher (make async)
export async function getChartData(range: RangeStats): Promise<ChartData[]> {
    if (range === "today") {
        return await getTodayChartData();
    }
    if (range === "week") {
        return await getWeekChartData();
    }
    if (range === "month") {
        return await getMonthChartData();
    }
    if (range === "year") {
        return await getYearChartData();
    }
    throw new Error("Invalid range");
}

// Today: sales by hour (0-23)
export async function getTodayChartData() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const chartData = [];

    for (let hour = 0; hour < 24; hour++) {
        const start = new Date(startOfDay);
        start.setHours(hour);

        const end = new Date(startOfDay);
        end.setHours(hour + 1);

        const sales = await prisma.sale.aggregate({
            _sum: { total: true },
            where: { date: { gte: start, lt: end } },
        });

        chartData.push({
            name: String(hour),
            desktop: sales._sum.total ?? 0,
        });
    }

    return chartData
}

// Week: sales by day name (Sunday-Saturday)
export async function getWeekChartData() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0-6 Sunday-Saturday

    // Start of current week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - dayOfWeek);

    const chartData = [];

    for (let i = 0; i < 7; i++) {
        const start = new Date(startOfWeek);
        start.setDate(startOfWeek.getDate() + i);

        const end = new Date(start);
        end.setDate(start.getDate() + 1);

        const sales = await prisma.sale.aggregate({
            _sum: { total: true },
            where: { date: { gte: start, lt: end } },
        });

        chartData.push({
            name: DAY_NAMES[start.getDay()],
            desktop: sales._sum.total ?? 0,
        });
    }

    return chartData;
}

// Month: sales by day number (1-31)
export async function getMonthChartData() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const chartData = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const start = new Date(year, month, day, 0, 0, 0, 0);
        const end = new Date(year, month, day + 1, 0, 0, 0, 0);

        const sales = await prisma.sale.aggregate({
            _sum: { total: true },
            where: { date: { gte: start, lt: end } },
        });

        chartData.push({
            name: String(day),
            desktop: sales._sum.total ?? 0,
        });
    }

    return chartData;
}

// Year: sales by month name (last 6 months)
export async function getYearChartData() {
    const now = new Date();
    const chartData = [];

    for (let offset = 5; offset >= 0; offset--) {
        const year = new Date(now.getFullYear(), now.getMonth() - offset, 1).getFullYear();
        const month = new Date(now.getFullYear(), now.getMonth() - offset, 1).getMonth();

        const start = new Date(year, month, 1, 0, 0, 0, 0);
        const end = new Date(year, month + 1, 1, 0, 0, 0, 0);

        const sales = await prisma.sale.aggregate({
            _sum: { total: true },
            where: { date: { gte: start, lt: end } },
        });

        chartData.push({
            name: MONTH_NAMES[month],
            desktop: sales._sum.total ?? 0,
        });
    }

    return chartData;
}

// export async function getMonthlyChartData(range: RangeStats) {
//     const now = new Date();
//     const chartData = [];

//     // Determine how many months to go back, default 6 for 'month'
//     let monthsBack = 6;

//     if (range === "year") {
//         monthsBack = 12;
//     } else if (range === "week" || range === "today") {
//         // For 'week' or 'today' you might want to show daily data instead or just return empty monthly data
//         // Here, let's return last 1 month for simplicity
//         monthsBack = 1;
//     }

//     for (let offset = monthsBack - 1; offset >= 0; offset--) {
//         const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
//         const year = date.getFullYear();
//         const month = date.getMonth();

//         const start = new Date(year, month, 1, 0, 0, 0, 0);
//         const end = new Date(year, month + 1, 1, 0, 0, 0, 0);

//         const sales = await prisma.salesItem.aggregate({
//             _sum: { price: true },
//             where: {
//                 sale: {
//                     date: {
//                         gte: start,
//                         lt: end,
//                     },
//                 },
//             },
//         });

//         chartData.push({
//             month: MONTH_NAMES[month],
//             desktop: sales._sum.price ?? 0,
//         });
//     }

//     return chartData;
// }

// export type SalesData = Sale & { customer: Customer };
//
// export async function getSales(): Promise<SalesData[]> {
//     return prisma.sale.findMany({
//         orderBy: {
//             date: 'desc'
//         },
//         include: {
//             customer: true
//         }
//     })
// }

export async function createTransaction(product: CartItem[], customer: Customer | null): Promise<ActionResponse> {
    // console.log('execute');
    try {
        if (!customer) {
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
                    statusTransaction: 'Sistem Dev'// "Pending",
                    , typeTransaction: 'Sistem Dev'//'Cash'
                }
            })
            // console.log('execute saleItemList')
            const saleItemList = product.map(item => {
                return {
                    saleId: saleDB.id,
                    productId: item.id,
                    quantity: item.quantity, // from origin product
                    price: item.price,// from origin product

                    // category: item.category,
                } satisfies  Omit<SalesItemModelType, 'id'>
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
                    totalPurchase: { increment: saleItemList.reduce((a, b) => a + b.price * b.quantity, 0) },
                },
            });

            // console.log('execute finish')

            return {
                saleItemDB,
                saleDB
            }
        })
        // console.log('execute revalidatePath')
        revalidatePath('/')
        return {
            data: dataTransaction,
            message: "Success Create Data",
            success: true,
        }

    } catch (error) {

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

export async function lastBuyer(): Promise<LastBuyer[]> {
    return prisma.customer.findMany({
        take: 5,
        include: { Sales: true },
        orderBy: { lastPurchase: 'desc' }
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
        _sum: { price: true },
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
        _sum: { price: true },
        where: {
            sale: {
                date: {
                    gte: startPrevious,
                    lt: endPrevious,
                },
            },
        },
    });

    const currentTotal = thisPeriod._sum.price ?? 0;
    const previousTotal = lastPeriod._sum.price ?? 0;

    const percentageChange =
        previousTotal === 0
            ? 100
            : ((currentTotal - previousTotal) / previousTotal) * 100;

    const isUp = percentageChange >= 0;
    const formattedChange = Math.abs(percentageChange).toFixed(1);

    return {
        changeText: `${ isUp ? "Trending up" : "Trending down" } by ${ formattedChange }% this ${ range }`,
        isUp,
        value: currentTotal,
    };
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

// export async function getDashboardStats(range: RangeStats) {
//     const now = new Date();
//     const currentYear = now.getFullYear();
//     const currentMonth = now.getMonth(); // 0-based

//     // Helper to get month start and end dates
//     function getMonthDateRange(year: number, month: number) {
//         const start = new Date(year, month, 1, 0, 0, 0, 0);
//         const end = new Date(year, month + 1, 1, 0, 0, 0, 0);
//         return { start, end };
//     }

//     // Current month range
//     const { start: thisMonthStart, end: thisMonthEnd } = getMonthDateRange(currentYear, currentMonth);
//     // Last month range
//     const { start: lastMonthStart, end: lastMonthEnd } = getMonthDateRange(currentYear, currentMonth - 1);

//     // 1. Total Penjualan this month
//     const thisMonthSales = await prisma.sale.aggregate({
//         _sum: {
//             total: true,
//         },
//         where: {
//             date: {
//                 gte: thisMonthStart,
//                 lt: thisMonthEnd,
//             },
//         },
//     });

//     // 2. Total Penjualan last month
//     const lastMonthSales = await prisma.sale.aggregate({
//         _sum: {
//             total: true,
//         },
//         where: {
//             date: {
//                 gte: lastMonthStart,
//                 lt: lastMonthEnd,
//             },
//         },
//     });

//     // 3. Total Transaksi this month (count of sales)
//     const thisMonthTransactionCount = await prisma.sale.count({
//         where: {
//             date: {
//                 gte: thisMonthStart,
//                 lt: thisMonthEnd,
//             },
//         },
//     });

//     // 4. Total Transaksi last month
//     const lastMonthTransactionCount = await prisma.sale.count({
//         where: {
//             date: {
//                 gte: lastMonthStart,
//                 lt: lastMonthEnd,
//             },
//         },
//     });

//     // 5. Average transaction this month
//     const avgTransactionThisMonth = thisMonthTransactionCount > 0
//         ? (thisMonthSales._sum.total ?? 0) / thisMonthTransactionCount
//         : 0;

//     // 6. Average transaction last month
//     const avgTransactionLastMonth = lastMonthTransactionCount > 0
//         ? (lastMonthSales._sum.total ?? 0) / lastMonthTransactionCount
//         : 0;

//     // 7. Top selling product this month by units sold
//     // Join SaleItems with Sale filtered by this month
//     const topProduct = await prisma.salesItem.groupBy({
//         by: ['productId'],
//         _sum: {
//             quantity: true,
//         },
//         where: {
//             sale: {
//                 date: {
//                     gte: thisMonthStart,
//                     lt: thisMonthEnd,
//                 },
//             },
//         },
//         orderBy: {
//             _sum: {
//                 quantity: 'desc',
//             },
//         },
//         take: 1,
//     });

//     // Extract the top product info or fallback
//     const topProductInfo = topProduct.length > 0
//         ? {
//             product: await prisma.product.findUnique({ where: { id: topProduct[0].productId } }),
//             unitsSold: topProduct[0]._sum.quantity ?? 0,
//         }
//         : {
//             product: null,
//             unitsSold: 0,
//         };

//     // Helper to calculate growth percentage
//     function calculateGrowth(current: number, previous: number) {
//         if (previous === 0) return 100;
//         return ((current - previous) / previous) * 100;
//     }
//     const responseData: DashboardStats = {
//         totalSales: thisMonthSales._sum.total ?? 0,
//         salesGrowth: calculateGrowth(thisMonthSales._sum.total ?? 0, lastMonthSales._sum.total ?? 0),

//         transactions: thisMonthTransactionCount,
//         transactionsGrowth: calculateGrowth(thisMonthTransactionCount, lastMonthTransactionCount),

//         avgTransaction: avgTransactionThisMonth,
//         avgTransactionGrowth: calculateGrowth(avgTransactionThisMonth, avgTransactionLastMonth),

//         topProduct: topProductInfo,
//     }
//     return responseData
// }

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

    // 7. Top selling product current period by units sold
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

    return responseData;
}

export type TopSellingProducts = {
    productId: number,
    totalSold: number,
    actualPrice: number,
    product: Product | undefined,
};

export async function getTopSellingProductsLastMonth(limit = 5, range: RangeStats) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Step 1: Group sales items by productId, filter by last month
    const grouped = await prisma.salesItem.groupBy({
        by: [ "productId" ,'price'],
        where: {
            createdAt: {
                gte: oneMonthAgo,
            },
        },
        _sum: {
            quantity: true,
        },
        orderBy: {
            _sum: {
                quantity: "desc",
            },
        },
        take: limit,
    });

    // Step 2: Get product details
    const productIds = grouped.map((item) => item.productId);

    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
    });

    // Step 3: Combine and return
    return grouped.map((item): TopSellingProducts => ({
        productId: item.productId,
        totalSold: item._sum.quantity ?? 0,
        actualPrice: item.price ?? 0,
        product: products.find((p) => p.id === item.productId),
    }));
}

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

export async function getTopSellingProductsByRange(
    range: RangeStats,
    limit = 5
): Promise<TopSellingProducts[]> {
    const startDate = getRangeDate(range);

    const grouped = await prisma.salesItem.groupBy({
        by: [ "productId", 'price' ],
        where: {
            createdAt: {
                gte: startDate,
            },
        },
        _sum: {
            quantity: true,
        },
        orderBy: {
            _sum: {
                quantity: "desc",
            },
        },
        take: limit,
    });
    const productIds = grouped.map((item) => item.productId);

    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
    });

    return grouped.map((item): TopSellingProducts => ({
        productId: item.productId,
        totalSold: item._sum.quantity ?? 0,
        actualPrice: item.price ?? 0,
        product: products.find((p) => p.id === item.productId),
    }));
}
