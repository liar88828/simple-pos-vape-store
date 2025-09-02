import { z } from 'zod';
import {
    ShippingWithRelationsSchema,
    ShippingPartialWithRelationsSchema,
    ShippingOptionalDefaultsWithRelationsSchema
} from './ShippingSchema'
import type {
    ShippingWithRelations,
    ShippingPartialWithRelations,
    ShippingOptionalDefaultsWithRelations
} from './ShippingSchema'

/////////////////////////////////////////
// SHIPPING LIST SCHEMA
/////////////////////////////////////////

export const ShippingListSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  price: z.number().min(0),
  rates: z.number().min(0),
  shippingId: z.string().nullish(),
})

export type ShippingList = z.infer<typeof ShippingListSchema>

/////////////////////////////////////////
// SHIPPING LIST PARTIAL SCHEMA
/////////////////////////////////////////

export const ShippingListPartialSchema = ShippingListSchema.partial()

export type ShippingListPartial = z.infer<typeof ShippingListPartialSchema>

/////////////////////////////////////////
// SHIPPING LIST OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const ShippingListOptionalDefaultsSchema = ShippingListSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type ShippingListOptionalDefaults = z.infer<typeof ShippingListOptionalDefaultsSchema>

/////////////////////////////////////////
// SHIPPING LIST RELATION SCHEMA
/////////////////////////////////////////

export type ShippingListRelations = {
  Shipping?: ShippingWithRelations | null;
};

export type ShippingListWithRelations = z.infer<typeof ShippingListSchema> & ShippingListRelations

export const ShippingListWithRelationsSchema: z.ZodType<ShippingListWithRelations> = ShippingListSchema.merge(z.object({
  Shipping: z.lazy(() => ShippingWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// SHIPPING LIST OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type ShippingListOptionalDefaultsRelations = {
  Shipping?: ShippingOptionalDefaultsWithRelations | null;
};

export type ShippingListOptionalDefaultsWithRelations = z.infer<typeof ShippingListOptionalDefaultsSchema> & ShippingListOptionalDefaultsRelations

export const ShippingListOptionalDefaultsWithRelationsSchema: z.ZodType<ShippingListOptionalDefaultsWithRelations> = ShippingListOptionalDefaultsSchema.merge(z.object({
  Shipping: z.lazy(() => ShippingOptionalDefaultsWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// SHIPPING LIST PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type ShippingListPartialRelations = {
  Shipping?: ShippingPartialWithRelations | null;
};

export type ShippingListPartialWithRelations = z.infer<typeof ShippingListPartialSchema> & ShippingListPartialRelations

export const ShippingListPartialWithRelationsSchema: z.ZodType<ShippingListPartialWithRelations> = ShippingListPartialSchema.merge(z.object({
  Shipping: z.lazy(() => ShippingPartialWithRelationsSchema).nullish(),
})).partial()

export type ShippingListOptionalDefaultsWithPartialRelations = z.infer<typeof ShippingListOptionalDefaultsSchema> & ShippingListPartialRelations

export const ShippingListOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ShippingListOptionalDefaultsWithPartialRelations> = ShippingListOptionalDefaultsSchema.merge(z.object({
  Shipping: z.lazy(() => ShippingPartialWithRelationsSchema).nullish(),
}).partial())

export type ShippingListWithPartialRelations = z.infer<typeof ShippingListSchema> & ShippingListPartialRelations

export const ShippingListWithPartialRelationsSchema: z.ZodType<ShippingListWithPartialRelations> = ShippingListSchema.merge(z.object({
  Shipping: z.lazy(() => ShippingPartialWithRelationsSchema).nullish(),
}).partial())

export default ShippingListSchema;
