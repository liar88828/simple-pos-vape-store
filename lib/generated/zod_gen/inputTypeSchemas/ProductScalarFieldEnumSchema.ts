import { z } from 'zod';

export const ProductScalarFieldEnumSchema = z.enum([ 'id', 'category', 'name', 'price', 'stock', 'minStock', 'sold', 'image', 'brand', 'type', 'description', 'nicotineLevel', 'flavor', 'cottonSize', 'batterySize', 'resistanceSize', 'coilSize', 'expired', 'createdAt', 'updatedAt' ]);

export default ProductScalarFieldEnumSchema;
