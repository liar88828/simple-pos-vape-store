import { z } from 'zod';
import { PreOrderWithRelationsSchema, PreOrderPartialWithRelationsSchema, PreOrderOptionalDefaultsWithRelationsSchema } from './PreOrderSchema'
import type { PreOrderWithRelations, PreOrderPartialWithRelations, PreOrderOptionalDefaultsWithRelations } from './PreOrderSchema'
import { ProductWithRelationsSchema, ProductPartialWithRelationsSchema, ProductOptionalDefaultsWithRelationsSchema } from './ProductSchema'
import type { ProductWithRelations, ProductPartialWithRelations, ProductOptionalDefaultsWithRelations } from './ProductSchema'
import { SaleWithRelationsSchema, SalePartialWithRelationsSchema, SaleOptionalDefaultsWithRelationsSchema } from './SaleSchema'
import type { SaleWithRelations, SalePartialWithRelations, SaleOptionalDefaultsWithRelations } from './SaleSchema'

/////////////////////////////////////////
// SALES ITEM SCHEMA
/////////////////////////////////////////

export const SalesItemSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().min(1),
  priceAtBuy: z.number().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  preorderId: z.string(),
  productId: z.string(),
  saleId: z.string(),
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
  id: z.string().uuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type SalesItemOptionalDefaults = z.infer<typeof SalesItemOptionalDefaultsSchema>

/////////////////////////////////////////
// SALES ITEM RELATION SCHEMA
/////////////////////////////////////////

export type SalesItemRelations = {
  PreOrder: PreOrderWithRelations;
  Product: ProductWithRelations;
  Sale: SaleWithRelations;
};

export type SalesItemWithRelations = z.infer<typeof SalesItemSchema> & SalesItemRelations

export const SalesItemWithRelationsSchema: z.ZodType<SalesItemWithRelations> = SalesItemSchema.merge(z.object({
  PreOrder: z.lazy(() => PreOrderWithRelationsSchema),
  Product: z.lazy(() => ProductWithRelationsSchema),
  Sale: z.lazy(() => SaleWithRelationsSchema),
}))

/////////////////////////////////////////
// SALES ITEM OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type SalesItemOptionalDefaultsRelations = {
  PreOrder: PreOrderOptionalDefaultsWithRelations;
  Product: ProductOptionalDefaultsWithRelations;
  Sale: SaleOptionalDefaultsWithRelations;
};

export type SalesItemOptionalDefaultsWithRelations = z.infer<typeof SalesItemOptionalDefaultsSchema> & SalesItemOptionalDefaultsRelations

export const SalesItemOptionalDefaultsWithRelationsSchema: z.ZodType<SalesItemOptionalDefaultsWithRelations> = SalesItemOptionalDefaultsSchema.merge(z.object({
  PreOrder: z.lazy(() => PreOrderOptionalDefaultsWithRelationsSchema),
  Product: z.lazy(() => ProductOptionalDefaultsWithRelationsSchema),
  Sale: z.lazy(() => SaleOptionalDefaultsWithRelationsSchema),
}))

/////////////////////////////////////////
// SALES ITEM PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type SalesItemPartialRelations = {
  PreOrder?: PreOrderPartialWithRelations;
  Product?: ProductPartialWithRelations;
  Sale?: SalePartialWithRelations;
};

export type SalesItemPartialWithRelations = z.infer<typeof SalesItemPartialSchema> & SalesItemPartialRelations

export const SalesItemPartialWithRelationsSchema: z.ZodType<SalesItemPartialWithRelations> = SalesItemPartialSchema.merge(z.object({
  PreOrder: z.lazy(() => PreOrderPartialWithRelationsSchema),
  Product: z.lazy(() => ProductPartialWithRelationsSchema),
  Sale: z.lazy(() => SalePartialWithRelationsSchema),
})).partial()

export type SalesItemOptionalDefaultsWithPartialRelations = z.infer<typeof SalesItemOptionalDefaultsSchema> & SalesItemPartialRelations

export const SalesItemOptionalDefaultsWithPartialRelationsSchema: z.ZodType<SalesItemOptionalDefaultsWithPartialRelations> = SalesItemOptionalDefaultsSchema.merge(z.object({
  PreOrder: z.lazy(() => PreOrderPartialWithRelationsSchema),
  Product: z.lazy(() => ProductPartialWithRelationsSchema),
  Sale: z.lazy(() => SalePartialWithRelationsSchema),
}).partial())

export type SalesItemWithPartialRelations = z.infer<typeof SalesItemSchema> & SalesItemPartialRelations

export const SalesItemWithPartialRelationsSchema: z.ZodType<SalesItemWithPartialRelations> = SalesItemSchema.merge(z.object({
  PreOrder: z.lazy(() => PreOrderPartialWithRelationsSchema),
  Product: z.lazy(() => ProductPartialWithRelationsSchema),
  Sale: z.lazy(() => SalePartialWithRelationsSchema),
}).partial())

export default SalesItemSchema;
