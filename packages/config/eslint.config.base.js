/* The shared ESLint rules, actually consumed.

   apps/web used to inline a byte-identical copy of the block below and never
   extend this file, so the two could drift silently and "shared" was a claim
   rather than a fact. It is extended by RELATIVE PATH rather than by the
   package's "./eslint" exports entry: the legacy eslintrc resolver that
   `next lint` uses does not read package.json exports maps and fails with
   "Failed to load config" on the bare specifier. Revisit when this project
   migrates to ESLint flat config. */

/** @type {import('eslint').Linter.Config} */
const eslintConfig = {
  extends: ['next/core-web-vitals'],
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/prop-types': 'off',
    'react/display-name': 'off',
  },
}

module.exports = eslintConfig
