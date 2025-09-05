import { z } from 'zod';
import {
    CustomerWithRelationsSchema,
    CustomerPartialWithRelationsSchema,
    CustomerOptionalDefaultsWithRelationsSchema
} from './CustomerSchema'
import type {
    CustomerWithRelations,
    CustomerPartialWithRelations,
    CustomerOptionalDefaultsWithRelations
} from './CustomerSchema'
import {
    SaleWithRelationsSchema,
    SalePartialWithRelationsSchema,
    SaleOptionalDefaultsWithRelationsSchema
} from './SaleSchema'
import type { SaleWithRelations, SalePartialWithRelations, SaleOptionalDefaultsWithRelations } from './SaleSchema'
import {
    PreOrderWithRelationsSchema,
    PreOrderPartialWithRelationsSchema,
    PreOrderOptionalDefaultsWithRelationsSchema
} from './PreOrderSchema'
import type {
    PreOrderWithRelations,
    PreOrderPartialWithRelations,
    PreOrderOptionalDefaultsWithRelations
} from './PreOrderSchema'
import {
    ShopWithRelationsSchema,
    ShopPartialWithRelationsSchema,
    ShopOptionalDefaultsWithRelationsSchema
} from './ShopSchema'
import type { ShopWithRelations, ShopPartialWithRelations, ShopOptionalDefaultsWithRelations } from './ShopSchema'

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string(),
  password: z.string().min(1),
  role: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
    phone: z.string().nullish(),
    address: z.string().nullish(),
    img: z.string().nullish(),
    active: z.boolean(),
    workIn_shopId: z.string().nullish(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER PARTIAL SCHEMA
/////////////////////////////////////////

export const UserPartialSchema = UserSchema.partial()

export type UserPartial = z.infer<typeof UserPartialSchema>

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const UserOptionalDefaultsSchema = UserSchema.merge(z.object({
  id: z.string().uuid().optional(),
  role: z.string().min(1).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
    active: z.boolean().optional(),
}))

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>

/////////////////////////////////////////
// USER RELATION SCHEMA
/////////////////////////////////////////

export type UserRelations = {
    Customer?: CustomerWithRelations | null;
    Sale: SaleWithRelations[];
    PreOrder: PreOrderWithRelations[];
    Shop?: ShopWithRelations | null;
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
    Customer: z.lazy(() => CustomerWithRelationsSchema).nullish(),
    Sale: z.lazy(() => SaleWithRelationsSchema).array(),
    PreOrder: z.lazy(() => PreOrderWithRelationsSchema).array(),
    Shop: z.lazy(() => ShopWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type UserOptionalDefaultsRelations = {
    Customer?: CustomerOptionalDefaultsWithRelations | null;
    Sale: SaleOptionalDefaultsWithRelations[];
    PreOrder: PreOrderOptionalDefaultsWithRelations[];
    Shop?: ShopOptionalDefaultsWithRelations | null;
};

export type UserOptionalDefaultsWithRelations =
    z.infer<typeof UserOptionalDefaultsSchema>
    & UserOptionalDefaultsRelations

export const UserOptionalDefaultsWithRelationsSchema: z.ZodType<UserOptionalDefaultsWithRelations> = UserOptionalDefaultsSchema.merge(z.object({
    Customer: z.lazy(() => CustomerOptionalDefaultsWithRelationsSchema).nullish(),
    Sale: z.lazy(() => SaleOptionalDefaultsWithRelationsSchema).array(),
    PreOrder: z.lazy(() => PreOrderOptionalDefaultsWithRelationsSchema).array(),
    Shop: z.lazy(() => ShopOptionalDefaultsWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// USER PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type UserPartialRelations = {
    Customer?: CustomerPartialWithRelations | null;
    Sale?: SalePartialWithRelations[];
    PreOrder?: PreOrderPartialWithRelations[];
    Shop?: ShopPartialWithRelations | null;
};

export type UserPartialWithRelations = z.infer<typeof UserPartialSchema> & UserPartialRelations

export const UserPartialWithRelationsSchema: z.ZodType<UserPartialWithRelations> = UserPartialSchema.merge(z.object({
    Customer: z.lazy(() => CustomerPartialWithRelationsSchema).nullish(),
    Sale: z.lazy(() => SalePartialWithRelationsSchema).array(),
    PreOrder: z.lazy(() => PreOrderPartialWithRelationsSchema).array(),
    Shop: z.lazy(() => ShopPartialWithRelationsSchema).nullish(),
})).partial()

export type UserOptionalDefaultsWithPartialRelations = z.infer<typeof UserOptionalDefaultsSchema> & UserPartialRelations

export const UserOptionalDefaultsWithPartialRelationsSchema: z.ZodType<UserOptionalDefaultsWithPartialRelations> = UserOptionalDefaultsSchema.merge(z.object({
    Customer: z.lazy(() => CustomerPartialWithRelationsSchema).nullish(),
    Sale: z.lazy(() => SalePartialWithRelationsSchema).array(),
    PreOrder: z.lazy(() => PreOrderPartialWithRelationsSchema).array(),
    Shop: z.lazy(() => ShopPartialWithRelationsSchema).nullish(),
}).partial())

export type UserWithPartialRelations = z.infer<typeof UserSchema> & UserPartialRelations

export const UserWithPartialRelationsSchema: z.ZodType<UserWithPartialRelations> = UserSchema.merge(z.object({
    Customer: z.lazy(() => CustomerPartialWithRelationsSchema).nullish(),
    Sale: z.lazy(() => SalePartialWithRelationsSchema).array(),
    PreOrder: z.lazy(() => PreOrderPartialWithRelationsSchema).array(),
    Shop: z.lazy(() => ShopPartialWithRelationsSchema).nullish(),
}).partial())

export default UserSchema;
