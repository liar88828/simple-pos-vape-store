import { z } from 'zod';

export const PaymentListScalarFieldEnumSchema = z.enum(['id','title','value','fee','paymentId']);

export default PaymentListScalarFieldEnumSchema;
