import * as z from "zod"
import { CompleteShippingList, RelatedShippingListModel } from "./index"

export const ShippingModel = z.object({
    id: z.string(),
    freeShippingThreshold: z.number().int().min(0),
    handlingFee: z.number().int().min(0),
    internationalShipping: z.boolean(),
    internationalRate: z.number().int().min(0),
})

export interface CompleteShipping extends z.infer<typeof ShippingModel> {
    ShippingList: CompleteShippingList[]
}

/**
 * RelatedShippingModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedShippingModel: z.ZodSchema<CompleteShipping> = z.lazy(() => ShippingModel.extend({
    ShippingList: RelatedShippingListModel.array(),
}))
