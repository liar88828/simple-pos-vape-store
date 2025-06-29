import { z } from 'zod';
import { PaymentListWithRelationsSchema, PaymentListPartialWithRelationsSchema, PaymentListOptionalDefaultsWithRelationsSchema } from './PaymentListSchema'
import type { PaymentListWithRelations, PaymentListPartialWithRelations, PaymentListOptionalDefaultsWithRelations } from './PaymentListSchema'

/////////////////////////////////////////
// PAYMENT SCHEMA
/////////////////////////////////////////

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  isCod: z.boolean(),
  valueCod: z.number().min(0),
})

export type Payment = z.infer<typeof PaymentSchema>

/////////////////////////////////////////
// PAYMENT PARTIAL SCHEMA
/////////////////////////////////////////

export const PaymentPartialSchema = PaymentSchema.partial()

export type PaymentPartial = z.infer<typeof PaymentPartialSchema>

/////////////////////////////////////////
// PAYMENT OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const PaymentOptionalDefaultsSchema = PaymentSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type PaymentOptionalDefaults = z.infer<typeof PaymentOptionalDefaultsSchema>

/////////////////////////////////////////
// PAYMENT RELATION SCHEMA
/////////////////////////////////////////

export type PaymentRelations = {
  PaymentList: PaymentListWithRelations[];
};

export type PaymentWithRelations = z.infer<typeof PaymentSchema> & PaymentRelations

export const PaymentWithRelationsSchema: z.ZodType<PaymentWithRelations> = PaymentSchema.merge(z.object({
  PaymentList: z.lazy(() => PaymentListWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// PAYMENT OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type PaymentOptionalDefaultsRelations = {
  PaymentList: PaymentListOptionalDefaultsWithRelations[];
};

export type PaymentOptionalDefaultsWithRelations = z.infer<typeof PaymentOptionalDefaultsSchema> & PaymentOptionalDefaultsRelations

export const PaymentOptionalDefaultsWithRelationsSchema: z.ZodType<PaymentOptionalDefaultsWithRelations> = PaymentOptionalDefaultsSchema.merge(z.object({
  PaymentList: z.lazy(() => PaymentListOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// PAYMENT PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type PaymentPartialRelations = {
  PaymentList?: PaymentListPartialWithRelations[];
};

export type PaymentPartialWithRelations = z.infer<typeof PaymentPartialSchema> & PaymentPartialRelations

export const PaymentPartialWithRelationsSchema: z.ZodType<PaymentPartialWithRelations> = PaymentPartialSchema.merge(z.object({
  PaymentList: z.lazy(() => PaymentListPartialWithRelationsSchema).array(),
})).partial()

export type PaymentOptionalDefaultsWithPartialRelations = z.infer<typeof PaymentOptionalDefaultsSchema> & PaymentPartialRelations

export const PaymentOptionalDefaultsWithPartialRelationsSchema: z.ZodType<PaymentOptionalDefaultsWithPartialRelations> = PaymentOptionalDefaultsSchema.merge(z.object({
  PaymentList: z.lazy(() => PaymentListPartialWithRelationsSchema).array(),
}).partial())

export type PaymentWithPartialRelations = z.infer<typeof PaymentSchema> & PaymentPartialRelations

export const PaymentWithPartialRelationsSchema: z.ZodType<PaymentWithPartialRelations> = PaymentSchema.merge(z.object({
  PaymentList: z.lazy(() => PaymentListPartialWithRelationsSchema).array(),
}).partial())

export default PaymentSchema;
