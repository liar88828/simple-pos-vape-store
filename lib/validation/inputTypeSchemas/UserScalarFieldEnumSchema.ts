import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','password','role','createdAt','updatedAt','phone','address','img','active','marketId_workIn']);

export default UserScalarFieldEnumSchema;
