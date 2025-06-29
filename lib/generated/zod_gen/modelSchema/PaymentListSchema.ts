import { z } from 'zod';
import { PaymentWithRelationsSchema, PaymentPartialWithRelationsSchema, PaymentOptionalDefaultsWithRelationsSchema } from './PaymentSchema'
import type { PaymentWithRelations, PaymentPartialWithRelations, PaymentOptionalDefaultsWithRelations } from './PaymentSchema'

/////////////////////////////////////////
// PAYMENT LIST SCHEMA
/////////////////////////////////////////

export const PaymentListSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  value: z.string().min(1),
  fee: z.number().min(0),
  paymentId: z.string().nullish(),
})

export type PaymentList = z.infer<typeof PaymentListSchema>

/////////////////////////////////////////
// PAYMENT LIST PARTIAL SCHEMA
/////////////////////////////////////////

export const PaymentListPartialSchema = PaymentListSchema.partial()

export type PaymentListPartial = z.infer<typeof PaymentListPartialSchema>

/////////////////////////////////////////
// PAYMENT LIST OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const PaymentListOptionalDefaultsSchema = PaymentListSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type PaymentListOptionalDefaults = z.infer<typeof PaymentListOptionalDefaultsSchema>

/////////////////////////////////////////
// PAYMENT LIST RELATION SCHEMA
/////////////////////////////////////////

export type PaymentListRelations = {
  Payment?: PaymentWithRelations | null;
};

export type PaymentListWithRelations = z.infer<typeof PaymentListSchema> & PaymentListRelations

export const PaymentListWithRelationsSchema: z.ZodType<PaymentListWithRelations> = PaymentListSchema.merge(z.object({
  Payment: z.lazy(() => PaymentWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// PAYMENT LIST OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type PaymentListOptionalDefaultsRelations = {
  Payment?: PaymentOptionalDefaultsWithRelations | null;
};

export type PaymentListOptionalDefaultsWithRelations = z.infer<typeof PaymentListOptionalDefaultsSchema> & PaymentListOptionalDefaultsRelations

export const PaymentListOptionalDefaultsWithRelationsSchema: z.ZodType<PaymentListOptionalDefaultsWithRelations> = PaymentListOptionalDefaultsSchema.merge(z.object({
  Payment: z.lazy(() => PaymentOptionalDefaultsWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// PAYMENT LIST PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type PaymentListPartialRelations = {
  Payment?: PaymentPartialWithRelations | null;
};

export type PaymentListPartialWithRelations = z.infer<typeof PaymentListPartialSchema> & PaymentListPartialRelations

export const PaymentListPartialWithRelationsSchema: z.ZodType<PaymentListPartialWithRelations> = PaymentListPartialSchema.merge(z.object({
  Payment: z.lazy(() => PaymentPartialWithRelationsSchema).nullish(),
})).partial()

export type PaymentListOptionalDefaultsWithPartialRelations = z.infer<typeof PaymentListOptionalDefaultsSchema> & PaymentListPartialRelations

export const PaymentListOptionalDefaultsWithPartialRelationsSchema: z.ZodType<PaymentListOptionalDefaultsWithPartialRelations> = PaymentListOptionalDefaultsSchema.merge(z.object({
  Payment: z.lazy(() => PaymentPartialWithRelationsSchema).nullish(),
}).partial())

export type PaymentListWithPartialRelations = z.infer<typeof PaymentListSchema> & PaymentListPartialRelations

export const PaymentListWithPartialRelationsSchema: z.ZodType<PaymentListWithPartialRelations> = PaymentListSchema.merge(z.object({
  Payment: z.lazy(() => PaymentPartialWithRelationsSchema).nullish(),
}).partial())

export default PaymentListSchema;
