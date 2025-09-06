import { z } from 'zod';

export const ROLE_USERSchema = z.enum([ 'USER', 'ADMIN', 'EMPLOYEE' ]);

export type ROLE_USERType = `${ z.infer<typeof ROLE_USERSchema> }`

export default ROLE_USERSchema;
