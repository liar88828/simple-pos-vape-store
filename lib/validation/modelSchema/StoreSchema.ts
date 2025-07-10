import { z } from 'zod';

/////////////////////////////////////////
// STORE SCHEMA
/////////////////////////////////////////

export const StoreSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  currency: z.string().min(1),
  description: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  email: z.string().email().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Store = z.infer<typeof StoreSchema>

/////////////////////////////////////////
// STORE PARTIAL SCHEMA
/////////////////////////////////////////

export const StorePartialSchema = StoreSchema.partial()

export type StorePartial = z.infer<typeof StorePartialSchema>

/////////////////////////////////////////
// STORE OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const StoreOptionalDefaultsSchema = StoreSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type StoreOptionalDefaults = z.infer<typeof StoreOptionalDefaultsSchema>

export default StoreSchema;
