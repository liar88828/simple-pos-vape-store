import {
    getExpiredProduct,
    getPreorderPage,
    getProductLowStockComplete,
    getProductPage
} from "@/action/product-action";
import { InventoryPage } from "@/components/page/inventory-page"
import { ContextPage } from "@/interface/actionType";

export default async function page(context: ContextPage) {

    return <InventoryPage
        expiredProduct={ await getExpiredProduct() }
        lowStockProducts={ await getProductLowStockComplete() }
        preorders={ await getPreorderPage(context) }
        products={ await getProductPage(context) }
    />
}
