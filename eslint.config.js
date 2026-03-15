import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Disallow explicit `any` types
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },

  // Prevent cross-feature imports: each feature must not import from sibling features
  {
    files: ['src/features/auth/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '.*features/chat.*',
              message: 'Cross-feature import: auth must not import from chat.',
            },
            {
              regex: '.*features/theme.*',
              message: 'Cross-feature import: auth must not import from theme.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/chat/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '.*features/auth.*',
              message: 'Cross-feature import: chat must not import from auth.',
            },
            {
              regex: '.*features/theme.*',
              message: 'Cross-feature import: chat must not import from theme.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/theme/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '.*features/auth.*',
              message: 'Cross-feature import: theme must not import from auth.',
            },
            {
              regex: '.*features/chat.*',
              message: 'Cross-feature import: theme must not import from chat.',
            },
          ],
        },
      ],
    },
  },
])
