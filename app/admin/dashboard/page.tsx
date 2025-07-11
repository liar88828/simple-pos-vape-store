import { getPreOrderStatusCount } from "@/action/inventory-action";
import { getProductLowStockComplete, getTodayVsYesterdaySales } from "@/action/product-action";
import { getTopSellingProductsByRangeReport, lastBuyerPending } from "@/action/sale-action";
import { DashboardPage } from "@/components/dashboard-page"
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
