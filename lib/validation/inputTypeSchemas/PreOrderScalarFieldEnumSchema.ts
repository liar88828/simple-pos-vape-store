import { z } from 'zod';

export const PreOrderScalarFieldEnumSchema = z.enum([ 'id', 'quantity', 'priceNormal', 'priceSell', 'estimatedDate', 'expired', 'status', 'createdAt', 'updatedAt', 'userId', 'productId' ]);

export default PreOrderScalarFieldEnumSchema;
