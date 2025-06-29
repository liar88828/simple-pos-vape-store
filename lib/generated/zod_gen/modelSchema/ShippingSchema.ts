import { z } from 'zod';
import { ShippingListWithRelationsSchema, ShippingListPartialWithRelationsSchema, ShippingListOptionalDefaultsWithRelationsSchema } from './ShippingListSchema'
import type { ShippingListWithRelations, ShippingListPartialWithRelations, ShippingListOptionalDefaultsWithRelations } from './ShippingListSchema'

/////////////////////////////////////////
// SHIPPING SCHEMA
/////////////////////////////////////////

export const ShippingSchema = z.object({
  id: z.string().uuid(),
  freeShippingThreshold: z.number().min(0),
  handlingFee: z.number().min(0),
  internationalShipping: z.boolean(),
  internationalRate: z.number().min(0),
})

export type Shipping = z.infer<typeof ShippingSchema>

/////////////////////////////////////////
// SHIPPING PARTIAL SCHEMA
/////////////////////////////////////////

export const ShippingPartialSchema = ShippingSchema.partial()

export type ShippingPartial = z.infer<typeof ShippingPartialSchema>

/////////////////////////////////////////
// SHIPPING OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const ShippingOptionalDefaultsSchema = ShippingSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type ShippingOptionalDefaults = z.infer<typeof ShippingOptionalDefaultsSchema>

/////////////////////////////////////////
// SHIPPING RELATION SCHEMA
/////////////////////////////////////////

export type ShippingRelations = {
  ShippingList: ShippingListWithRelations[];
};

export type ShippingWithRelations = z.infer<typeof ShippingSchema> & ShippingRelations

export const ShippingWithRelationsSchema: z.ZodType<ShippingWithRelations> = ShippingSchema.merge(z.object({
  ShippingList: z.lazy(() => ShippingListWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SHIPPING OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type ShippingOptionalDefaultsRelations = {
  ShippingList: ShippingListOptionalDefaultsWithRelations[];
};

export type ShippingOptionalDefaultsWithRelations = z.infer<typeof ShippingOptionalDefaultsSchema> & ShippingOptionalDefaultsRelations

export const ShippingOptionalDefaultsWithRelationsSchema: z.ZodType<ShippingOptionalDefaultsWithRelations> = ShippingOptionalDefaultsSchema.merge(z.object({
  ShippingList: z.lazy(() => ShippingListOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SHIPPING PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type ShippingPartialRelations = {
  ShippingList?: ShippingListPartialWithRelations[];
};

export type ShippingPartialWithRelations = z.infer<typeof ShippingPartialSchema> & ShippingPartialRelations

export const ShippingPartialWithRelationsSchema: z.ZodType<ShippingPartialWithRelations> = ShippingPartialSchema.merge(z.object({
  ShippingList: z.lazy(() => ShippingListPartialWithRelationsSchema).array(),
})).partial()

export type ShippingOptionalDefaultsWithPartialRelations = z.infer<typeof ShippingOptionalDefaultsSchema> & ShippingPartialRelations

export const ShippingOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ShippingOptionalDefaultsWithPartialRelations> = ShippingOptionalDefaultsSchema.merge(z.object({
  ShippingList: z.lazy(() => ShippingListPartialWithRelationsSchema).array(),
}).partial())

export type ShippingWithPartialRelations = z.infer<typeof ShippingSchema> & ShippingPartialRelations

export const ShippingWithPartialRelationsSchema: z.ZodType<ShippingWithPartialRelations> = ShippingSchema.merge(z.object({
  ShippingList: z.lazy(() => ShippingListPartialWithRelationsSchema).array(),
}).partial())

export default ShippingSchema;
