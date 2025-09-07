import { z } from 'zod';

export const STATUS_ABSENTSchema = z.enum(['Present','Absent','Late']);

export type STATUS_ABSENTType = `${z.infer<typeof STATUS_ABSENTSchema>}`

export default STATUS_ABSENTSchema;
