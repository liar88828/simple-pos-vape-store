import { z } from 'zod';
import type { SaleOptionalDefaultsWithRelations, SalePartialWithRelations, SaleWithRelations } from './SaleSchema'
import {
    SaleOptionalDefaultsWithRelationsSchema,
    SalePartialWithRelationsSchema,
    SaleWithRelationsSchema
} from './SaleSchema'

/////////////////////////////////////////
// CUSTOMER SCHEMA
/////////////////////////////////////////

export const CustomerSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  age: z.number().max(80),
  totalPurchase: z.number().min(0),
  status: z.string().min(1),
  lastPurchase: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Customer = z.infer<typeof CustomerSchema>

/////////////////////////////////////////
// CUSTOMER PARTIAL SCHEMA
/////////////////////////////////////////

export const CustomerPartialSchema = CustomerSchema.partial()

export type CustomerPartial = z.infer<typeof CustomerPartialSchema>

/////////////////////////////////////////
// CUSTOMER OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const CustomerOptionalDefaultsSchema = CustomerSchema.merge(z.object({
  id: z.number().int().optional(),
  age: z.number().max(80).optional(),
  totalPurchase: z.number().min(0).optional(),
  status: z.string().min(1).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type CustomerOptionalDefaults = z.infer<typeof CustomerOptionalDefaultsSchema>

/////////////////////////////////////////
// CUSTOMER RELATION SCHEMA
/////////////////////////////////////////

export type CustomerRelations = {
  Sales: SaleWithRelations[];
};

export type CustomerWithRelations = z.infer<typeof CustomerSchema> & CustomerRelations

export const CustomerWithRelationsSchema: z.ZodType<CustomerWithRelations> = CustomerSchema.merge(z.object({
  Sales: z.lazy(() => SaleWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// CUSTOMER OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type CustomerOptionalDefaultsRelations = {
  Sales: SaleOptionalDefaultsWithRelations[];
};

export type CustomerOptionalDefaultsWithRelations = z.infer<typeof CustomerOptionalDefaultsSchema> & CustomerOptionalDefaultsRelations

export const CustomerOptionalDefaultsWithRelationsSchema: z.ZodType<CustomerOptionalDefaultsWithRelations> = CustomerOptionalDefaultsSchema.merge(z.object({
  Sales: z.lazy(() => SaleOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// CUSTOMER PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type CustomerPartialRelations = {
  Sales?: SalePartialWithRelations[];
};

export type CustomerPartialWithRelations = z.infer<typeof CustomerPartialSchema> & CustomerPartialRelations

export const CustomerPartialWithRelationsSchema: z.ZodType<CustomerPartialWithRelations> = CustomerPartialSchema.merge(z.object({
  Sales: z.lazy(() => SalePartialWithRelationsSchema).array(),
})).partial()

export type CustomerOptionalDefaultsWithPartialRelations = z.infer<typeof CustomerOptionalDefaultsSchema> & CustomerPartialRelations

export const CustomerOptionalDefaultsWithPartialRelationsSchema: z.ZodType<CustomerOptionalDefaultsWithPartialRelations> = CustomerOptionalDefaultsSchema.merge(z.object({
  Sales: z.lazy(() => SalePartialWithRelationsSchema).array(),
}).partial())

export type CustomerWithPartialRelations = z.infer<typeof CustomerSchema> & CustomerPartialRelations

export const CustomerWithPartialRelationsSchema: z.ZodType<CustomerWithPartialRelations> = CustomerSchema.merge(z.object({
  Sales: z.lazy(() => SalePartialWithRelationsSchema).array(),
}).partial())

export default CustomerSchema;
