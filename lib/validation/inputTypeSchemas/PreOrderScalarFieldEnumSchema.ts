import { z } from 'zod';

export const PreOrderScalarFieldEnumSchema = z.enum(['id','quantity','priceOriginal','estimatedDate','expired','status','createdAt','updatedAt','userId','productId','market_name','marketId_sellIn']);

export default PreOrderScalarFieldEnumSchema;
