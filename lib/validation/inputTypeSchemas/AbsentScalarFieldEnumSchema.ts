import { z } from 'zod';

export const AbsentScalarFieldEnumSchema = z.enum([ 'id', 'datetime', 'status_absent', 'sold', 'revenue', 'createdAt', 'updatedAt', 'userId' ]);

export default AbsentScalarFieldEnumSchema;
