import type { ZodType } from 'zod';
import { defaults } from './defaults.js';

export function emptyForm(schema: ZodType): any {
  const def = (schema as any)._def;
  const typeName: string = def.typeName;

  switch (typeName) {
    case 'ZodString':
      return '';

    case 'ZodNumber':
      return undefined;

    case 'ZodBoolean':
      return false;

    case 'ZodObject': {
      const shape = def.shape();
      const result: Record<string, any> = {};
      for (const key of Object.keys(shape)) {
        result[key] = emptyForm(shape[key] as ZodType);
      }
      return result;
    }

    default:
      return defaults(schema);
  }
}
