import { z } from 'zod';

export const userRoleSchema = z.enum(['ADMIN', 'MEDICO', 'SECRETARIA']);
export const USER_ROLES = userRoleSchema.enum;
export const USER_ROLE_VALUES = userRoleSchema.options;
export type UserRole = z.infer<typeof userRoleSchema>;

export const userSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: userRoleSchema
});
export type UserSummary = z.infer<typeof userSummarySchema>;

export const authTokensSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.number()
});
export type AuthTokens = z.infer<typeof authTokensSchema>;

export const loginResponseSchema = z.object({
  user: userSummarySchema,
  tokens: authTokensSchema
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const paginationMetaSchema = z.object({
  itemCount: z.number().nonnegative(),
  totalItems: z.number().nonnegative().optional(),
  itemsPerPage: z.number().positive(),
  totalPages: z.number().nonnegative().optional(),
  currentPage: z.number().nonnegative()
});
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    items: z.array(schema),
    meta: paginationMetaSchema
  });

export const patientSummarySchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  birthDate: z.string(),
  documentId: z.string(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable()
});
export type PatientSummary = z.infer<typeof patientSummarySchema>;

export const medicalRecordSchema = z.object({
  id: z.string().uuid(),
  summary: z.string(),
  notes: z.record(z.any()).nullable(),
  tags: z.array(z.string()),
  doctorId: z.string().uuid(),
  patientId: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string()
});
export type MedicalRecordData = z.infer<typeof medicalRecordSchema>;

export const ROLE_PERMISSIONS = {
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
} as const;
