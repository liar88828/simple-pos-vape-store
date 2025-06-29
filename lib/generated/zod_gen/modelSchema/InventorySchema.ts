import { z } from 'zod';

/////////////////////////////////////////
// INVENTORY SCHEMA
/////////////////////////////////////////

export const InventorySchema = z.object({
  id: z.string().uuid(),
  trackInventory: z.boolean(),
  lowStockThreshold: z.number().min(0),
  allowBackorders: z.boolean(),
  autoReorder: z.boolean(),
})

export type Inventory = z.infer<typeof InventorySchema>

/////////////////////////////////////////
// INVENTORY PARTIAL SCHEMA
/////////////////////////////////////////

export const InventoryPartialSchema = InventorySchema.partial()

export type InventoryPartial = z.infer<typeof InventoryPartialSchema>

/////////////////////////////////////////
// INVENTORY OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const InventoryOptionalDefaultsSchema = InventorySchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type InventoryOptionalDefaults = z.infer<typeof InventoryOptionalDefaultsSchema>

export default InventorySchema;
