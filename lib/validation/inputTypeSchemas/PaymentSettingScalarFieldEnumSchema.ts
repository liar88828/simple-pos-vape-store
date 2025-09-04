import { z } from 'zod';

export const PaymentSettingScalarFieldEnumSchema = z.enum([ 'id', 'isCod', 'isTax', 'valueCod', 'valueTax' ]);

export default PaymentSettingScalarFieldEnumSchema;
