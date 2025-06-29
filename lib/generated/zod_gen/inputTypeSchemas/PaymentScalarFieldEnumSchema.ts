import { z } from 'zod';

export const PaymentScalarFieldEnumSchema = z.enum(['id','isCod','valueCod']);

export default PaymentScalarFieldEnumSchema;
