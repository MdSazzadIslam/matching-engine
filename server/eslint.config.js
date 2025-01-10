const globals = require('globals');
const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const eslintPluginPrettier = require('eslint-plugin-prettier');

module.exports = [
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    ignores: [
      // Build outputs
      'dist/**',
      'build/**',
      
      // Dependencies
      'node_modules/**',
      
      // Test coverage
      'coverage/**',
      
      // Logs
      'logs/**',
      '*.log',
      
      // Environment files
      '.env',
      '.env.*',
      
      // Other common ignores
      '.git/**',
      '.vscode/**',
      '.idea/**'
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        // Add Jest globals for test files
        jest: true,
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
        afterEach: true
      }
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      'prettier': eslintPluginPrettier
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      
      // General ESLint rules
      'no-console': 'warn',
      'no-unused-vars': 'off', // Using TypeScript's rule instead
      
      // Prettier integration
      'prettier/prettier': ['error', {
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 80,
        tabWidth: 2,
        semi: true
      }]
    }
  }
];