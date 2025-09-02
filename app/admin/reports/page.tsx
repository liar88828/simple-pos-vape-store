import {
    getTopSellingProductsByRangeReport
} from "@/action/sale-action";
import { getDashboardStats, getMonthlySalesChange, getSaleCustomers } from "@/app/admin/reports/reports-action";
import { ReportsPage } from "@/app/admin/reports/reports-page"
import { ContextPage, RangeStats } from "@/interface/actionType";
import { logger } from "@/lib/logger";

export default async function Reports({ searchParams }: ContextPage) {
    const range = (await searchParams).range as RangeStats || 'week'//"today"
    logger.info('page : Reports')

    return <ReportsPage
        // chartData={ await getChartData(range) }
        range={ range }
        topSellers={ await getTopSellingProductsByRangeReport(range, 10) }
        trending={ await getMonthlySalesChange(range) }
        stats={ await getDashboardStats(range) }
        sales={ await getSaleCustomers(range) }
    />
}
