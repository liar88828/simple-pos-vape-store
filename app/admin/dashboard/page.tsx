import { getPreOrderStatusCount } from "@/action/inventory-action";
import { getProductLowStockComplete, getTodayVsYesterdaySales, getTopSellingProduct } from "@/action/product-action";
import { lastBuyer } from "@/action/sale-action";
import { DashboardPage } from "@/components/dashboard-page"

export default async function Dashboard() {
    return <DashboardPage
        topSelling={ await getTopSellingProduct() }
        lastBuyer={ await lastBuyer() }
        preOrders={ await getPreOrderStatusCount('Pending') }
        lowStockProducts={ await getProductLowStockComplete() }
        todayVsYesterdaySales={ await getTodayVsYesterdaySales() }
    />
}
