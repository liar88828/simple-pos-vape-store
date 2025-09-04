import { z } from 'zod';

export const ShopScalarFieldEnumSchema = z.enum([ 'id', 'name', 'location', 'category', 'open', 'createdAt', 'updatedAt' ]);

export default ShopScalarFieldEnumSchema;
