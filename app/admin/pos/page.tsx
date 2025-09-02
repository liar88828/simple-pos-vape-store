import { getProductPage } from "@/action/product-action";
import { getAllCustomers } from "@/app/admin/customers/customers-action";
import { POSPage } from "@/app/admin/pos/pos-page"
import { ContextPage } from "@/interface/actionType";
import { getContextPage } from "@/lib/context-action";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export default async function POS(context: ContextPage) {
    logger.info("page : POS page");
    const customerName = await getContextPage(context, 'customerName') ?? '';

    return <POSPage
        payment={ (await prisma.payment.findFirst())! }
        products={ await getProductPage(context) }
        customers={ await getAllCustomers(customerName) }
    />
}