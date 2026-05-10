import type { ZodType } from 'zod';
import { createPrng } from './prng.js';
import type { MockOptions } from './types.js';

const firstNames = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eve',
  'Frank', 'Grace', 'Hank', 'Ivy', 'Jack',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
  'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
];

const domains = ['example.com', 'test.org', 'demo.net', 'sample.io', 'mail.dev'];

function randomString(random: () => number, length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(random() * chars.length)];
  }
  return result;
}

function hasEmailCheck(def: any): boolean {
  if (!def.checks || !Array.isArray(def.checks)) return false;
  return def.checks.some((check: any) => check.kind === 'email');
}

function generateMock(schema: ZodType, random: () => number): any {
  const def = (schema as any)._def;
  const typeName: string = def.typeName;

  switch (typeName) {
    case 'ZodString': {
      if (hasEmailCheck(def)) {
        const first = firstNames[Math.floor(random() * firstNames.length)]!.toLowerCase();
        const last = lastNames[Math.floor(random() * lastNames.length)]!.toLowerCase();
        const domain = domains[Math.floor(random() * domains.length)];
        return `${first}.${last}@${domain}`;
      }
      return randomString(random, 8);
    }

    case 'ZodNumber':
      return Math.floor(random() * 100) + 1;

    case 'ZodBoolean':
      return random() >= 0.5;

    case 'ZodArray': {
      const count = Math.floor(random() * 3) + 1;
      const items: any[] = [];
      for (let i = 0; i < count; i++) {
        items.push(generateMock(def.type as ZodType, random));
      }
      return items;
    }

    case 'ZodObject': {
      const shape = def.shape();
      const result: Record<string, any> = {};
      for (const key of Object.keys(shape)) {
        result[key] = generateMock(shape[key] as ZodType, random);
      }
      return result;
    }

    case 'ZodEnum': {
      const values = def.values as string[];
      return values[Math.floor(random() * values.length)];
    }

    case 'ZodOptional':
      return random() < 0.8 ? generateMock(def.innerType as ZodType, random) : undefined;

    case 'ZodNullable':
      return random() < 0.9 ? generateMock(def.innerType as ZodType, random) : null;

    case 'ZodDefault':
      return generateMock(def.innerType as ZodType, random);

    case 'ZodLiteral':
      return def.value;

    case 'ZodUnion':
      return generateMock(
        def.options[Math.floor(random() * def.options.length)] as ZodType,
        random,
      );

    case 'ZodDiscriminatedUnion':
      return generateMock(
        def.options[Math.floor(random() * def.options.length)] as ZodType,
        random,
      );

    case 'ZodRecord':
      return {};

    case 'ZodMap':
      return new Map();

    case 'ZodSet':
      return new Set();

    case 'ZodTuple':
      return (def.items as ZodType[]).map((item) => generateMock(item, random));

    case 'ZodEffects':
      return generateMock(def.schema as ZodType, random);

    case 'ZodPipeline':
      return generateMock(def.in as ZodType, random);

    default:
      return undefined;
  }
}

export function mock(schema: ZodType, options?: MockOptions): any {
  const random = options?.seed !== undefined ? createPrng(options.seed) : Math.random;
  return generateMock(schema, random);
}

export function mockMany<T extends ZodType>(
  schema: T,
  count: number,
  options?: MockOptions,
): any[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError('mockMany(): count must be a non-negative integer');
  }
  const random = options?.seed !== undefined ? createPrng(options.seed) : Math.random;
  const items: any[] = [];
  for (let i = 0; i < count; i += 1) {
    items.push(generateMock(schema as ZodType, random));
  }
  return items;
}
