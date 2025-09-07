import { z } from 'zod';
import { ShippingSettingWithRelationsSchema, ShippingSettingPartialWithRelationsSchema, ShippingSettingOptionalDefaultsWithRelationsSchema } from './ShippingSettingSchema'
import type { ShippingSettingWithRelations, ShippingSettingPartialWithRelations, ShippingSettingOptionalDefaultsWithRelations } from './ShippingSettingSchema'

/////////////////////////////////////////
// SHIPPING SETTING LIST SCHEMA
/////////////////////////////////////////

export const ShippingSettingListSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  price: z.number().min(0),
  rates: z.number().min(0),
  shippingId: z.string().nullish(),
})

export type ShippingSettingList = z.infer<typeof ShippingSettingListSchema>

/////////////////////////////////////////
// SHIPPING SETTING LIST PARTIAL SCHEMA
/////////////////////////////////////////

export const ShippingSettingListPartialSchema = ShippingSettingListSchema.partial()

export type ShippingSettingListPartial = z.infer<typeof ShippingSettingListPartialSchema>

/////////////////////////////////////////
// SHIPPING SETTING LIST OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const ShippingSettingListOptionalDefaultsSchema = ShippingSettingListSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type ShippingSettingListOptionalDefaults = z.infer<typeof ShippingSettingListOptionalDefaultsSchema>

/////////////////////////////////////////
// SHIPPING SETTING LIST RELATION SCHEMA
/////////////////////////////////////////

export type ShippingSettingListRelations = {
  Shipping?: ShippingSettingWithRelations | null;
};

export type ShippingSettingListWithRelations = z.infer<typeof ShippingSettingListSchema> & ShippingSettingListRelations

export const ShippingSettingListWithRelationsSchema: z.ZodType<ShippingSettingListWithRelations> = ShippingSettingListSchema.merge(z.object({
  Shipping: z.lazy(() => ShippingSettingWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// SHIPPING SETTING LIST OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type ShippingSettingListOptionalDefaultsRelations = {
  Shipping?: ShippingSettingOptionalDefaultsWithRelations | null;
};

export type ShippingSettingListOptionalDefaultsWithRelations = z.infer<typeof ShippingSettingListOptionalDefaultsSchema> & ShippingSettingListOptionalDefaultsRelations

export const ShippingSettingListOptionalDefaultsWithRelationsSchema: z.ZodType<ShippingSettingListOptionalDefaultsWithRelations> = ShippingSettingListOptionalDefaultsSchema.merge(z.object({
  Shipping: z.lazy(() => ShippingSettingOptionalDefaultsWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// SHIPPING SETTING LIST PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type ShippingSettingListPartialRelations = {
  Shipping?: ShippingSettingPartialWithRelations | null;
};

export type ShippingSettingListPartialWithRelations = z.infer<typeof ShippingSettingListPartialSchema> & ShippingSettingListPartialRelations

export const ShippingSettingListPartialWithRelationsSchema: z.ZodType<ShippingSettingListPartialWithRelations> = ShippingSettingListPartialSchema.merge(z.object({
  Shipping: z.lazy(() => ShippingSettingPartialWithRelationsSchema).nullish(),
})).partial()

export type ShippingSettingListOptionalDefaultsWithPartialRelations = z.infer<typeof ShippingSettingListOptionalDefaultsSchema> & ShippingSettingListPartialRelations

export const ShippingSettingListOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ShippingSettingListOptionalDefaultsWithPartialRelations> = ShippingSettingListOptionalDefaultsSchema.merge(z.object({
  Shipping: z.lazy(() => ShippingSettingPartialWithRelationsSchema).nullish(),
}).partial())

export type ShippingSettingListWithPartialRelations = z.infer<typeof ShippingSettingListSchema> & ShippingSettingListPartialRelations

export const ShippingSettingListWithPartialRelationsSchema: z.ZodType<ShippingSettingListWithPartialRelations> = ShippingSettingListSchema.merge(z.object({
  Shipping: z.lazy(() => ShippingSettingPartialWithRelationsSchema).nullish(),
}).partial())

export default ShippingSettingListSchema;
