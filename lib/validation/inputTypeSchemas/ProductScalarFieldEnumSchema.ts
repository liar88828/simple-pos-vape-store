import { z } from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id','category','name','price','stock','minStock','sold','image','brand','type','description','nicotineLevel','fluidLevel','flavor','cottonSize','batterySize','resistanceSize','coilSize','createdAt','updatedAt']);

export default ProductScalarFieldEnumSchema;
