import { z } from 'zod';
import type {
    CustomerOptionalDefaultsWithRelations,
    CustomerPartialWithRelations,
    CustomerWithRelations
} from './CustomerSchema'
import {
    CustomerOptionalDefaultsWithRelationsSchema,
    CustomerPartialWithRelationsSchema,
    CustomerWithRelationsSchema
} from './CustomerSchema'
import type {
    SalesItemOptionalDefaultsWithRelations,
    SalesItemPartialWithRelations,
    SalesItemWithRelations
} from './SalesItemSchema'
import {
    SalesItemOptionalDefaultsWithRelationsSchema,
    SalesItemPartialWithRelationsSchema,
    SalesItemWithRelationsSchema
} from './SalesItemSchema'

/////////////////////////////////////////
// SALE SCHEMA
/////////////////////////////////////////

export const SaleSchema = z.object({
  id: z.number().int(),
  date: z.date(),
  total: z.number().min(1),
  items: z.number().min(1),
  customerId: z.number().int(),
  statusTransaction: z.string().min(1),
  typeTransaction: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Sale = z.infer<typeof SaleSchema>

/////////////////////////////////////////
// SALE PARTIAL SCHEMA
/////////////////////////////////////////

export const SalePartialSchema = SaleSchema.partial()

export type SalePartial = z.infer<typeof SalePartialSchema>

/////////////////////////////////////////
// SALE OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const SaleOptionalDefaultsSchema = SaleSchema.merge(z.object({
  id: z.number().int().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type SaleOptionalDefaults = z.infer<typeof SaleOptionalDefaultsSchema>

/////////////////////////////////////////
// SALE RELATION SCHEMA
/////////////////////////////////////////

export type SaleRelations = {
  customer: CustomerWithRelations;
  SaleItems: SalesItemWithRelations[];
};

export type SaleWithRelations = z.infer<typeof SaleSchema> & SaleRelations

export const SaleWithRelationsSchema: z.ZodType<SaleWithRelations> = SaleSchema.merge(z.object({
  customer: z.lazy(() => CustomerWithRelationsSchema),
  SaleItems: z.lazy(() => SalesItemWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SALE OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type SaleOptionalDefaultsRelations = {
  customer: CustomerOptionalDefaultsWithRelations;
  SaleItems: SalesItemOptionalDefaultsWithRelations[];
};

export type SaleOptionalDefaultsWithRelations = z.infer<typeof SaleOptionalDefaultsSchema> & SaleOptionalDefaultsRelations

export const SaleOptionalDefaultsWithRelationsSchema: z.ZodType<SaleOptionalDefaultsWithRelations> = SaleOptionalDefaultsSchema.merge(z.object({
  customer: z.lazy(() => CustomerOptionalDefaultsWithRelationsSchema),
  SaleItems: z.lazy(() => SalesItemOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SALE PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type SalePartialRelations = {
  customer?: CustomerPartialWithRelations;
  SaleItems?: SalesItemPartialWithRelations[];
};

export type SalePartialWithRelations = z.infer<typeof SalePartialSchema> & SalePartialRelations

export const SalePartialWithRelationsSchema: z.ZodType<SalePartialWithRelations> = SalePartialSchema.merge(z.object({
  customer: z.lazy(() => CustomerPartialWithRelationsSchema),
  SaleItems: z.lazy(() => SalesItemPartialWithRelationsSchema).array(),
})).partial()

export type SaleOptionalDefaultsWithPartialRelations = z.infer<typeof SaleOptionalDefaultsSchema> & SalePartialRelations

export const SaleOptionalDefaultsWithPartialRelationsSchema: z.ZodType<SaleOptionalDefaultsWithPartialRelations> = SaleOptionalDefaultsSchema.merge(z.object({
  customer: z.lazy(() => CustomerPartialWithRelationsSchema),
  SaleItems: z.lazy(() => SalesItemPartialWithRelationsSchema).array(),
}).partial())

export type SaleWithPartialRelations = z.infer<typeof SaleSchema> & SalePartialRelations

export const SaleWithPartialRelationsSchema: z.ZodType<SaleWithPartialRelations> = SaleSchema.merge(z.object({
  customer: z.lazy(() => CustomerPartialWithRelationsSchema),
  SaleItems: z.lazy(() => SalesItemPartialWithRelationsSchema).array(),
}).partial())

export default SaleSchema;
