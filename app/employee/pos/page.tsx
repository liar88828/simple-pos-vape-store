import { getSessionEmployeePage } from "@/action/auth-action";
import { getProductPage } from "@/action/product-action";
import { getAllCustomers } from "@/app/admin/customers/customers-action";
import POSPage from "@/app/admin/pos/pos-page";
import { ContextPage } from "@/interface/actionType";
import { getContextPage } from "@/lib/context-action";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export default async function POS(context: ContextPage) {
    const session = await getSessionEmployeePage()
    const customerName = await getContextPage(context, 'customerName') ?? '';
    logger.info("page : POS page");

    return <POSPage
        payment={ (await prisma.paymentSetting.findFirst())! }
        products={ await getProductPage(context, session.shopId) }
        customers={ await getAllCustomers(customerName) }
    />
}