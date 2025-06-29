import { z } from 'zod';

export const ShippingScalarFieldEnumSchema = z.enum(['id','freeShippingThreshold','handlingFee','internationalShipping','internationalRate']);

export default ShippingScalarFieldEnumSchema;
