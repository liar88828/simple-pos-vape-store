import { z } from 'zod';

export const SalesItemScalarFieldEnumSchema = z.enum(['id','saleId','productId','quantity','price','createdAt','updatedAt']);

export default SalesItemScalarFieldEnumSchema;
