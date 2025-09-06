import { z } from 'zod';
import { STATUS_PREORDERSchema } from '../inputTypeSchemas/STATUS_PREORDERSchema'
import {
    UserWithRelationsSchema,
    UserPartialWithRelationsSchema,
    UserOptionalDefaultsWithRelationsSchema
} from './UserSchema'
import type { UserWithRelations, UserPartialWithRelations, UserOptionalDefaultsWithRelations } from './UserSchema'
import {
    ProductWithRelationsSchema,
    ProductPartialWithRelationsSchema,
    ProductOptionalDefaultsWithRelationsSchema
} from './ProductSchema'
import type {
    ProductWithRelations,
    ProductPartialWithRelations,
    ProductOptionalDefaultsWithRelations
} from './ProductSchema'
import {
    ShopWithRelationsSchema,
    ShopPartialWithRelationsSchema,
    ShopOptionalDefaultsWithRelationsSchema
} from './ShopSchema'
import type { ShopWithRelations, ShopPartialWithRelations, ShopOptionalDefaultsWithRelations } from './ShopSchema'

/////////////////////////////////////////
// PRE ORDER SCHEMA
/////////////////////////////////////////

export const PreOrderSchema = z.object({
    status: STATUS_PREORDERSchema,
    id: z.string().uuid(),
  quantity: z.number().min(1),
    priceNormal: z.number().min(1),
    priceSell: z.number().min(1),
    estimatedDate: z.date().nullish(),
    expired: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
    userId: z.string(),
    productId: z.string(),
    sellIn_shopId: z.string(),
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
    id: z.string().uuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type PreOrderOptionalDefaults = z.infer<typeof PreOrderOptionalDefaultsSchema>

/////////////////////////////////////////
// PRE ORDER RELATION SCHEMA
/////////////////////////////////////////

export type PreOrderRelations = {
    User: UserWithRelations;
    Product: ProductWithRelations;
    Shop: ShopWithRelations;
};

export type PreOrderWithRelations = z.infer<typeof PreOrderSchema> & PreOrderRelations

export const PreOrderWithRelationsSchema: z.ZodType<PreOrderWithRelations> = PreOrderSchema.merge(z.object({
    User: z.lazy(() => UserWithRelationsSchema),
    Product: z.lazy(() => ProductWithRelationsSchema),
    Shop: z.lazy(() => ShopWithRelationsSchema),
}))

/////////////////////////////////////////
// PRE ORDER OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type PreOrderOptionalDefaultsRelations = {
    User: UserOptionalDefaultsWithRelations;
    Product: ProductOptionalDefaultsWithRelations;
    Shop: ShopOptionalDefaultsWithRelations;
};

export type PreOrderOptionalDefaultsWithRelations = z.infer<typeof PreOrderOptionalDefaultsSchema> & PreOrderOptionalDefaultsRelations

export const PreOrderOptionalDefaultsWithRelationsSchema: z.ZodType<PreOrderOptionalDefaultsWithRelations> = PreOrderOptionalDefaultsSchema.merge(z.object({
    User: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
    Product: z.lazy(() => ProductOptionalDefaultsWithRelationsSchema),
    Shop: z.lazy(() => ShopOptionalDefaultsWithRelationsSchema),
}))

/////////////////////////////////////////
// PRE ORDER PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type PreOrderPartialRelations = {
    User?: UserPartialWithRelations;
    Product?: ProductPartialWithRelations;
    Shop?: ShopPartialWithRelations;
};

export type PreOrderPartialWithRelations = z.infer<typeof PreOrderPartialSchema> & PreOrderPartialRelations

export const PreOrderPartialWithRelationsSchema: z.ZodType<PreOrderPartialWithRelations> = PreOrderPartialSchema.merge(z.object({
    User: z.lazy(() => UserPartialWithRelationsSchema),
    Product: z.lazy(() => ProductPartialWithRelationsSchema),
    Shop: z.lazy(() => ShopPartialWithRelationsSchema),
})).partial()

export type PreOrderOptionalDefaultsWithPartialRelations = z.infer<typeof PreOrderOptionalDefaultsSchema> & PreOrderPartialRelations

export const PreOrderOptionalDefaultsWithPartialRelationsSchema: z.ZodType<PreOrderOptionalDefaultsWithPartialRelations> = PreOrderOptionalDefaultsSchema.merge(z.object({
    User: z.lazy(() => UserPartialWithRelationsSchema),
    Product: z.lazy(() => ProductPartialWithRelationsSchema),
    Shop: z.lazy(() => ShopPartialWithRelationsSchema),
}).partial())

export type PreOrderWithPartialRelations = z.infer<typeof PreOrderSchema> & PreOrderPartialRelations

export const PreOrderWithPartialRelationsSchema: z.ZodType<PreOrderWithPartialRelations> = PreOrderSchema.merge(z.object({
    User: z.lazy(() => UserPartialWithRelationsSchema),
    Product: z.lazy(() => ProductPartialWithRelationsSchema),
    Shop: z.lazy(() => ShopPartialWithRelationsSchema),
}).partial())

export default PreOrderSchema;
