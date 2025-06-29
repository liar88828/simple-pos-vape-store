import * as z from "zod"
import { CompleteSale, RelatedSaleModel, CompletePreOrder, RelatedPreOrderModel } from "./index"

export const CustomerModel = z.object({
    id: z.number().int(),
    name: z.string().min(1),
    age: z.number().int().max(80),
    totalPurchase: z.number().int().min(0),
    status: z.string().min(1),
    lastPurchase: z.date(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export interface CompleteCustomer extends z.infer<typeof CustomerModel> {
    Sales: CompleteSale[]
    PreOrders: CompletePreOrder[]
}

/**
 * RelatedCustomerModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCustomerModel: z.ZodSchema<CompleteCustomer> = z.lazy(() => CustomerModel.extend({
    Sales: RelatedSaleModel.array(),
    PreOrders: RelatedPreOrderModel.array(),
}))
