import * as z from "zod"
import { CompleteCustomer, RelatedCustomerModel, CompleteProduct, RelatedProductModel } from "./index"

export const PreOrderModel = z.object({
    id: z.number().int(),
    customerId: z.number().int(),
    productId: z.number().int(),
    quantity: z.number().int().min(1),
    estimatedDate: z.date(),
    status: z.string().min(1),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export interface CompletePreOrder extends z.infer<typeof PreOrderModel> {
    customer: CompleteCustomer
    product: CompleteProduct
}

/**
 * RelatedPreOrderModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPreOrderModel: z.ZodSchema<CompletePreOrder> = z.lazy(() => PreOrderModel.extend({
    customer: RelatedCustomerModel,
    product: RelatedProductModel,
}))
