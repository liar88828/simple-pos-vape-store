import {
    getDashboardStats,
    getMonthlySalesChange,
    getSaleCustomers,
    getTopSellingProductsByRange
} from "@/action/sale-action";
import { ReportsPage } from "@/components/reports-page"
import { ContextPage, RangeStats } from "@/interface/actionType";

export default async function Reports({ searchParams }: ContextPage) {
    const range = (await searchParams).range as RangeStats || 'week'//"today"

    return <ReportsPage
        // chartData={ await getChartData(range) }
        range={ range }
        topSellers={ await getTopSellingProductsByRange(range, 10) }
        trending={ await getMonthlySalesChange(range) }
        stats={ await getDashboardStats(range) }
        sales={ await getSaleCustomers(range) }
    />
}
