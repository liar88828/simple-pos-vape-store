import { z } from 'zod';

export const PaymentScalarFieldEnumSchema = z.enum([ 'id', 'isCod', 'isTax', 'valueCod', 'valueTax' ]);

export default PaymentScalarFieldEnumSchema;
