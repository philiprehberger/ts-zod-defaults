import type { ZodType } from 'zod';
import { defaults } from './defaults.js';
import { getDef } from './internals.js';

export function emptyForm(schema: ZodType): any {
  const def = getDef(schema);

  switch (def.type) {
    case 'string':
      return '';

    case 'number':
      return undefined;

    case 'boolean':
      return false;

    case 'object': {
      const shape = def.shape as Record<string, ZodType>;
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
