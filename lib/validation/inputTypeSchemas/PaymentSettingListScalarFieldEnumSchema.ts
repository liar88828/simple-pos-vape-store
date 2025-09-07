import { z } from 'zod';

export const PaymentSettingListScalarFieldEnumSchema = z.enum(['id','title','value','fee','rekening','paymentId']);

export default PaymentSettingListScalarFieldEnumSchema;
