import { z } from 'zod';
import {
    PaymentSettingListWithRelationsSchema,
    PaymentSettingListPartialWithRelationsSchema,
    PaymentSettingListOptionalDefaultsWithRelationsSchema
} from './PaymentSettingListSchema'
import type {
    PaymentSettingListWithRelations,
    PaymentSettingListPartialWithRelations,
    PaymentSettingListOptionalDefaultsWithRelations
} from './PaymentSettingListSchema'

/////////////////////////////////////////
// PAYMENT SETTING SCHEMA
/////////////////////////////////////////

export const PaymentSettingSchema = z.object({
    id: z.string().uuid(),
    isCod: z.boolean(),
    isTax: z.boolean(),
    valueCod: z.number().min(0),
    valueTax: z.number().min(0),
})

export type PaymentSetting = z.infer<typeof PaymentSettingSchema>

/////////////////////////////////////////
// PAYMENT SETTING PARTIAL SCHEMA
/////////////////////////////////////////

export const PaymentSettingPartialSchema = PaymentSettingSchema.partial()

export type PaymentSettingPartial = z.infer<typeof PaymentSettingPartialSchema>

/////////////////////////////////////////
// PAYMENT SETTING OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const PaymentSettingOptionalDefaultsSchema = PaymentSettingSchema.merge(z.object({
    id: z.string().uuid().optional(),
    isCod: z.boolean().optional(),
    isTax: z.boolean().optional(),
    valueCod: z.number().min(0).optional(),
    valueTax: z.number().min(0).optional(),
}))

export type PaymentSettingOptionalDefaults = z.infer<typeof PaymentSettingOptionalDefaultsSchema>

/////////////////////////////////////////
// PAYMENT SETTING RELATION SCHEMA
/////////////////////////////////////////

export type PaymentSettingRelations = {
    PaymentList: PaymentSettingListWithRelations[];
};

export type PaymentSettingWithRelations = z.infer<typeof PaymentSettingSchema> & PaymentSettingRelations

export const PaymentSettingWithRelationsSchema: z.ZodType<PaymentSettingWithRelations> = PaymentSettingSchema.merge(z.object({
    PaymentList: z.lazy(() => PaymentSettingListWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// PAYMENT SETTING OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type PaymentSettingOptionalDefaultsRelations = {
    PaymentList: PaymentSettingListOptionalDefaultsWithRelations[];
};

export type PaymentSettingOptionalDefaultsWithRelations =
    z.infer<typeof PaymentSettingOptionalDefaultsSchema>
    & PaymentSettingOptionalDefaultsRelations

export const PaymentSettingOptionalDefaultsWithRelationsSchema: z.ZodType<PaymentSettingOptionalDefaultsWithRelations> = PaymentSettingOptionalDefaultsSchema.merge(z.object({
    PaymentList: z.lazy(() => PaymentSettingListOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// PAYMENT SETTING PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type PaymentSettingPartialRelations = {
    PaymentList?: PaymentSettingListPartialWithRelations[];
};

export type PaymentSettingPartialWithRelations =
    z.infer<typeof PaymentSettingPartialSchema>
    & PaymentSettingPartialRelations

export const PaymentSettingPartialWithRelationsSchema: z.ZodType<PaymentSettingPartialWithRelations> = PaymentSettingPartialSchema.merge(z.object({
    PaymentList: z.lazy(() => PaymentSettingListPartialWithRelationsSchema).array(),
})).partial()

export type PaymentSettingOptionalDefaultsWithPartialRelations =
    z.infer<typeof PaymentSettingOptionalDefaultsSchema>
    & PaymentSettingPartialRelations

export const PaymentSettingOptionalDefaultsWithPartialRelationsSchema: z.ZodType<PaymentSettingOptionalDefaultsWithPartialRelations> = PaymentSettingOptionalDefaultsSchema.merge(z.object({
    PaymentList: z.lazy(() => PaymentSettingListPartialWithRelationsSchema).array(),
}).partial())

export type PaymentSettingWithPartialRelations = z.infer<typeof PaymentSettingSchema> & PaymentSettingPartialRelations

export const PaymentSettingWithPartialRelationsSchema: z.ZodType<PaymentSettingWithPartialRelations> = PaymentSettingSchema.merge(z.object({
    PaymentList: z.lazy(() => PaymentSettingListPartialWithRelationsSchema).array(),
}).partial())

export default PaymentSettingSchema;
