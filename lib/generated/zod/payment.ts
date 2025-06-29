import * as z from "zod"
import { CompletePaymentList, RelatedPaymentListModel } from "./index"

export const PaymentModel = z.object({
    id: z.string(),
    isCod: z.boolean(),
    valueCod: z.number().int().min(0),
})

export interface CompletePayment extends z.infer<typeof PaymentModel> {
    PaymentList: CompletePaymentList[]
}

/**
 * RelatedPaymentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPaymentModel: z.ZodSchema<CompletePayment> = z.lazy(() => PaymentModel.extend({
    PaymentList: RelatedPaymentListModel.array(),
}))
