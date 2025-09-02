import { getProductPage } from "@/action/product-action";
import { ProductsPage } from "@/app/admin/products/products-page"
import { ContextPage } from "@/interface/actionType";
import { logger } from "@/lib/logger";

export default async function Products(context: ContextPage) {
    logger.info("page : Products");

    return <ProductsPage
        products={ await getProductPage(context) }
    />
}
