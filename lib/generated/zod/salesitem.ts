import * as z from "zod"
import { CompleteSale, RelatedSaleModel, CompleteProduct, RelatedProductModel } from "./index"

export const SalesItemModel = z.object({
    id: z.number().int(),
    saleId: z.number().int(),
    productId: z.number().int(),
    quantity: z.number().int().min(1),
    price: z.number().int().min(1),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export interface CompleteSalesItem extends z.infer<typeof SalesItemModel> {
    sale: CompleteSale
    product: CompleteProduct
}

/**
 * RelatedSalesItemModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSalesItemModel: z.ZodSchema<CompleteSalesItem> = z.lazy(() => SalesItemModel.extend({
    sale: RelatedSaleModel,
    product: RelatedProductModel,
}))
