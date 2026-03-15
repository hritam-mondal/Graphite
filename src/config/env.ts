import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().default('http://localhost:3000'),
  VITE_API_TIMEOUT: z.coerce.number().default(10000),
  VITE_ENABLE_DEVTOOLS: z.coerce.boolean().default(false),
  VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const result = envSchema.safeParse(import.meta.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${errors}`);
  }

  return result.data;
}

export const env = validateEnv();
