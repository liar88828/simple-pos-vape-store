import * as z from "zod"
import { CompletePayment, RelatedPaymentModel } from "./index"

export const PaymentListModel = z.object({
    id: z.string(),
    title: z.string().min(1),
    value: z.string().min(1),
    fee: z.number().int().min(0),
    paymentId: z.string().nullish(),
})

export interface CompletePaymentList extends z.infer<typeof PaymentListModel> {
    Payment?: CompletePayment | null
}

/**
 * RelatedPaymentListModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPaymentListModel: z.ZodSchema<CompletePaymentList> = z.lazy(() => PaymentListModel.extend({
    Payment: RelatedPaymentModel.nullish(),
}))
