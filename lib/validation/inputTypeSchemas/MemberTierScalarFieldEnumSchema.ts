import { z } from 'zod';

export const MemberTierScalarFieldEnumSchema = z.enum(['id','name','range','progress','count','createdAt','updatedAt']);

export default MemberTierScalarFieldEnumSchema;
