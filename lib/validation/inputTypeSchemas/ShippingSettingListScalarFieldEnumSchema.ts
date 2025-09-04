import { z } from 'zod';

export const ShippingSettingListScalarFieldEnumSchema = z.enum([ 'id', 'name', 'price', 'rates', 'shippingId' ]);

export default ShippingSettingListScalarFieldEnumSchema;
