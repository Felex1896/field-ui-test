import tseslint from 'typescript-eslint';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/', '.angular/'],
  },
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended],
    plugins: {
      '@angular-eslint': angular,
    },
    rules: {
      // Angular component/directive conventions
      '@angular-eslint/component-class-suffix': 'off', // App uses non-suffixed class names
      '@angular-eslint/directive-class-suffix': 'warn',
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@angular-eslint/no-input-rename': 'warn',
      '@angular-eslint/no-output-native': 'error',
      '@angular-eslint/no-output-rename': 'warn',
      '@angular-eslint/use-lifecycle-interface': 'warn',
      '@angular-eslint/contextual-lifecycle': 'error',
      '@angular-eslint/no-conflicting-lifecycle': 'error',

      // TypeScript quality
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    languageOptions: {
      parser: angularTemplateParser,
    },
    rules: {
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/eqeqeq': ['error', { allowNullOrUndefined: true }],
      '@angular-eslint/template/no-negated-async': 'warn',
      '@angular-eslint/template/use-track-by-function': 'warn',
    },
  },
);
