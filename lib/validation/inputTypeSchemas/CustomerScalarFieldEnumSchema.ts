import { z } from 'zod';

export const CustomerScalarFieldEnumSchema = z.enum(['id','name','age','totalPurchase','status','lastPurchase','createdAt','updatedAt','buyer_userId']);

export default CustomerScalarFieldEnumSchema;
