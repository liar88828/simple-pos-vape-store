import { brands, getProduct } from "@/action/product-action";
import { getContextPage } from "@/components/context-action";
import { ProductsPage } from "@/components/products-page"
import { ContextPage } from "@/interface/actionType";

export default async function Products(context: ContextPage) {
    // .then(item => item.filter(i => i.brand !== null))

    // console.log(brands)
    const productName = await getContextPage(context, 'productName')
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

    return <ProductsPage
        products={ await getProduct({
                productBrand,
                productCategory,
                productCotton,
                productTypeDevice,
                productResistant,
                productCoil,
                productBattery,
                productName,
                productNicotine,
            },
            Number(productLimit),
            Number(productPage),
        ) }
        brands={ await brands() }

    />
}
