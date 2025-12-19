import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z
    .string()
    .regex(/^\d+$/)
    .transform((value) => parseInt(value, 10))
    .default('4000'),
  // Database config: allow either full URL or discrete fields
  DATABASE_URL: z.string().url().optional(),
  DB_HOST: z.string().optional(),
  DB_PORT: z
    .string()
    .regex(/^\d+$/)
    .transform((value) => parseInt(value, 10))
    .optional(),
  DB_USERNAME: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_NAME: z.string().optional(),
  DB_SSL: z.coerce.boolean().optional(),
  DB_SSL_REJECT_UNAUTHORIZED: z.coerce.boolean().optional(),
  // Auth / misc
  JWT_SECRET: z
    .string()
    .min(16)
    .optional()
    .default('super-secret-development-key'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  CORS_ORIGINS: z.string().optional(),
  ENABLE_SWAGGER: z.coerce.boolean().default(true),
  // Google optional
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
  GOOGLE_REFRESH_TOKEN: z.string().optional(),
  GOOGLE_TOKEN_ENCRYPTION_KEY: z
    .string()
    .min(32)
    .optional()
    .default('dev-token-encryption-key-32-bytes'),
  GOOGLE_OAUTH_STATE_SECRET: z
    .string()
    .min(16)
    .optional()
    .default('dev-oauth-state-secret'),
  GOOGLE_OAUTH_SUCCESS_REDIRECT: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>): EnvConfig => {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Invalid environment variables: ${result.error.message}`);
  }
  return result.data;
};
