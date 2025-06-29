import * as z from "zod"

export const StoreModel = z.object({
    id: z.string(),
    name: z.string().min(1),
    currency: z.string().min(1),
    description: z.string().min(1),
    phone: z.string().min(1),
    address: z.string().min(1),
    email: z.string().email().min(1),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})
