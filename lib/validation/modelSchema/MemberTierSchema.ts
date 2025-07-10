import { z } from 'zod';

/////////////////////////////////////////
// MEMBER TIER SCHEMA
/////////////////////////////////////////

export const MemberTierSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  range: z.string().min(1),
  progress: z.number().min(1),
  count: z.number().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type MemberTier = z.infer<typeof MemberTierSchema>

/////////////////////////////////////////
// MEMBER TIER PARTIAL SCHEMA
/////////////////////////////////////////

export const MemberTierPartialSchema = MemberTierSchema.partial()

export type MemberTierPartial = z.infer<typeof MemberTierPartialSchema>

/////////////////////////////////////////
// MEMBER TIER OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const MemberTierOptionalDefaultsSchema = MemberTierSchema.merge(z.object({
  id: z.number().int().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type MemberTierOptionalDefaults = z.infer<typeof MemberTierOptionalDefaultsSchema>

export default MemberTierSchema;
