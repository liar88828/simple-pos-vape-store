import * as z from "zod"

export const UserModel = z.object({
    id: z.string(),
    name: z.string().min(1),
    email: z.string().email().min(1),
    password: z.string().min(1),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})
