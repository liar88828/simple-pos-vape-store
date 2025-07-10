import { z } from 'zod';

export const CustomerScalarFieldEnumSchema = z.enum(['id','name','age','totalPurchase','status','lastPurchase','createdAt','updatedAt']);

export default CustomerScalarFieldEnumSchema;
