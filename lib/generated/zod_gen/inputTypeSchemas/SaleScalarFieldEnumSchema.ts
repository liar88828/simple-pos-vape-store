import { z } from 'zod';

export const SaleScalarFieldEnumSchema = z.enum(['id','date','total','items','customerId','statusTransaction','typeTransaction','createdAt','updatedAt']);

export default SaleScalarFieldEnumSchema;
