import { z } from 'zod';
import { PreOrderWithRelationsSchema, PreOrderPartialWithRelationsSchema, PreOrderOptionalDefaultsWithRelationsSchema } from './PreOrderSchema'
import type { PreOrderWithRelations, PreOrderPartialWithRelations, PreOrderOptionalDefaultsWithRelations } from './PreOrderSchema'
import { SalesItemWithRelationsSchema, SalesItemPartialWithRelationsSchema, SalesItemOptionalDefaultsWithRelationsSchema } from './SalesItemSchema'
import type { SalesItemWithRelations, SalesItemPartialWithRelations, SalesItemOptionalDefaultsWithRelations } from './SalesItemSchema'

/////////////////////////////////////////
// PRODUCT SCHEMA
/////////////////////////////////////////

export const ProductSchema = z.object({
  id: z.string().uuid(),
  category: z.string().min(1),
  name: z.string().min(1),
  price: z.number().min(1),
  stock: z.number().min(0),
  minStock: z.number().int(),
  sold: z.number().int(),
  image: z.string().min(1),
  brand: z.string().min(1).nullish(),
  type: z.string().min(1),
  description: z.string().min(1),
  nicotineLevel: z.string().nullish(),
  fluidLevel: z.string().nullish(),
  flavor: z.string().nullish(),
  cottonSize: z.string().nullish(),
  batterySize: z.string().nullish(),
  resistanceSize: z.string().nullish(),
  coilSize: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Product = z.infer<typeof ProductSchema>

/////////////////////////////////////////
// PRODUCT PARTIAL SCHEMA
/////////////////////////////////////////

export const ProductPartialSchema = ProductSchema.partial()

export type ProductPartial = z.infer<typeof ProductPartialSchema>

/////////////////////////////////////////
// PRODUCT OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const ProductOptionalDefaultsSchema = ProductSchema.merge(z.object({
  id: z.string().uuid().optional(),
  stock: z.number().min(0).optional(),
  minStock: z.number().int().optional(),
  sold: z.number().int().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type ProductOptionalDefaults = z.infer<typeof ProductOptionalDefaultsSchema>

/////////////////////////////////////////
// PRODUCT RELATION SCHEMA
/////////////////////////////////////////

export type ProductRelations = {
  PreOrders: PreOrderWithRelations[];
  SalesItems: SalesItemWithRelations[];
};

export type ProductWithRelations = z.infer<typeof ProductSchema> & ProductRelations

export const ProductWithRelationsSchema: z.ZodType<ProductWithRelations> = ProductSchema.merge(z.object({
  PreOrders: z.lazy(() => PreOrderWithRelationsSchema).array(),
  SalesItems: z.lazy(() => SalesItemWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// PRODUCT OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type ProductOptionalDefaultsRelations = {
  PreOrders: PreOrderOptionalDefaultsWithRelations[];
  SalesItems: SalesItemOptionalDefaultsWithRelations[];
};

export type ProductOptionalDefaultsWithRelations = z.infer<typeof ProductOptionalDefaultsSchema> & ProductOptionalDefaultsRelations

export const ProductOptionalDefaultsWithRelationsSchema: z.ZodType<ProductOptionalDefaultsWithRelations> = ProductOptionalDefaultsSchema.merge(z.object({
  PreOrders: z.lazy(() => PreOrderOptionalDefaultsWithRelationsSchema).array(),
  SalesItems: z.lazy(() => SalesItemOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// PRODUCT PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type ProductPartialRelations = {
  PreOrders?: PreOrderPartialWithRelations[];
  SalesItems?: SalesItemPartialWithRelations[];
};

export type ProductPartialWithRelations = z.infer<typeof ProductPartialSchema> & ProductPartialRelations

export const ProductPartialWithRelationsSchema: z.ZodType<ProductPartialWithRelations> = ProductPartialSchema.merge(z.object({
  PreOrders: z.lazy(() => PreOrderPartialWithRelationsSchema).array(),
  SalesItems: z.lazy(() => SalesItemPartialWithRelationsSchema).array(),
})).partial()

export type ProductOptionalDefaultsWithPartialRelations = z.infer<typeof ProductOptionalDefaultsSchema> & ProductPartialRelations

export const ProductOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ProductOptionalDefaultsWithPartialRelations> = ProductOptionalDefaultsSchema.merge(z.object({
  PreOrders: z.lazy(() => PreOrderPartialWithRelationsSchema).array(),
  SalesItems: z.lazy(() => SalesItemPartialWithRelationsSchema).array(),
}).partial())

export type ProductWithPartialRelations = z.infer<typeof ProductSchema> & ProductPartialRelations

export const ProductWithPartialRelationsSchema: z.ZodType<ProductWithPartialRelations> = ProductSchema.merge(z.object({
  PreOrders: z.lazy(() => PreOrderPartialWithRelationsSchema).array(),
  SalesItems: z.lazy(() => SalesItemPartialWithRelationsSchema).array(),
}).partial())

export default ProductSchema;
