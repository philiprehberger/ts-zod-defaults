# @philiprehberger/zod-defaults

[![CI](https://github.com/philiprehberger/zod-defaults/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/zod-defaults/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/zod-defaults.svg)](https://www.npmjs.com/package/@philiprehberger/zod-defaults)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/zod-defaults)](https://github.com/philiprehberger/zod-defaults/commits/main)

Auto-generate default values, empty form states, and mock data from Zod schemas

## Installation

```bash
npm install @philiprehberger/zod-defaults
```

**Peer dependency:** `zod ^3.22.0`

## Usage

```ts
import { z } from 'zod';
import { defaults, emptyForm, mock } from '@philiprehberger/zod-defaults';

const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
  role: z.enum(['admin', 'user']),
  active: z.boolean(),
});

// Generate safe defaults
defaults(UserSchema);
// → { name: '', age: 0, role: 'admin', active: false }

// Generate empty form values (numbers become undefined)
emptyForm(UserSchema);
// → { name: '', age: undefined, role: 'admin', active: false }

// Generate realistic mock data
mock(UserSchema);
// → { name: 'xkqwplmn', age: 47, role: 'user', active: true }

// Deterministic mock data with a seed
mock(UserSchema, { seed: 42 });
// → same output every time
```

## API

| Function | Description |
| --- | --- |
| `defaults(schema)` | Returns a value with safe defaults for every field (`""`, `0`, `false`, `[]`, etc.) |
| `emptyForm(schema)` | Like `defaults` but numbers return `undefined` for blank form inputs |
| `mock(schema, options?)` | Generates realistic fake data; pass `{ seed }` for deterministic output |

### MockOptions

| Option | Type | Description |
| --- | --- | --- |
| `seed` | `number` | Optional seed for deterministic PRNG output |

## Development

```bash
npm install
npm run build
npm run typecheck
npm test
```

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/zod-defaults)

🐛 [Report issues](https://github.com/philiprehberger/zod-defaults/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/zod-defaults/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)
