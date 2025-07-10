import { z } from 'zod';

export const InventoryScalarFieldEnumSchema = z.enum(['id','trackInventory','lowStockThreshold','allowBackorders','autoReorder']);

export default InventoryScalarFieldEnumSchema;
