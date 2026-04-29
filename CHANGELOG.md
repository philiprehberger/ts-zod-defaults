# Changelog

## 0.2.0

- Add `mockMany(schema, count, options?)` for generating arrays of mocks (deterministic when `seed` is provided)
- Sync `package.json` `description` with the README one-liner (`"Auto-generate default values, empty form states, and mock data from Zod schemas"`)

## 0.1.6

- Fix README GitHub URLs to use correct repo name (ts-zod-defaults)

## 0.1.5

- Standardize README to 3-badge format with emoji Support section
- Update CI actions to v5 for Node.js 24 compatibility
- Add GitHub issue templates, dependabot config, and PR template

## 0.1.4

- Standardize README badges

## 0.1.3

- Standardize README badges and CHANGELOG formatting

## 0.1.2

- Standardize package.json configuration

## 0.1.1

- Add CI workflow

## 0.1.0

- `defaults()` — generate default values from any Zod schema
- `emptyForm()` — generate empty form-friendly values (numbers as undefined)
- `mock()` — generate realistic fake data with optional seeded PRNG
