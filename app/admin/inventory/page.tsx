import { getProductLowStockComplete, getProductPage } from "@/action/product-action";
import { getExpiredProduct, getPreorderPage } from "@/app/admin/inventory/inventory-action";
import { InventoryPage } from "@/app/admin/inventory/inventory-page"
import { ContextPage } from "@/interface/actionType";

export default async function page(context: ContextPage) {
    return <InventoryPage
        expiredProduct={ await getExpiredProduct() }
        lowStockProducts={ await getProductLowStockComplete() }
        preorders={ await getPreorderPage(context) }
        products={ await getProductPage(context) }
    />
}
