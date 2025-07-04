import { z } from 'zod';

export const PreOrderScalarFieldEnumSchema = z.enum([ 'id', 'productId', 'quantity', 'estimatedDate', 'status', 'createdAt', 'updatedAt' ]);

export default PreOrderScalarFieldEnumSchema;
