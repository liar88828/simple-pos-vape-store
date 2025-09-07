import { z } from 'zod';

export const ShippingSettingScalarFieldEnumSchema = z.enum(['id','freeShippingThreshold','handlingFee','internationalShipping','internationalRate']);

export default ShippingSettingScalarFieldEnumSchema;
