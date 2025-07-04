import * as z from "zod";

export const CustomerModelNew = z.object({
    name: z.string().min(1),
})

export type CustomerModelType = z.infer<typeof CustomerModelNew>
