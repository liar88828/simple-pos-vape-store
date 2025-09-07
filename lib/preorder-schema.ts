import { PreOrderOptionalDefaultsSchema } from "@/lib/validation";
import { z } from "zod";

export const preOrderForm = PreOrderOptionalDefaultsSchema.merge(z.object({
        userId: z.string().optional(),
        // marketId_sellIn: z.string().optional(),
        market_name: z.string().optional(),
    }
))

export type PreOrderForm = z.infer<typeof preOrderForm>