import * as z from "zod"
import { CompleteCustomer, RelatedCustomerModel, CompleteSalesItem, RelatedSalesItemModel } from "./index"

export const SaleModel = z.object({
    id: z.number().int(),
    date: z.date(),
    total: z.number().int().min(1),
    items: z.number().int().min(1),
    customerId: z.number().int(),
    statusTransaction: z.string().min(1),
    typeTransaction: z.string().min(1),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export interface CompleteSale extends z.infer<typeof SaleModel> {
    customer: CompleteCustomer
    SaleItems: CompleteSalesItem[]
}

/**
 * RelatedSaleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSaleModel: z.ZodSchema<CompleteSale> = z.lazy(() => SaleModel.extend({
    customer: RelatedCustomerModel,
    SaleItems: RelatedSalesItemModel.array(),
}))
