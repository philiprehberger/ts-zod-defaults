import type { ZodType } from 'zod';
import { getDef } from './internals.js';

export function defaults(schema: ZodType): any {
  const def = getDef(schema);

  switch (def.type) {
    case 'string':
      return '';

    case 'number':
      return 0;

    case 'boolean':
      return false;

    case 'array':
      return [];

    case 'object': {
      const shape = def.shape as Record<string, ZodType>;
      const result: Record<string, any> = {};
      for (const key of Object.keys(shape)) {
        result[key] = defaults(shape[key] as ZodType);
      }
      return result;
    }

    case 'optional':
      return undefined;

    case 'nullable':
      return null;

    case 'default': {
      const value = def.defaultValue;
      return typeof value === 'function' ? value() : value;
    }

    case 'enum': {
      const values = Object.values(def.entries as Record<string, string>);
      return values[0];
    }

    case 'literal':
      return (def.values as unknown[])[0];

    case 'union':
      return defaults(def.options[0] as ZodType);

    case 'record':
      return {};

    case 'map':
      return new Map();

    case 'set':
      return new Set();

    case 'tuple':
      return (def.items as ZodType[]).map((item) => defaults(item));

    case 'pipe':
      return defaults(def.in as ZodType);

    default:
      return undefined;
  }
}
