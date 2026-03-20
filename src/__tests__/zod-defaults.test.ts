import { describe, it } from 'node:test';
import assert from 'node:assert';
import { z } from 'zod';
import { defaults, emptyForm, mock } from '../../dist/index.js';

describe('defaults', () => {
  it('should return "" for string', () => {
    assert.strictEqual(defaults(z.string()), '');
  });

  it('should return 0 for number', () => {
    assert.strictEqual(defaults(z.number()), 0);
  });

  it('should return false for boolean', () => {
    assert.strictEqual(defaults(z.boolean()), false);
  });

  it('should return [] for array', () => {
    assert.deepStrictEqual(defaults(z.array(z.string())), []);
  });

  it('should recursively generate object defaults', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      active: z.boolean(),
    });
    assert.deepStrictEqual(defaults(schema), {
      name: '',
      age: 0,
      active: false,
    });
  });

  it('should return undefined for optional', () => {
    assert.strictEqual(defaults(z.string().optional()), undefined);
  });

  it('should return null for nullable', () => {
    assert.strictEqual(defaults(z.string().nullable()), null);
  });

  it('should return the first value for enum', () => {
    const schema = z.enum(['red', 'green', 'blue']);
    assert.strictEqual(defaults(schema), 'red');
  });

  it('should use the default value when provided', () => {
    const schema = z.string().default('hello');
    assert.strictEqual(defaults(schema), 'hello');
  });

  it('should handle nested objects', () => {
    const schema = z.object({
      user: z.object({
        name: z.string(),
        email: z.string(),
      }),
      count: z.number(),
    });
    assert.deepStrictEqual(defaults(schema), {
      user: { name: '', email: '' },
      count: 0,
    });
  });

  it('should return the literal value', () => {
    assert.strictEqual(defaults(z.literal('fixed')), 'fixed');
  });

  it('should handle union by returning defaults of first option', () => {
    const schema = z.union([z.string(), z.number()]);
    assert.strictEqual(defaults(schema), '');
  });

  it('should return {} for record', () => {
    assert.deepStrictEqual(defaults(z.record(z.string())), {});
  });

  it('should handle tuple', () => {
    const schema = z.tuple([z.string(), z.number(), z.boolean()]);
    assert.deepStrictEqual(defaults(schema), ['', 0, false]);
  });

  it('should handle effects (refinements)', () => {
    const schema = z.string().refine((s) => s.length > 0);
    assert.strictEqual(defaults(schema), '');
  });
});

describe('emptyForm', () => {
  it('should return undefined for number', () => {
    assert.strictEqual(emptyForm(z.number()), undefined);
  });

  it('should return "" for string', () => {
    assert.strictEqual(emptyForm(z.string()), '');
  });

  it('should return false for boolean', () => {
    assert.strictEqual(emptyForm(z.boolean()), false);
  });

  it('should recursively apply to objects', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });
    assert.deepStrictEqual(emptyForm(schema), {
      name: '',
      age: undefined,
    });
  });
});

describe('mock', () => {
  it('should return a string for string schema', () => {
    const result = mock(z.string());
    assert.strictEqual(typeof result, 'string');
    assert.ok(result.length > 0);
  });

  it('should return a number for number schema', () => {
    const result = mock(z.number());
    assert.strictEqual(typeof result, 'number');
    assert.ok(result >= 1 && result <= 100);
  });

  it('should return a boolean for boolean schema', () => {
    const result = mock(z.boolean());
    assert.strictEqual(typeof result, 'boolean');
  });

  it('should produce deterministic output with seed', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });
    const a = mock(schema, { seed: 42 });
    const b = mock(schema, { seed: 42 });
    assert.deepStrictEqual(a, b);
  });

  it('should generate arrays with items', () => {
    const result = mock(z.array(z.number()), { seed: 1 });
    assert.ok(Array.isArray(result));
    assert.ok(result.length >= 1 && result.length <= 3);
    for (const item of result) {
      assert.strictEqual(typeof item, 'number');
    }
  });

  it('should pick valid enum values', () => {
    const schema = z.enum(['red', 'green', 'blue']);
    const result = mock(schema, { seed: 7 });
    assert.ok(['red', 'green', 'blue'].includes(result));
  });

  it('should generate an email for email-validated strings', () => {
    const schema = z.string().email();
    const result = mock(schema, { seed: 99 });
    assert.ok(result.includes('@'), `Expected email but got: ${result}`);
  });

  it('should generate object with all properties', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      active: z.boolean(),
    });
    const result = mock(schema, { seed: 5 });
    assert.ok('name' in result);
    assert.ok('age' in result);
    assert.ok('active' in result);
    assert.strictEqual(typeof result.name, 'string');
    assert.strictEqual(typeof result.age, 'number');
    assert.strictEqual(typeof result.active, 'boolean');
  });
});
