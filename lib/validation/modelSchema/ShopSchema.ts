import { z } from 'zod';
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
    UserWithRelationsSchema,
    UserPartialWithRelationsSchema,
    UserOptionalDefaultsWithRelationsSchema
} from './UserSchema'
import type { UserWithRelations, UserPartialWithRelations, UserOptionalDefaultsWithRelations } from './UserSchema'
import {
    SaleWithRelationsSchema,
    SalePartialWithRelationsSchema,
    SaleOptionalDefaultsWithRelationsSchema
} from './SaleSchema'
import type { SaleWithRelations, SalePartialWithRelations, SaleOptionalDefaultsWithRelations } from './SaleSchema'

/////////////////////////////////////////
// SHOP SCHEMA
/////////////////////////////////////////

export const ShopSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    location: z.string(),
    category: z.string(),
    open: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type Shop = z.infer<typeof ShopSchema>

/////////////////////////////////////////
// SHOP PARTIAL SCHEMA
/////////////////////////////////////////

export const ShopPartialSchema = ShopSchema.partial()

export type ShopPartial = z.infer<typeof ShopPartialSchema>

/////////////////////////////////////////
// SHOP OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const ShopOptionalDefaultsSchema = ShopSchema.merge(z.object({
    id: z.string().uuid().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
}))

export type ShopOptionalDefaults = z.infer<typeof ShopOptionalDefaultsSchema>

/////////////////////////////////////////
// SHOP RELATION SCHEMA
/////////////////////////////////////////

export type ShopRelations = {
    PreOrder: PreOrderWithRelations[];
    Employees: UserWithRelations[];
    Sale: SaleWithRelations[];
};

export type ShopWithRelations = z.infer<typeof ShopSchema> & ShopRelations

export const ShopWithRelationsSchema: z.ZodType<ShopWithRelations> = ShopSchema.merge(z.object({
    PreOrder: z.lazy(() => PreOrderWithRelationsSchema).array(),
    Employees: z.lazy(() => UserWithRelationsSchema).array(),
    Sale: z.lazy(() => SaleWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SHOP OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type ShopOptionalDefaultsRelations = {
    PreOrder: PreOrderOptionalDefaultsWithRelations[];
    Employees: UserOptionalDefaultsWithRelations[];
    Sale: SaleOptionalDefaultsWithRelations[];
};

export type ShopOptionalDefaultsWithRelations =
    z.infer<typeof ShopOptionalDefaultsSchema>
    & ShopOptionalDefaultsRelations

export const ShopOptionalDefaultsWithRelationsSchema: z.ZodType<ShopOptionalDefaultsWithRelations> = ShopOptionalDefaultsSchema.merge(z.object({
    PreOrder: z.lazy(() => PreOrderOptionalDefaultsWithRelationsSchema).array(),
    Employees: z.lazy(() => UserOptionalDefaultsWithRelationsSchema).array(),
    Sale: z.lazy(() => SaleOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SHOP PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type ShopPartialRelations = {
    PreOrder?: PreOrderPartialWithRelations[];
    Employees?: UserPartialWithRelations[];
    Sale?: SalePartialWithRelations[];
};

export type ShopPartialWithRelations = z.infer<typeof ShopPartialSchema> & ShopPartialRelations

export const ShopPartialWithRelationsSchema: z.ZodType<ShopPartialWithRelations> = ShopPartialSchema.merge(z.object({
    PreOrder: z.lazy(() => PreOrderPartialWithRelationsSchema).array(),
    Employees: z.lazy(() => UserPartialWithRelationsSchema).array(),
    Sale: z.lazy(() => SalePartialWithRelationsSchema).array(),
})).partial()

export type ShopOptionalDefaultsWithPartialRelations = z.infer<typeof ShopOptionalDefaultsSchema> & ShopPartialRelations

export const ShopOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ShopOptionalDefaultsWithPartialRelations> = ShopOptionalDefaultsSchema.merge(z.object({
    PreOrder: z.lazy(() => PreOrderPartialWithRelationsSchema).array(),
    Employees: z.lazy(() => UserPartialWithRelationsSchema).array(),
    Sale: z.lazy(() => SalePartialWithRelationsSchema).array(),
}).partial())

export type ShopWithPartialRelations = z.infer<typeof ShopSchema> & ShopPartialRelations

export const ShopWithPartialRelationsSchema: z.ZodType<ShopWithPartialRelations> = ShopSchema.merge(z.object({
    PreOrder: z.lazy(() => PreOrderPartialWithRelationsSchema).array(),
    Employees: z.lazy(() => UserPartialWithRelationsSchema).array(),
    Sale: z.lazy(() => SalePartialWithRelationsSchema).array(),
}).partial())

export default ShopSchema;
