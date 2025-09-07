import { z } from 'zod';

export const MarketScalarFieldEnumSchema = z.enum(['id','name','location','category','open','createdAt','updatedAt']);

export default MarketScalarFieldEnumSchema;
