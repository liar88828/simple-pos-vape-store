import { z } from 'zod';

export const SaleScalarFieldEnumSchema = z.enum(['id','date_buy','date_confirm','total','items','statusTransaction','typeTransaction','createdAt','updatedAt','seller_userId','buyer_customerId','marketId','employee_absentId']);

export default SaleScalarFieldEnumSchema;
