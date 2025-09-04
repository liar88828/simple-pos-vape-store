import { z } from 'zod';

export const SaleScalarFieldEnumSchema = z.enum([ 'id', 'date', 'total', 'items', 'statusTransaction', 'typeTransaction', 'createdAt', 'updatedAt', 'seller_userId', 'buyer_customerId' ]);

export default SaleScalarFieldEnumSchema;
