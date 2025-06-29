import { z } from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id','category','name','price','stock','minStock','sold','image','description','nicotineLevel','flavor','type','expired','createdAt','updatedAt']);

export default ProductScalarFieldEnumSchema;
