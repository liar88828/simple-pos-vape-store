import { POSPage } from "@/components/pos-page"
import { getProduct } from "@/action/product-action";
import { getAllCustomers } from "@/action/customer-action";
import { getContextPage } from "@/components/context-action";
import { ContextPage } from "@/interface/actionType";

export default async function POS(context: ContextPage) {
    const productName = await getContextPage(context, 'productName') ?? '';
    const customerName = await getContextPage(context, 'customerName') ?? '';

    return <POSPage products={ await getProduct(productName) }
                    customers={ await getAllCustomers(customerName) }/>
}