import { z } from 'zod';
import type {
    ProductOptionalDefaultsWithRelations,
    ProductPartialWithRelations,
    ProductWithRelations
} from './ProductSchema'
import {
    ProductOptionalDefaultsWithRelationsSchema,
    ProductPartialWithRelationsSchema,
    ProductWithRelationsSchema
} from './ProductSchema'

/////////////////////////////////////////
// PRE ORDER SCHEMA
/////////////////////////////////////////

export const PreOrderSchema = z.object({
  id: z.number().int(),
  productId: z.number().int(),
  quantity: z.number().min(1),
  estimatedDate: z.date(),
    /**
     * //Pending, Terima
     */
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
  product: ProductWithRelations;
};

export type PreOrderWithRelations = z.infer<typeof PreOrderSchema> & PreOrderRelations

export const PreOrderWithRelationsSchema: z.ZodType<PreOrderWithRelations> = PreOrderSchema.merge(z.object({
  product: z.lazy(() => ProductWithRelationsSchema),
}))

/////////////////////////////////////////
// PRE ORDER OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type PreOrderOptionalDefaultsRelations = {
  product: ProductOptionalDefaultsWithRelations;
};

export type PreOrderOptionalDefaultsWithRelations = z.infer<typeof PreOrderOptionalDefaultsSchema> & PreOrderOptionalDefaultsRelations

export const PreOrderOptionalDefaultsWithRelationsSchema: z.ZodType<PreOrderOptionalDefaultsWithRelations> = PreOrderOptionalDefaultsSchema.merge(z.object({
  product: z.lazy(() => ProductOptionalDefaultsWithRelationsSchema),
}))

/////////////////////////////////////////
// PRE ORDER PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type PreOrderPartialRelations = {
  product?: ProductPartialWithRelations;
};

export type PreOrderPartialWithRelations = z.infer<typeof PreOrderPartialSchema> & PreOrderPartialRelations

export const PreOrderPartialWithRelationsSchema: z.ZodType<PreOrderPartialWithRelations> = PreOrderPartialSchema.merge(z.object({
  product: z.lazy(() => ProductPartialWithRelationsSchema),
})).partial()

export type PreOrderOptionalDefaultsWithPartialRelations = z.infer<typeof PreOrderOptionalDefaultsSchema> & PreOrderPartialRelations

export const PreOrderOptionalDefaultsWithPartialRelationsSchema: z.ZodType<PreOrderOptionalDefaultsWithPartialRelations> = PreOrderOptionalDefaultsSchema.merge(z.object({
  product: z.lazy(() => ProductPartialWithRelationsSchema),
}).partial())

export type PreOrderWithPartialRelations = z.infer<typeof PreOrderSchema> & PreOrderPartialRelations

export const PreOrderWithPartialRelationsSchema: z.ZodType<PreOrderWithPartialRelations> = PreOrderSchema.merge(z.object({
  product: z.lazy(() => ProductPartialWithRelationsSchema),
}).partial())

export default PreOrderSchema;
