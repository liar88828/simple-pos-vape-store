import { z } from 'zod';

export const PaymentSettingListScalarFieldEnumSchema = z.enum([ 'id', 'title', 'value', 'fee', 'paymentId' ]);

export default PaymentSettingListScalarFieldEnumSchema;
