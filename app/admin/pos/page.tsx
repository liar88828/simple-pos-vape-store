import { getProduct } from "@/action/product-action";
import { getAllCustomers } from "@/app/admin/customers/customers-action";
import POSPage from "@/app/admin/pos/pos-page";
import { getSettingPaymentFirst } from "@/app/admin/setting/setting-action";
import { ContextPage } from "@/interface/actionType";
import { getContextPage } from "@/lib/context-action";
import { logger } from "@/lib/logger";
import { redirect } from "next/navigation";

export default async function POS(context: ContextPage) {
    logger.info("page : POS page");
    const customerName = await getContextPage(context, 'customerName') ?? '';
    const payment = await getSettingPaymentFirst()
    if (!payment) {
        redirect('/admin/setting')
    }

    return <POSPage
        products={ await getProduct(context, null) }
        customers={ await getAllCustomers(customerName) }
    />
}