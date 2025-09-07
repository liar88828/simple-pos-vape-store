import { getProduct, } from "@/action/product-action";
import { getPreorderPage } from "@/app/admin/inventory/inventory-action";
import { InventoryPage } from "@/app/admin/inventory/inventory-server";
import { ContextPage } from "@/interface/actionType";

export default async function page(context: ContextPage) {
    return <InventoryPage
        preorders={ await getPreorderPage(context) }
        products={ await getProduct(context, null) }
    />
}
