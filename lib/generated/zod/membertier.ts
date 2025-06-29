import * as z from "zod"

export const MemberTierModel = z.object({
    id: z.number().int(),
    name: z.string().min(1),
    range: z.string().min(1),
    progress: z.number().int().min(1),
    count: z.number().int().min(1),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})
