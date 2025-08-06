import { getAllCustomers } from "@/action/customer-action";
import { getProductPage } from "@/action/product-action";
import { POSPage } from "@/components/page/pos-page"
import { ContextPage } from "@/interface/actionType";
import { getContextPage } from "@/lib/context-action";
import { logger } from "@/lib/logger";

export default async function POS(context: ContextPage) {
    logger.info("page : POS page");
    const customerName = await getContextPage(context, 'customerName') ?? '';

    return <POSPage
        products={ await getProductPage(context) }
        customers={ await getAllCustomers(customerName) }
    />
}