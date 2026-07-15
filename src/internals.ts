import type { ZodType } from 'zod';

/**
 * Access a Zod schema's internal definition.
 *
 * Zod 4 exposes the definition at `schema._zod.def` (with `def.type` as a
 * lowercase discriminant such as `'string'` or `'object'`). The `._def`
 * fallback keeps older layouts working.
 */
export function getDef(schema: ZodType): any {
  return (schema as any)._zod?.def ?? (schema as any)._def;
}

/** Returns true when a string schema carries an email format check (Zod 4). */
export function hasEmailCheck(def: any): boolean {
  const checks = def?.checks;
  if (!Array.isArray(checks)) return false;
  return checks.some((check: any) => {
    const cd = check?._zod?.def ?? check?.def ?? check;
    return cd?.format === 'email' || cd?.kind === 'email';
  });
}
