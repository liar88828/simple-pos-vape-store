import { z } from 'zod';

export const STATUS_PREORDERSchema = z.enum(['Pending','Success']);

export type STATUS_PREORDERType = `${z.infer<typeof STATUS_PREORDERSchema>}`

export default STATUS_PREORDERSchema;
