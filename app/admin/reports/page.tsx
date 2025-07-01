import { ReportsPage } from "@/components/reports-page"
import { ContextPage, RangeStats } from "@/interface/actionType";
import {
    getDashboardStats,
    getMonthlySalesChange, getTopSellingProductsByRange,
    saleCustomersAction
} from "@/action/sale-action";

export default async function Reports({ searchParams }: ContextPage) {
    const range = (await searchParams).range as RangeStats || "today"

    return <ReportsPage
        topSellers={ await getTopSellingProductsByRange(range,10) }
        range={ range }
        sales={ await saleCustomersAction(range) }
        // chartData={ await getChartData(range) }
        trending={ await getMonthlySalesChange(range) }
        stats={ await getDashboardStats(range) }
    />
}
