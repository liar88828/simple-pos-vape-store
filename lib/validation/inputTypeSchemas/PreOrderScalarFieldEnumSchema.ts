import { z } from 'zod';

export const PreOrderScalarFieldEnumSchema = z.enum([ 'id', 'productId', 'quantity', 'priceNormal', 'priceSell', 'estimatedDate', 'expired', 'status', 'createdAt', 'updatedAt' ]);

export default PreOrderScalarFieldEnumSchema;
