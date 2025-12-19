import { z } from 'zod';
export declare const userRoleSchema: z.ZodEnum<["ADMIN", "MEDICO", "SECRETARIA"]>;
export declare const USER_ROLES: z.Values<["ADMIN", "MEDICO", "SECRETARIA"]>;
export declare const USER_ROLE_VALUES: ["ADMIN", "MEDICO", "SECRETARIA"];
export type UserRole = z.infer<typeof userRoleSchema>;
export declare const userSummarySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<["ADMIN", "MEDICO", "SECRETARIA"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "MEDICO" | "SECRETARIA";
}, {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "MEDICO" | "SECRETARIA";
}>;
export type UserSummary = z.infer<typeof userSummarySchema>;
export declare const authTokensSchema: z.ZodObject<{
    accessToken: z.ZodString;
    expiresIn: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    accessToken: string;
    expiresIn: number;
}, {
    accessToken: string;
    expiresIn: number;
}>;
export type AuthTokens = z.infer<typeof authTokensSchema>;
export declare const loginResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        role: z.ZodEnum<["ADMIN", "MEDICO", "SECRETARIA"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        email: string;
        role: "ADMIN" | "MEDICO" | "SECRETARIA";
    }, {
        id: string;
        name: string;
        email: string;
        role: "ADMIN" | "MEDICO" | "SECRETARIA";
    }>;
    tokens: z.ZodObject<{
        accessToken: z.ZodString;
        expiresIn: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        accessToken: string;
        expiresIn: number;
    }, {
        accessToken: string;
        expiresIn: number;
    }>;
}, "strip", z.ZodTypeAny, {
    user: {
        id: string;
        name: string;
        email: string;
        role: "ADMIN" | "MEDICO" | "SECRETARIA";
    };
    tokens: {
        accessToken: string;
        expiresIn: number;
    };
}, {
    user: {
        id: string;
        name: string;
        email: string;
        role: "ADMIN" | "MEDICO" | "SECRETARIA";
    };
    tokens: {
        accessToken: string;
        expiresIn: number;
    };
}>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export declare const paginationMetaSchema: z.ZodObject<{
    itemCount: z.ZodNumber;
    totalItems: z.ZodOptional<z.ZodNumber>;
    itemsPerPage: z.ZodNumber;
    totalPages: z.ZodOptional<z.ZodNumber>;
    currentPage: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    itemCount: number;
    itemsPerPage: number;
    currentPage: number;
    totalItems?: number | undefined;
    totalPages?: number | undefined;
}, {
    itemCount: number;
    itemsPerPage: number;
    currentPage: number;
    totalItems?: number | undefined;
    totalPages?: number | undefined;
}>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export declare const paginatedResponseSchema: <T extends z.ZodTypeAny>(schema: T) => z.ZodObject<{
    items: z.ZodArray<T, "many">;
    meta: z.ZodObject<{
        itemCount: z.ZodNumber;
        totalItems: z.ZodOptional<z.ZodNumber>;
        itemsPerPage: z.ZodNumber;
        totalPages: z.ZodOptional<z.ZodNumber>;
        currentPage: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        itemCount: number;
        itemsPerPage: number;
        currentPage: number;
        totalItems?: number | undefined;
        totalPages?: number | undefined;
    }, {
        itemCount: number;
        itemsPerPage: number;
        currentPage: number;
        totalItems?: number | undefined;
        totalPages?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    items: T["_output"][];
    meta: {
        itemCount: number;
        itemsPerPage: number;
        currentPage: number;
        totalItems?: number | undefined;
        totalPages?: number | undefined;
    };
}, {
    items: T["_input"][];
    meta: {
        itemCount: number;
        itemsPerPage: number;
        currentPage: number;
        totalItems?: number | undefined;
        totalPages?: number | undefined;
    };
}>;
export declare const patientSummarySchema: z.ZodObject<{
    id: z.ZodString;
    fullName: z.ZodString;
    birthDate: z.ZodString;
    documentId: z.ZodString;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    fullName: string;
    birthDate: string;
    documentId: string;
    email?: string | null | undefined;
    phone?: string | null | undefined;
}, {
    id: string;
    fullName: string;
    birthDate: string;
    documentId: string;
    email?: string | null | undefined;
    phone?: string | null | undefined;
}>;
export type PatientSummary = z.infer<typeof patientSummarySchema>;
export declare const medicalRecordSchema: z.ZodObject<{
    id: z.ZodString;
    summary: z.ZodString;
    notes: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>;
    tags: z.ZodArray<z.ZodString, "many">;
    doctorId: z.ZodString;
    patientId: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    summary: string;
    notes: Record<string, any> | null;
    tags: string[];
    doctorId: string;
    patientId: string;
    createdAt: string;
    updatedAt: string;
}, {
    id: string;
    summary: string;
    notes: Record<string, any> | null;
    tags: string[];
    doctorId: string;
    patientId: string;
    createdAt: string;
    updatedAt: string;
}>;
export type MedicalRecordData = z.infer<typeof medicalRecordSchema>;
export declare const ROLE_PERMISSIONS: {
    readonly ADMIN: {
        readonly canManagePatients: true;
        readonly canManageRecords: true;
    };
    readonly MEDICO: {
        readonly canManagePatients: true;
        readonly canManageRecords: true;
    };
    readonly SECRETARIA: {
        readonly canManagePatients: true;
        readonly canManageRecords: false;
    };
};
