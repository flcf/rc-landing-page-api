import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    rules: {
      quotes: ['error', 'single'],
      'object-shorthand': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      '@typescript-eslint/no-explicit-any': ['warn'],
    },
  },
  eslintConfigPrettier,
  {
    // Ignores for common directories
    ignores: ['node_modules/', 'dist/', '.eslintrc.js'],
  },
);
