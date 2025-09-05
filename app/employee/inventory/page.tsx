import { getSessionEmployeePage } from "@/action/auth-action";
import { getProductLowStockComplete, getProductPage } from "@/action/product-action";
import { getExpiredProduct, getPreorderPage } from "@/app/admin/inventory/inventory-action";
import { InventoryPage } from "@/app/admin/inventory/inventory-page";
import { ContextPage } from "@/interface/actionType";
import React from 'react';

export default async function Page(context: ContextPage) {
    const session = await getSessionEmployeePage()

    return <InventoryPage
        expiredProduct={ await getExpiredProduct() }
        lowStockProducts={ await getProductLowStockComplete() }
        preorders={ await getPreorderPage(context) }
        products={ await getProductPage(context, session.shopId) }
    />
}

