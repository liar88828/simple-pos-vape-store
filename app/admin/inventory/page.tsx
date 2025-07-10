import { getExpiredProduct, getPreorder, getProduct, getProductLowStockComplete } from "@/action/product-action";
import { getContextPage } from "@/components/context-action";
import { InventoryPage } from "@/components/inventory-page"
import { ContextPage } from "@/interface/actionType";

export default async function Inventory(context: ContextPage) {

    return <InventoryPage
        expiredProduct={ await getExpiredProduct() }
        lowStockProducts={ await getProductLowStockComplete() }

        preorders={ await getPreorder({
            inventoryName: await getContextPage(context, 'inventoryName'),
            inventoryStock: await getContextPage(context, 'inventoryStock'),
            inventoryExpired: await getContextPage(context, 'inventoryExpired'),
            inventoryLimit: await getContextPage(context, 'inventoryLimit'),
            inventoryPage: await getContextPage(context, 'inventoryPage'),
        }) }
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
                productFluid: await getContextPage(context, 'productFluid'),
                productLimit: await getContextPage(context, 'productLimit'),
                productPage: await getContextPage(context, 'productPage')
            },
        ) }
    />
}
