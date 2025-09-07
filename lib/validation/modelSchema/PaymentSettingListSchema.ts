import { z } from 'zod';
import { PaymentSettingWithRelationsSchema, PaymentSettingPartialWithRelationsSchema, PaymentSettingOptionalDefaultsWithRelationsSchema } from './PaymentSettingSchema'
import type { PaymentSettingWithRelations, PaymentSettingPartialWithRelations, PaymentSettingOptionalDefaultsWithRelations } from './PaymentSettingSchema'

/////////////////////////////////////////
// PAYMENT SETTING LIST SCHEMA
/////////////////////////////////////////

export const PaymentSettingListSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  value: z.string().min(1),
  fee: z.number().min(0),
  rekening: z.string(),
  paymentId: z.string().nullish(),
})

export type PaymentSettingList = z.infer<typeof PaymentSettingListSchema>

/////////////////////////////////////////
// PAYMENT SETTING LIST PARTIAL SCHEMA
/////////////////////////////////////////

export const PaymentSettingListPartialSchema = PaymentSettingListSchema.partial()

export type PaymentSettingListPartial = z.infer<typeof PaymentSettingListPartialSchema>

/////////////////////////////////////////
// PAYMENT SETTING LIST OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const PaymentSettingListOptionalDefaultsSchema = PaymentSettingListSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type PaymentSettingListOptionalDefaults = z.infer<typeof PaymentSettingListOptionalDefaultsSchema>

/////////////////////////////////////////
// PAYMENT SETTING LIST RELATION SCHEMA
/////////////////////////////////////////

export type PaymentSettingListRelations = {
  Payment?: PaymentSettingWithRelations | null;
};

export type PaymentSettingListWithRelations = z.infer<typeof PaymentSettingListSchema> & PaymentSettingListRelations

export const PaymentSettingListWithRelationsSchema: z.ZodType<PaymentSettingListWithRelations> = PaymentSettingListSchema.merge(z.object({
  Payment: z.lazy(() => PaymentSettingWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// PAYMENT SETTING LIST OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type PaymentSettingListOptionalDefaultsRelations = {
  Payment?: PaymentSettingOptionalDefaultsWithRelations | null;
};

export type PaymentSettingListOptionalDefaultsWithRelations = z.infer<typeof PaymentSettingListOptionalDefaultsSchema> & PaymentSettingListOptionalDefaultsRelations

export const PaymentSettingListOptionalDefaultsWithRelationsSchema: z.ZodType<PaymentSettingListOptionalDefaultsWithRelations> = PaymentSettingListOptionalDefaultsSchema.merge(z.object({
  Payment: z.lazy(() => PaymentSettingOptionalDefaultsWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// PAYMENT SETTING LIST PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type PaymentSettingListPartialRelations = {
  Payment?: PaymentSettingPartialWithRelations | null;
};

export type PaymentSettingListPartialWithRelations = z.infer<typeof PaymentSettingListPartialSchema> & PaymentSettingListPartialRelations

export const PaymentSettingListPartialWithRelationsSchema: z.ZodType<PaymentSettingListPartialWithRelations> = PaymentSettingListPartialSchema.merge(z.object({
  Payment: z.lazy(() => PaymentSettingPartialWithRelationsSchema).nullish(),
})).partial()

export type PaymentSettingListOptionalDefaultsWithPartialRelations = z.infer<typeof PaymentSettingListOptionalDefaultsSchema> & PaymentSettingListPartialRelations

export const PaymentSettingListOptionalDefaultsWithPartialRelationsSchema: z.ZodType<PaymentSettingListOptionalDefaultsWithPartialRelations> = PaymentSettingListOptionalDefaultsSchema.merge(z.object({
  Payment: z.lazy(() => PaymentSettingPartialWithRelationsSchema).nullish(),
}).partial())

export type PaymentSettingListWithPartialRelations = z.infer<typeof PaymentSettingListSchema> & PaymentSettingListPartialRelations

export const PaymentSettingListWithPartialRelationsSchema: z.ZodType<PaymentSettingListWithPartialRelations> = PaymentSettingListSchema.merge(z.object({
  Payment: z.lazy(() => PaymentSettingPartialWithRelationsSchema).nullish(),
}).partial())

export default PaymentSettingListSchema;
