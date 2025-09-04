import { z } from 'zod';
import {
    ShippingSettingListWithRelationsSchema,
    ShippingSettingListPartialWithRelationsSchema,
    ShippingSettingListOptionalDefaultsWithRelationsSchema
} from './ShippingSettingListSchema'
import type {
    ShippingSettingListWithRelations,
    ShippingSettingListPartialWithRelations,
    ShippingSettingListOptionalDefaultsWithRelations
} from './ShippingSettingListSchema'

/////////////////////////////////////////
// SHIPPING SETTING SCHEMA
/////////////////////////////////////////

export const ShippingSettingSchema = z.object({
    id: z.string().uuid(),
    freeShippingThreshold: z.number().min(0),
    handlingFee: z.number().min(0),
    internationalShipping: z.boolean(),
    internationalRate: z.number().min(0),
})

export type ShippingSetting = z.infer<typeof ShippingSettingSchema>

/////////////////////////////////////////
// SHIPPING SETTING PARTIAL SCHEMA
/////////////////////////////////////////

export const ShippingSettingPartialSchema = ShippingSettingSchema.partial()

export type ShippingSettingPartial = z.infer<typeof ShippingSettingPartialSchema>

/////////////////////////////////////////
// SHIPPING SETTING OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const ShippingSettingOptionalDefaultsSchema = ShippingSettingSchema.merge(z.object({
    id: z.string().uuid().optional(),
}))

export type ShippingSettingOptionalDefaults = z.infer<typeof ShippingSettingOptionalDefaultsSchema>

/////////////////////////////////////////
// SHIPPING SETTING RELATION SCHEMA
/////////////////////////////////////////

export type ShippingSettingRelations = {
    ShippingList: ShippingSettingListWithRelations[];
};

export type ShippingSettingWithRelations = z.infer<typeof ShippingSettingSchema> & ShippingSettingRelations

export const ShippingSettingWithRelationsSchema: z.ZodType<ShippingSettingWithRelations> = ShippingSettingSchema.merge(z.object({
    ShippingList: z.lazy(() => ShippingSettingListWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SHIPPING SETTING OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type ShippingSettingOptionalDefaultsRelations = {
    ShippingList: ShippingSettingListOptionalDefaultsWithRelations[];
};

export type ShippingSettingOptionalDefaultsWithRelations =
    z.infer<typeof ShippingSettingOptionalDefaultsSchema>
    & ShippingSettingOptionalDefaultsRelations

export const ShippingSettingOptionalDefaultsWithRelationsSchema: z.ZodType<ShippingSettingOptionalDefaultsWithRelations> = ShippingSettingOptionalDefaultsSchema.merge(z.object({
    ShippingList: z.lazy(() => ShippingSettingListOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SHIPPING SETTING PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type ShippingSettingPartialRelations = {
    ShippingList?: ShippingSettingListPartialWithRelations[];
};

export type ShippingSettingPartialWithRelations =
    z.infer<typeof ShippingSettingPartialSchema>
    & ShippingSettingPartialRelations

export const ShippingSettingPartialWithRelationsSchema: z.ZodType<ShippingSettingPartialWithRelations> = ShippingSettingPartialSchema.merge(z.object({
    ShippingList: z.lazy(() => ShippingSettingListPartialWithRelationsSchema).array(),
})).partial()

export type ShippingSettingOptionalDefaultsWithPartialRelations =
    z.infer<typeof ShippingSettingOptionalDefaultsSchema>
    & ShippingSettingPartialRelations

export const ShippingSettingOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ShippingSettingOptionalDefaultsWithPartialRelations> = ShippingSettingOptionalDefaultsSchema.merge(z.object({
    ShippingList: z.lazy(() => ShippingSettingListPartialWithRelationsSchema).array(),
}).partial())

export type ShippingSettingWithPartialRelations =
    z.infer<typeof ShippingSettingSchema>
    & ShippingSettingPartialRelations

export const ShippingSettingWithPartialRelationsSchema: z.ZodType<ShippingSettingWithPartialRelations> = ShippingSettingSchema.merge(z.object({
    ShippingList: z.lazy(() => ShippingSettingListPartialWithRelationsSchema).array(),
}).partial())

export default ShippingSettingSchema;
