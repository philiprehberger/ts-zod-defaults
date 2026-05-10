import type { ZodType } from 'zod';

export function defaults(schema: ZodType): any {
  const def = (schema as any)._def;
  const typeName: string = def.typeName;

  switch (typeName) {
    case 'ZodString':
      return '';

    case 'ZodNumber':
      return 0;

    case 'ZodBoolean':
      return false;

    case 'ZodArray':
      return [];

    case 'ZodObject': {
      const shape = def.shape();
      const result: Record<string, any> = {};
      for (const key of Object.keys(shape)) {
        result[key] = defaults(shape[key] as ZodType);
      }
      return result;
    }

    case 'ZodOptional':
      return undefined;

    case 'ZodNullable':
      return null;

    case 'ZodDefault':
      return def.defaultValue();

    case 'ZodEnum':
      return def.values[0];

    case 'ZodLiteral':
      return def.value;

    case 'ZodUnion':
      return defaults(def.options[0] as ZodType);

    case 'ZodDiscriminatedUnion':
      return defaults(def.options[0] as ZodType);

    case 'ZodRecord':
      return {};

    case 'ZodMap':
      return new Map();

    case 'ZodSet':
      return new Set();

    case 'ZodTuple':
      return (def.items as ZodType[]).map((item) => defaults(item));

    case 'ZodEffects':
      return defaults(def.schema as ZodType);

    case 'ZodPipeline':
      return defaults(def.in as ZodType);

    default:
      return undefined;
  }
}
