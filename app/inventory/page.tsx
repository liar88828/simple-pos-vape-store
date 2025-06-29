import { InventoryPage } from "@/components/inventory-page"
import { getProduct, getProductLowStockComplete } from "@/action/product-action";
import { ContextPage } from "@/interface/actionType";
import { getContextPage } from "@/components/context-action";

export default async function Inventory(context: ContextPage) {
    const productName = await getContextPage(context, 'productName') ?? '';

    return <InventoryPage lowStockProducts={ await getProductLowStockComplete() }
                          products={ await getProduct(productName) }
    />
}
