import { z } from 'zod';

export const ShippingListScalarFieldEnumSchema = z.enum(['id','name','price','rates','shippingId']);

export default ShippingListScalarFieldEnumSchema;
