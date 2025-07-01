import { ProductsPage } from "@/components/products-page"
import { getProduct } from "@/action/product-action";
import { getContextPage } from "@/components/context-action";
import { ContextPage } from "@/interface/actionType";

export default async function Products(context: ContextPage) {

    const productName = await getContextPage(context, 'productName') ?? ''
    return <ProductsPage products={ await getProduct(productName) }/>
}
