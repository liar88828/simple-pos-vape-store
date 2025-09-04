import { z } from 'zod';

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

export default ShopSchema;
