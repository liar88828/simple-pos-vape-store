import {
    getDashboardStats,
    getMonthlySalesChange,
    getSaleCustomers,
    getTopSellingProductsByRangeReport
} from "@/action/sale-action";
import { ReportsPage } from "@/components/reports-page"
import { ContextPage, RangeStats } from "@/interface/actionType";
import { logger } from "@/lib/logger";

export default async function Reports({ searchParams }: ContextPage) {
    logger.info('page : Reports')
    const range = (await searchParams).range as RangeStats || 'week'//"today"
    return <ReportsPage
        // chartData={ await getChartData(range) }
        range={ range }
        topSellers={ await getTopSellingProductsByRangeReport(range, 10) }
        trending={ await getMonthlySalesChange(range) }
        stats={ await getDashboardStats(range) }
        sales={ await getSaleCustomers(range) }
    />
}
