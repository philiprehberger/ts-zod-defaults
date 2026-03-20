import { type ZodType, ZodFirstPartyTypeKind } from 'zod';
import { defaults } from './defaults.js';

export function emptyForm(schema: ZodType): any {
  const def = (schema as any)._def;
  const typeName: ZodFirstPartyTypeKind = def.typeName;

  switch (typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return '';

    case ZodFirstPartyTypeKind.ZodNumber:
      return undefined;

    case ZodFirstPartyTypeKind.ZodBoolean:
      return false;

    case ZodFirstPartyTypeKind.ZodObject: {
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
