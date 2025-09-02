import { getProductLowStockComplete, } from "@/action/product-action";
import { getTopSellingProductsByRangeReport, } from "@/action/sale-action";
import {
    getPreOrderStatusCount,
    getTodayVsYesterdaySales,
    lastBuyerPending
} from "@/app/admin/dashboard/dashboard-action";
import { DashboardPage } from "@/app/admin/dashboard/dashboard-page"
import { logger } from "@/lib/logger";

export default async function Dashboard() {
    logger.info("page : Dashboard");
    const date = new Date()
    date.setMonth(date.getMonth() - 1);

    return <DashboardPage
        topSelling={ await getTopSellingProductsByRangeReport('month') }
        lastBuyer={ await lastBuyerPending() }
        preOrders={ await getPreOrderStatusCount('Pending') }
        lowStockProducts={ await getProductLowStockComplete() }
        todayVsYesterdaySales={ await getTodayVsYesterdaySales() }
    />
}
