import { z } from 'zod';

export const SalesItemScalarFieldEnumSchema = z.enum(['id','quantity','priceAtBuy','createdAt','updatedAt','preorderId','productId','saleId']);

export default SalesItemScalarFieldEnumSchema;
