import * as z from "zod"

export const InventoryModel = z.object({
    id: z.string(),
    trackInventory: z.boolean(),
    lowStockThreshold: z.number().int().min(0),
    allowBackorders: z.boolean(),
    autoReorder: z.boolean(),
})
