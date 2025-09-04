import { z } from 'zod';

export const InventorySettingScalarFieldEnumSchema = z.enum([ 'id', 'trackInventory', 'lowStockThreshold', 'allowBackorders', 'autoReorder' ]);

export default InventorySettingScalarFieldEnumSchema;
