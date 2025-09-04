import { z } from 'zod';

/////////////////////////////////////////
// INVENTORY SETTING SCHEMA
/////////////////////////////////////////

export const InventorySettingSchema = z.object({
    id: z.string().uuid(),
    trackInventory: z.boolean(),
    lowStockThreshold: z.number().min(0),
    allowBackorders: z.boolean(),
    autoReorder: z.boolean(),
})

export type InventorySetting = z.infer<typeof InventorySettingSchema>

/////////////////////////////////////////
// INVENTORY SETTING PARTIAL SCHEMA
/////////////////////////////////////////

export const InventorySettingPartialSchema = InventorySettingSchema.partial()

export type InventorySettingPartial = z.infer<typeof InventorySettingPartialSchema>

/////////////////////////////////////////
// INVENTORY SETTING OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const InventorySettingOptionalDefaultsSchema = InventorySettingSchema.merge(z.object({
    id: z.string().uuid().optional(),
}))

export type InventorySettingOptionalDefaults = z.infer<typeof InventorySettingOptionalDefaultsSchema>

export default InventorySettingSchema;
