import { z } from 'zod';
import { SalesItemWithRelationsSchema, SalesItemPartialWithRelationsSchema, SalesItemOptionalDefaultsWithRelationsSchema } from './SalesItemSchema'
import type { SalesItemWithRelations, SalesItemPartialWithRelations, SalesItemOptionalDefaultsWithRelations } from './SalesItemSchema'
import { UserWithRelationsSchema, UserPartialWithRelationsSchema, UserOptionalDefaultsWithRelationsSchema } from './UserSchema'
import type { UserWithRelations, UserPartialWithRelations, UserOptionalDefaultsWithRelations } from './UserSchema'
import { CustomerWithRelationsSchema, CustomerPartialWithRelationsSchema, CustomerOptionalDefaultsWithRelationsSchema } from './CustomerSchema'
import type { CustomerWithRelations, CustomerPartialWithRelations, CustomerOptionalDefaultsWithRelations } from './CustomerSchema'
import { MarketWithRelationsSchema, MarketPartialWithRelationsSchema, MarketOptionalDefaultsWithRelationsSchema } from './MarketSchema'
import type { MarketWithRelations, MarketPartialWithRelations, MarketOptionalDefaultsWithRelations } from './MarketSchema'
import { AbsentWithRelationsSchema, AbsentPartialWithRelationsSchema, AbsentOptionalDefaultsWithRelationsSchema } from './AbsentSchema'
import type { AbsentWithRelations, AbsentPartialWithRelations, AbsentOptionalDefaultsWithRelations } from './AbsentSchema'

/////////////////////////////////////////
// SALE SCHEMA
/////////////////////////////////////////

export const SaleSchema = z.object({
  id: z.string().uuid(),
  date_buy: z.date(),
  date_confirm: z.date().nullish(),
  total: z.number().min(1),
  items: z.number().min(1),
  statusTransaction: z.string().min(1),
  typeTransaction: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  seller_userId: z.string().nullish(),
  buyer_customerId: z.string(),
  marketId: z.string(),
  employee_absentId: z.number().int().nullish(),
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
  id: z.string().uuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type SaleOptionalDefaults = z.infer<typeof SaleOptionalDefaultsSchema>

/////////////////////////////////////////
// SALE RELATION SCHEMA
/////////////////////////////////////////

export type SaleRelations = {
  SaleItems: SalesItemWithRelations[];
  User?: UserWithRelations | null;
  Customer: CustomerWithRelations;
  Market: MarketWithRelations;
  Absent?: AbsentWithRelations | null;
};

export type SaleWithRelations = z.infer<typeof SaleSchema> & SaleRelations

export const SaleWithRelationsSchema: z.ZodType<SaleWithRelations> = SaleSchema.merge(z.object({
  SaleItems: z.lazy(() => SalesItemWithRelationsSchema).array(),
  User: z.lazy(() => UserWithRelationsSchema).nullish(),
  Customer: z.lazy(() => CustomerWithRelationsSchema),
  Market: z.lazy(() => MarketWithRelationsSchema),
  Absent: z.lazy(() => AbsentWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// SALE OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type SaleOptionalDefaultsRelations = {
  SaleItems: SalesItemOptionalDefaultsWithRelations[];
  User?: UserOptionalDefaultsWithRelations | null;
  Customer: CustomerOptionalDefaultsWithRelations;
  Market: MarketOptionalDefaultsWithRelations;
  Absent?: AbsentOptionalDefaultsWithRelations | null;
};

export type SaleOptionalDefaultsWithRelations = z.infer<typeof SaleOptionalDefaultsSchema> & SaleOptionalDefaultsRelations

export const SaleOptionalDefaultsWithRelationsSchema: z.ZodType<SaleOptionalDefaultsWithRelations> = SaleOptionalDefaultsSchema.merge(z.object({
  SaleItems: z.lazy(() => SalesItemOptionalDefaultsWithRelationsSchema).array(),
  User: z.lazy(() => UserOptionalDefaultsWithRelationsSchema).nullish(),
  Customer: z.lazy(() => CustomerOptionalDefaultsWithRelationsSchema),
  Market: z.lazy(() => MarketOptionalDefaultsWithRelationsSchema),
  Absent: z.lazy(() => AbsentOptionalDefaultsWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// SALE PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type SalePartialRelations = {
  SaleItems?: SalesItemPartialWithRelations[];
  User?: UserPartialWithRelations | null;
  Customer?: CustomerPartialWithRelations;
  Market?: MarketPartialWithRelations;
  Absent?: AbsentPartialWithRelations | null;
};

export type SalePartialWithRelations = z.infer<typeof SalePartialSchema> & SalePartialRelations

export const SalePartialWithRelationsSchema: z.ZodType<SalePartialWithRelations> = SalePartialSchema.merge(z.object({
  SaleItems: z.lazy(() => SalesItemPartialWithRelationsSchema).array(),
  User: z.lazy(() => UserPartialWithRelationsSchema).nullish(),
  Customer: z.lazy(() => CustomerPartialWithRelationsSchema),
  Market: z.lazy(() => MarketPartialWithRelationsSchema),
  Absent: z.lazy(() => AbsentPartialWithRelationsSchema).nullish(),
})).partial()

export type SaleOptionalDefaultsWithPartialRelations = z.infer<typeof SaleOptionalDefaultsSchema> & SalePartialRelations

export const SaleOptionalDefaultsWithPartialRelationsSchema: z.ZodType<SaleOptionalDefaultsWithPartialRelations> = SaleOptionalDefaultsSchema.merge(z.object({
  SaleItems: z.lazy(() => SalesItemPartialWithRelationsSchema).array(),
  User: z.lazy(() => UserPartialWithRelationsSchema).nullish(),
  Customer: z.lazy(() => CustomerPartialWithRelationsSchema),
  Market: z.lazy(() => MarketPartialWithRelationsSchema),
  Absent: z.lazy(() => AbsentPartialWithRelationsSchema).nullish(),
}).partial())

export type SaleWithPartialRelations = z.infer<typeof SaleSchema> & SalePartialRelations

export const SaleWithPartialRelationsSchema: z.ZodType<SaleWithPartialRelations> = SaleSchema.merge(z.object({
  SaleItems: z.lazy(() => SalesItemPartialWithRelationsSchema).array(),
  User: z.lazy(() => UserPartialWithRelationsSchema).nullish(),
  Customer: z.lazy(() => CustomerPartialWithRelationsSchema),
  Market: z.lazy(() => MarketPartialWithRelationsSchema),
  Absent: z.lazy(() => AbsentPartialWithRelationsSchema).nullish(),
}).partial())

export default SaleSchema;
