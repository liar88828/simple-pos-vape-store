import { z } from 'zod';
import { CustomerWithRelationsSchema, CustomerPartialWithRelationsSchema, CustomerOptionalDefaultsWithRelationsSchema } from './CustomerSchema'
import type { CustomerWithRelations, CustomerPartialWithRelations, CustomerOptionalDefaultsWithRelations } from './CustomerSchema'
import { ProductWithRelationsSchema, ProductPartialWithRelationsSchema, ProductOptionalDefaultsWithRelationsSchema } from './ProductSchema'
import type { ProductWithRelations, ProductPartialWithRelations, ProductOptionalDefaultsWithRelations } from './ProductSchema'

/////////////////////////////////////////
// PRE ORDER SCHEMA
/////////////////////////////////////////

export const PreOrderSchema = z.object({
  id: z.number().int(),
  customerId: z.number().int(),
  productId: z.number().int(),
  quantity: z.number().min(1),
  estimatedDate: z.date(),
  status: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type PreOrder = z.infer<typeof PreOrderSchema>

/////////////////////////////////////////
// PRE ORDER PARTIAL SCHEMA
/////////////////////////////////////////

export const PreOrderPartialSchema = PreOrderSchema.partial()

export type PreOrderPartial = z.infer<typeof PreOrderPartialSchema>

/////////////////////////////////////////
// PRE ORDER OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const PreOrderOptionalDefaultsSchema = PreOrderSchema.merge(z.object({
  id: z.number().int().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type PreOrderOptionalDefaults = z.infer<typeof PreOrderOptionalDefaultsSchema>

/////////////////////////////////////////
// PRE ORDER RELATION SCHEMA
/////////////////////////////////////////

export type PreOrderRelations = {
  customer: CustomerWithRelations;
  product: ProductWithRelations;
};

export type PreOrderWithRelations = z.infer<typeof PreOrderSchema> & PreOrderRelations

export const PreOrderWithRelationsSchema: z.ZodType<PreOrderWithRelations> = PreOrderSchema.merge(z.object({
  customer: z.lazy(() => CustomerWithRelationsSchema),
  product: z.lazy(() => ProductWithRelationsSchema),
}))

/////////////////////////////////////////
// PRE ORDER OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type PreOrderOptionalDefaultsRelations = {
  customer: CustomerOptionalDefaultsWithRelations;
  product: ProductOptionalDefaultsWithRelations;
};

export type PreOrderOptionalDefaultsWithRelations = z.infer<typeof PreOrderOptionalDefaultsSchema> & PreOrderOptionalDefaultsRelations

export const PreOrderOptionalDefaultsWithRelationsSchema: z.ZodType<PreOrderOptionalDefaultsWithRelations> = PreOrderOptionalDefaultsSchema.merge(z.object({
  customer: z.lazy(() => CustomerOptionalDefaultsWithRelationsSchema),
  product: z.lazy(() => ProductOptionalDefaultsWithRelationsSchema),
}))

/////////////////////////////////////////
// PRE ORDER PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type PreOrderPartialRelations = {
  customer?: CustomerPartialWithRelations;
  product?: ProductPartialWithRelations;
};

export type PreOrderPartialWithRelations = z.infer<typeof PreOrderPartialSchema> & PreOrderPartialRelations

export const PreOrderPartialWithRelationsSchema: z.ZodType<PreOrderPartialWithRelations> = PreOrderPartialSchema.merge(z.object({
  customer: z.lazy(() => CustomerPartialWithRelationsSchema),
  product: z.lazy(() => ProductPartialWithRelationsSchema),
})).partial()

export type PreOrderOptionalDefaultsWithPartialRelations = z.infer<typeof PreOrderOptionalDefaultsSchema> & PreOrderPartialRelations

export const PreOrderOptionalDefaultsWithPartialRelationsSchema: z.ZodType<PreOrderOptionalDefaultsWithPartialRelations> = PreOrderOptionalDefaultsSchema.merge(z.object({
  customer: z.lazy(() => CustomerPartialWithRelationsSchema),
  product: z.lazy(() => ProductPartialWithRelationsSchema),
}).partial())

export type PreOrderWithPartialRelations = z.infer<typeof PreOrderSchema> & PreOrderPartialRelations

export const PreOrderWithPartialRelationsSchema: z.ZodType<PreOrderWithPartialRelations> = PreOrderSchema.merge(z.object({
  customer: z.lazy(() => CustomerPartialWithRelationsSchema),
  product: z.lazy(() => ProductPartialWithRelationsSchema),
}).partial())

export default PreOrderSchema;
