import { z } from 'zod';

export const StoreScalarFieldEnumSchema = z.enum(['id','name','currency','description','phone','address','email','createdAt','updatedAt']);

export default StoreScalarFieldEnumSchema;
