import { getAllCustomers } from "@/action/customer-action";
import { getProduct } from "@/action/product-action";
import { getContextPage } from "@/components/context-action";
import { POSPage } from "@/components/pos-page"
import { ContextPage } from "@/interface/actionType";

export default async function POS(context: ContextPage) {

    const customerName = await getContextPage(context, 'customerName') ?? '';

    return <POSPage
        products={
            await getProduct({
                productName: await getContextPage(context, 'productName'),
                productBrand: await getContextPage(context, 'productBrand'),
                productCategory: await getContextPage(context, 'productCategory'),
                productTypeDevice: await getContextPage(context, 'productTypeDevice'),
                productNicotine: await getContextPage(context, 'productNicotine'),
                productResistant: await getContextPage(context, 'productResistant'),
                productCoil: await getContextPage(context, 'productCoil'),
                productBattery: await getContextPage(context, 'productBattery'),
                productCotton: await getContextPage(context, 'productCotton'),
                productLimit: await getContextPage(context, 'productLimit'),
                productPage: await getContextPage(context, 'productPage')
            },
        ) }

        customers={ await getAllCustomers(customerName) }
    />
}