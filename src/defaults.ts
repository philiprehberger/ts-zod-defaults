import { type ZodType, ZodFirstPartyTypeKind } from 'zod';

export function defaults(schema: ZodType): any {
  const def = (schema as any)._def;
  const typeName: ZodFirstPartyTypeKind = def.typeName;

  switch (typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return '';

    case ZodFirstPartyTypeKind.ZodNumber:
      return 0;

    case ZodFirstPartyTypeKind.ZodBoolean:
      return false;

    case ZodFirstPartyTypeKind.ZodArray:
      return [];

    case ZodFirstPartyTypeKind.ZodObject: {
      const shape = def.shape();
      const result: Record<string, any> = {};
      for (const key of Object.keys(shape)) {
        result[key] = defaults(shape[key] as ZodType);
      }
      return result;
    }

    case ZodFirstPartyTypeKind.ZodOptional:
      return undefined;

    case ZodFirstPartyTypeKind.ZodNullable:
      return null;

    case ZodFirstPartyTypeKind.ZodDefault:
      return def.defaultValue();

    case ZodFirstPartyTypeKind.ZodEnum:
      return def.values[0];

    case ZodFirstPartyTypeKind.ZodLiteral:
      return def.value;

    case ZodFirstPartyTypeKind.ZodUnion:
      return defaults(def.options[0] as ZodType);

    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return defaults(def.options[0] as ZodType);

    case ZodFirstPartyTypeKind.ZodRecord:
      return {};

    case ZodFirstPartyTypeKind.ZodMap:
      return new Map();

    case ZodFirstPartyTypeKind.ZodSet:
      return new Set();

    case ZodFirstPartyTypeKind.ZodTuple:
      return (def.items as ZodType[]).map((item) => defaults(item));

    case ZodFirstPartyTypeKind.ZodEffects:
      return defaults(def.schema as ZodType);

    case ZodFirstPartyTypeKind.ZodPipeline:
      return defaults(def.in as ZodType);

    default:
      return undefined;
  }
}
