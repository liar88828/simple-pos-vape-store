import { getAllCustomers } from "@/action/customer-action";
import { brands, getProduct } from "@/action/product-action";
import { getContextPage } from "@/components/context-action";
import { POSPage } from "@/components/pos-page"
import { ContextPage } from "@/interface/actionType";

export default async function POS(context: ContextPage) {
    const productName = await getContextPage(context, 'productName') ?? '';
    const productBrand = await getContextPage(context, 'productBrand')
    const productCategory = await getContextPage(context, 'productCategory')
    const productTypeDevice = await getContextPage(context, 'productTypeDevice')
    const productNicotine = await getContextPage(context, 'productNicotine')
    const productResistant = await getContextPage(context, 'productResistant')
    const productCoil = await getContextPage(context, 'productCoil')
    const productBattery = await getContextPage(context, 'productBattery')
    const productCotton = await getContextPage(context, 'productCotton')
    const productLimit = await getContextPage(context, 'productLimit')
    const productPage = await getContextPage(context, 'productPage')
    const customerName = await getContextPage(context, 'customerName') ?? '';

    return <POSPage
        products={ await getProduct({
                productName,
                productBrand,
                productCategory,
                productTypeDevice,
                productNicotine,
                productResistant,
                productCoil,
                productBattery,
                productCotton,
            },
            Number(productLimit),
            Number(productPage)
        ) }

        customers={ await getAllCustomers(customerName) }
        brands={ await brands() }
    />
}