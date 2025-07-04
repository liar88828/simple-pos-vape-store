import { z } from 'zod';

export const SalesItemScalarFieldEnumSchema = z.enum([ 'id', 'saleId', 'productId', 'quantity', 'priceAtBuy', 'createdAt', 'updatedAt' ]);

export default SalesItemScalarFieldEnumSchema;
