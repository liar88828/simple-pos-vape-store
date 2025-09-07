import { z } from 'zod';
import { PreOrderWithRelationsSchema, PreOrderPartialWithRelationsSchema, PreOrderOptionalDefaultsWithRelationsSchema } from './PreOrderSchema'
import type { PreOrderWithRelations, PreOrderPartialWithRelations, PreOrderOptionalDefaultsWithRelations } from './PreOrderSchema'
import { UserWithRelationsSchema, UserPartialWithRelationsSchema, UserOptionalDefaultsWithRelationsSchema } from './UserSchema'
import type { UserWithRelations, UserPartialWithRelations, UserOptionalDefaultsWithRelations } from './UserSchema'
import { SaleWithRelationsSchema, SalePartialWithRelationsSchema, SaleOptionalDefaultsWithRelationsSchema } from './SaleSchema'
import type { SaleWithRelations, SalePartialWithRelations, SaleOptionalDefaultsWithRelations } from './SaleSchema'

/////////////////////////////////////////
// MARKET SCHEMA
/////////////////////////////////////////

export const MarketSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  location: z.string(),
  category: z.string(),
  open: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Market = z.infer<typeof MarketSchema>

/////////////////////////////////////////
// MARKET PARTIAL SCHEMA
/////////////////////////////////////////

export const MarketPartialSchema = MarketSchema.partial()

export type MarketPartial = z.infer<typeof MarketPartialSchema>

/////////////////////////////////////////
// MARKET OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const MarketOptionalDefaultsSchema = MarketSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type MarketOptionalDefaults = z.infer<typeof MarketOptionalDefaultsSchema>

/////////////////////////////////////////
// MARKET RELATION SCHEMA
/////////////////////////////////////////

export type MarketRelations = {
  PreOrder: PreOrderWithRelations[];
  Employees: UserWithRelations[];
  Sale: SaleWithRelations[];
};

export type MarketWithRelations = z.infer<typeof MarketSchema> & MarketRelations

export const MarketWithRelationsSchema: z.ZodType<MarketWithRelations> = MarketSchema.merge(z.object({
  PreOrder: z.lazy(() => PreOrderWithRelationsSchema).array(),
  Employees: z.lazy(() => UserWithRelationsSchema).array(),
  Sale: z.lazy(() => SaleWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// MARKET OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type MarketOptionalDefaultsRelations = {
  PreOrder: PreOrderOptionalDefaultsWithRelations[];
  Employees: UserOptionalDefaultsWithRelations[];
  Sale: SaleOptionalDefaultsWithRelations[];
};

export type MarketOptionalDefaultsWithRelations = z.infer<typeof MarketOptionalDefaultsSchema> & MarketOptionalDefaultsRelations

export const MarketOptionalDefaultsWithRelationsSchema: z.ZodType<MarketOptionalDefaultsWithRelations> = MarketOptionalDefaultsSchema.merge(z.object({
  PreOrder: z.lazy(() => PreOrderOptionalDefaultsWithRelationsSchema).array(),
  Employees: z.lazy(() => UserOptionalDefaultsWithRelationsSchema).array(),
  Sale: z.lazy(() => SaleOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// MARKET PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type MarketPartialRelations = {
  PreOrder?: PreOrderPartialWithRelations[];
  Employees?: UserPartialWithRelations[];
  Sale?: SalePartialWithRelations[];
};

export type MarketPartialWithRelations = z.infer<typeof MarketPartialSchema> & MarketPartialRelations

export const MarketPartialWithRelationsSchema: z.ZodType<MarketPartialWithRelations> = MarketPartialSchema.merge(z.object({
  PreOrder: z.lazy(() => PreOrderPartialWithRelationsSchema).array(),
  Employees: z.lazy(() => UserPartialWithRelationsSchema).array(),
  Sale: z.lazy(() => SalePartialWithRelationsSchema).array(),
})).partial()

export type MarketOptionalDefaultsWithPartialRelations = z.infer<typeof MarketOptionalDefaultsSchema> & MarketPartialRelations

export const MarketOptionalDefaultsWithPartialRelationsSchema: z.ZodType<MarketOptionalDefaultsWithPartialRelations> = MarketOptionalDefaultsSchema.merge(z.object({
  PreOrder: z.lazy(() => PreOrderPartialWithRelationsSchema).array(),
  Employees: z.lazy(() => UserPartialWithRelationsSchema).array(),
  Sale: z.lazy(() => SalePartialWithRelationsSchema).array(),
}).partial())

export type MarketWithPartialRelations = z.infer<typeof MarketSchema> & MarketPartialRelations

export const MarketWithPartialRelationsSchema: z.ZodType<MarketWithPartialRelations> = MarketSchema.merge(z.object({
  PreOrder: z.lazy(() => PreOrderPartialWithRelationsSchema).array(),
  Employees: z.lazy(() => UserPartialWithRelationsSchema).array(),
  Sale: z.lazy(() => SalePartialWithRelationsSchema).array(),
}).partial())

export default MarketSchema;
