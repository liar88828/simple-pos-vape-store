import { z } from 'zod';
import { STATUS_ABSENTSchema } from '../inputTypeSchemas/STATUS_ABSENTSchema'
import {
    SaleWithRelationsSchema,
    SalePartialWithRelationsSchema,
    SaleOptionalDefaultsWithRelationsSchema
} from './SaleSchema'
import type { SaleWithRelations, SalePartialWithRelations, SaleOptionalDefaultsWithRelations } from './SaleSchema'
import {
    UserWithRelationsSchema,
    UserPartialWithRelationsSchema,
    UserOptionalDefaultsWithRelationsSchema
} from './UserSchema'
import type { UserWithRelations, UserPartialWithRelations, UserOptionalDefaultsWithRelations } from './UserSchema'

/////////////////////////////////////////
// ABSENT SCHEMA
/////////////////////////////////////////

export const AbsentSchema = z.object({
    status_absent: STATUS_ABSENTSchema,
    id: z.number().int(),
    datetime: z.date(),
    sold: z.number().int(),
    revenue: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    userId: z.string(),
})

export type Absent = z.infer<typeof AbsentSchema>

/////////////////////////////////////////
// ABSENT PARTIAL SCHEMA
/////////////////////////////////////////

export const AbsentPartialSchema = AbsentSchema.partial()

export type AbsentPartial = z.infer<typeof AbsentPartialSchema>

/////////////////////////////////////////
// ABSENT OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const AbsentOptionalDefaultsSchema = AbsentSchema.merge(z.object({
    id: z.number().int().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
}))

export type AbsentOptionalDefaults = z.infer<typeof AbsentOptionalDefaultsSchema>

/////////////////////////////////////////
// ABSENT RELATION SCHEMA
/////////////////////////////////////////

export type AbsentRelations = {
    Sale: SaleWithRelations[];
    User: UserWithRelations;
};

export type AbsentWithRelations = z.infer<typeof AbsentSchema> & AbsentRelations

export const AbsentWithRelationsSchema: z.ZodType<AbsentWithRelations> = AbsentSchema.merge(z.object({
    Sale: z.lazy(() => SaleWithRelationsSchema).array(),
    User: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// ABSENT OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type AbsentOptionalDefaultsRelations = {
    Sale: SaleOptionalDefaultsWithRelations[];
    User: UserOptionalDefaultsWithRelations;
};

export type AbsentOptionalDefaultsWithRelations =
    z.infer<typeof AbsentOptionalDefaultsSchema>
    & AbsentOptionalDefaultsRelations

export const AbsentOptionalDefaultsWithRelationsSchema: z.ZodType<AbsentOptionalDefaultsWithRelations> = AbsentOptionalDefaultsSchema.merge(z.object({
    Sale: z.lazy(() => SaleOptionalDefaultsWithRelationsSchema).array(),
    User: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
}))

/////////////////////////////////////////
// ABSENT PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type AbsentPartialRelations = {
    Sale?: SalePartialWithRelations[];
    User?: UserPartialWithRelations;
};

export type AbsentPartialWithRelations = z.infer<typeof AbsentPartialSchema> & AbsentPartialRelations

export const AbsentPartialWithRelationsSchema: z.ZodType<AbsentPartialWithRelations> = AbsentPartialSchema.merge(z.object({
    Sale: z.lazy(() => SalePartialWithRelationsSchema).array(),
    User: z.lazy(() => UserPartialWithRelationsSchema),
})).partial()

export type AbsentOptionalDefaultsWithPartialRelations =
    z.infer<typeof AbsentOptionalDefaultsSchema>
    & AbsentPartialRelations

export const AbsentOptionalDefaultsWithPartialRelationsSchema: z.ZodType<AbsentOptionalDefaultsWithPartialRelations> = AbsentOptionalDefaultsSchema.merge(z.object({
    Sale: z.lazy(() => SalePartialWithRelationsSchema).array(),
    User: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export type AbsentWithPartialRelations = z.infer<typeof AbsentSchema> & AbsentPartialRelations

export const AbsentWithPartialRelationsSchema: z.ZodType<AbsentWithPartialRelations> = AbsentSchema.merge(z.object({
    Sale: z.lazy(() => SalePartialWithRelationsSchema).array(),
    User: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export default AbsentSchema;
