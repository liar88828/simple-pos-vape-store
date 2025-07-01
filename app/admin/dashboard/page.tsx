import { DashboardPage } from "@/components/dashboard-page"
import { getProductLowStockComplete, getTodayVsYesterdaySales, getTopSellingProduct } from "@/action/product-action";
import { lastBuyer } from "@/action/sale-action";
import { getPreOrderStatusCount } from "@/action/inventory-action";

export default async function Dashboard() {
    return <DashboardPage
        topSelling={ await getTopSellingProduct() }
        lastBuyer={ await lastBuyer() }
        preOrders={ await getPreOrderStatusCount('Pending') }
        lowStockProducts={ await getProductLowStockComplete() }
        todayVsYesterdaySales={ await getTodayVsYesterdaySales() }
    />
}
