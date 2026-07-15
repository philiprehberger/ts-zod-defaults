import type { ZodType } from 'zod';
import { createPrng } from './prng.js';
import { getDef, hasEmailCheck } from './internals.js';
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

function generateMock(schema: ZodType, random: () => number): any {
  const def = getDef(schema);

  switch (def.type) {
    case 'string': {
      if (hasEmailCheck(def)) {
        const first = firstNames[Math.floor(random() * firstNames.length)]!.toLowerCase();
        const last = lastNames[Math.floor(random() * lastNames.length)]!.toLowerCase();
        const domain = domains[Math.floor(random() * domains.length)];
        return `${first}.${last}@${domain}`;
      }
      return randomString(random, 8);
    }

    case 'number':
      return Math.floor(random() * 100) + 1;

    case 'boolean':
      return random() >= 0.5;

    case 'array': {
      const count = Math.floor(random() * 3) + 1;
      const items: any[] = [];
      for (let i = 0; i < count; i++) {
        items.push(generateMock(def.element as ZodType, random));
      }
      return items;
    }

    case 'object': {
      const shape = def.shape as Record<string, ZodType>;
      const result: Record<string, any> = {};
      for (const key of Object.keys(shape)) {
        result[key] = generateMock(shape[key] as ZodType, random);
      }
      return result;
    }

    case 'enum': {
      const values = Object.values(def.entries as Record<string, string>);
      return values[Math.floor(random() * values.length)];
    }

    case 'optional':
      return random() < 0.8 ? generateMock(def.innerType as ZodType, random) : undefined;

    case 'nullable':
      return random() < 0.9 ? generateMock(def.innerType as ZodType, random) : null;

    case 'default':
      return generateMock(def.innerType as ZodType, random);

    case 'literal': {
      const values = def.values as unknown[];
      return values[Math.floor(random() * values.length)];
    }

    case 'union':
      return generateMock(
        def.options[Math.floor(random() * def.options.length)] as ZodType,
        random,
      );

    case 'record':
      return {};

    case 'map':
      return new Map();

    case 'set':
      return new Set();

    case 'tuple':
      return (def.items as ZodType[]).map((item) => generateMock(item, random));

    case 'pipe':
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
