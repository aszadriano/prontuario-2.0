"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = exports.medicalRecordSchema = exports.patientSummarySchema = exports.paginatedResponseSchema = exports.paginationMetaSchema = exports.loginResponseSchema = exports.authTokensSchema = exports.userSummarySchema = exports.USER_ROLE_VALUES = exports.USER_ROLES = exports.userRoleSchema = void 0;
const zod_1 = require("zod");
exports.userRoleSchema = zod_1.z.enum(['ADMIN', 'MEDICO', 'SECRETARIA']);
exports.USER_ROLES = exports.userRoleSchema.enum;
exports.USER_ROLE_VALUES = exports.userRoleSchema.options;
exports.userSummarySchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    role: exports.userRoleSchema
});
exports.authTokensSchema = zod_1.z.object({
    accessToken: zod_1.z.string(),
    expiresIn: zod_1.z.number()
});
exports.loginResponseSchema = zod_1.z.object({
    user: exports.userSummarySchema,
    tokens: exports.authTokensSchema
});
exports.paginationMetaSchema = zod_1.z.object({
    itemCount: zod_1.z.number().nonnegative(),
    totalItems: zod_1.z.number().nonnegative().optional(),
    itemsPerPage: zod_1.z.number().positive(),
    totalPages: zod_1.z.number().nonnegative().optional(),
    currentPage: zod_1.z.number().nonnegative()
});
const paginatedResponseSchema = (schema) => zod_1.z.object({
    items: zod_1.z.array(schema),
    meta: exports.paginationMetaSchema
});
exports.paginatedResponseSchema = paginatedResponseSchema;
exports.patientSummarySchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    fullName: zod_1.z.string(),
    birthDate: zod_1.z.string(),
    documentId: zod_1.z.string(),
    phone: zod_1.z.string().optional().nullable(),
    email: zod_1.z.string().email().optional().nullable()
});
exports.medicalRecordSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    summary: zod_1.z.string(),
    notes: zod_1.z.record(zod_1.z.any()).nullable(),
    tags: zod_1.z.array(zod_1.z.string()),
    doctorId: zod_1.z.string().uuid(),
    patientId: zod_1.z.string().uuid(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string()
});
exports.ROLE_PERMISSIONS = {
    ADMIN: {
        canManagePatients: true,
        canManageRecords: true
    },
    MEDICO: {
        canManagePatients: true,
        canManageRecords: true
    },
    SECRETARIA: {
        canManagePatients: true,
        canManageRecords: false
    }
};
