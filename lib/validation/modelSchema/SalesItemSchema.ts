import { z } from 'zod';
import {
    SaleWithRelationsSchema,
    SalePartialWithRelationsSchema,
    SaleOptionalDefaultsWithRelationsSchema
} from './SaleSchema'
import type { SaleWithRelations, SalePartialWithRelations, SaleOptionalDefaultsWithRelations } from './SaleSchema'
import {
    ProductWithRelationsSchema,
    ProductPartialWithRelationsSchema,
    ProductOptionalDefaultsWithRelationsSchema
} from './ProductSchema'
import type {
    ProductWithRelations,
    ProductPartialWithRelations,
    ProductOptionalDefaultsWithRelations
} from './ProductSchema'

/////////////////////////////////////////
// SALES ITEM SCHEMA
/////////////////////////////////////////

export const SalesItemSchema = z.object({
  id: z.number().int(),
  saleId: z.number().int(),
  productId: z.number().int(),
  quantity: z.number().min(1),
    priceAtBuy: z.number().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type SalesItem = z.infer<typeof SalesItemSchema>

/////////////////////////////////////////
// SALES ITEM PARTIAL SCHEMA
/////////////////////////////////////////

export const SalesItemPartialSchema = SalesItemSchema.partial()

export type SalesItemPartial = z.infer<typeof SalesItemPartialSchema>

/////////////////////////////////////////
// SALES ITEM OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const SalesItemOptionalDefaultsSchema = SalesItemSchema.merge(z.object({
  id: z.number().int().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type SalesItemOptionalDefaults = z.infer<typeof SalesItemOptionalDefaultsSchema>

/////////////////////////////////////////
// SALES ITEM RELATION SCHEMA
/////////////////////////////////////////

export type SalesItemRelations = {
  sale: SaleWithRelations;
  product: ProductWithRelations;
};

export type SalesItemWithRelations = z.infer<typeof SalesItemSchema> & SalesItemRelations

export const SalesItemWithRelationsSchema: z.ZodType<SalesItemWithRelations> = SalesItemSchema.merge(z.object({
  sale: z.lazy(() => SaleWithRelationsSchema),
  product: z.lazy(() => ProductWithRelationsSchema),
}))

/////////////////////////////////////////
// SALES ITEM OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type SalesItemOptionalDefaultsRelations = {
  sale: SaleOptionalDefaultsWithRelations;
  product: ProductOptionalDefaultsWithRelations;
};

export type SalesItemOptionalDefaultsWithRelations = z.infer<typeof SalesItemOptionalDefaultsSchema> & SalesItemOptionalDefaultsRelations

export const SalesItemOptionalDefaultsWithRelationsSchema: z.ZodType<SalesItemOptionalDefaultsWithRelations> = SalesItemOptionalDefaultsSchema.merge(z.object({
  sale: z.lazy(() => SaleOptionalDefaultsWithRelationsSchema),
  product: z.lazy(() => ProductOptionalDefaultsWithRelationsSchema),
}))

/////////////////////////////////////////
// SALES ITEM PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type SalesItemPartialRelations = {
  sale?: SalePartialWithRelations;
  product?: ProductPartialWithRelations;
};

export type SalesItemPartialWithRelations = z.infer<typeof SalesItemPartialSchema> & SalesItemPartialRelations

export const SalesItemPartialWithRelationsSchema: z.ZodType<SalesItemPartialWithRelations> = SalesItemPartialSchema.merge(z.object({
  sale: z.lazy(() => SalePartialWithRelationsSchema),
  product: z.lazy(() => ProductPartialWithRelationsSchema),
})).partial()

export type SalesItemOptionalDefaultsWithPartialRelations = z.infer<typeof SalesItemOptionalDefaultsSchema> & SalesItemPartialRelations

export const SalesItemOptionalDefaultsWithPartialRelationsSchema: z.ZodType<SalesItemOptionalDefaultsWithPartialRelations> = SalesItemOptionalDefaultsSchema.merge(z.object({
  sale: z.lazy(() => SalePartialWithRelationsSchema),
  product: z.lazy(() => ProductPartialWithRelationsSchema),
}).partial())

export type SalesItemWithPartialRelations = z.infer<typeof SalesItemSchema> & SalesItemPartialRelations

export const SalesItemWithPartialRelationsSchema: z.ZodType<SalesItemWithPartialRelations> = SalesItemSchema.merge(z.object({
  sale: z.lazy(() => SalePartialWithRelationsSchema),
  product: z.lazy(() => ProductPartialWithRelationsSchema),
}).partial())

export default SalesItemSchema;
