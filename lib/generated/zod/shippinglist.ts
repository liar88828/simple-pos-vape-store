import * as z from "zod"
import { CompleteShipping, RelatedShippingModel } from "./index"

export const ShippingListModel = z.object({
    id: z.string(),
    name: z.string().min(1),
    price: z.number().int().min(0),
    rates: z.number().int().min(0),
    shippingId: z.string().nullish(),
})

export interface CompleteShippingList extends z.infer<typeof ShippingListModel> {
    Shipping?: CompleteShipping | null
}

/**
 * RelatedShippingListModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedShippingListModel: z.ZodSchema<CompleteShippingList> = z.lazy(() => ShippingListModel.extend({
    Shipping: RelatedShippingModel.nullish(),
}))
