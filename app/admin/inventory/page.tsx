import { getProduct, getProductLowStockComplete } from "@/action/product-action";
import { getContextPage } from "@/components/context-action";
import { InventoryPage } from "@/components/inventory-page"
import { ContextPage } from "@/interface/actionType";

export default async function Inventory(context: ContextPage) {

    return <InventoryPage
        lowStockProducts={ await getProductLowStockComplete() }
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
    />
}
