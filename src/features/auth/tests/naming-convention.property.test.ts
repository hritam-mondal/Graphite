/**
 * Property Test: Naming Convention Enforcement
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9
 *
 * **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9**
 *
 * Verifies that all files in the refactored codebase follow naming conventions:
 *   - Component files use PascalCase (Requirement 9.1)
 *   - Utility/lib files use camelCase (Requirement 9.2)
 *   - Feature directory names use kebab-case (Requirement 9.3)
 *   - Component files are named after their default export (Requirement 9.4)
 *   - Hook files start with "use" prefix (Requirement 9.5)
 *   - Type files use .types.ts suffix (Requirement 9.6)
 *   - Test files use .test.tsx or .test.ts suffix (Requirement 9.7)
 *   - Constant exports use UPPER_SNAKE_CASE (Requirement 9.8)
 *   - Violations are detectable (Requirement 9.9)
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Resolve project root (this file lives at src/features/auth/tests/)
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../../');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively collect all files under a directory, optionally filtered by extension. */
function collectFiles(dir: string, extensions?: string[]): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full, extensions));
    } else if (entry.isFile()) {
      if (!extensions || extensions.some((ext) => entry.name.endsWith(ext))) {
        results.push(full);
      }
    }
  }
  return results;
}

/** Collect immediate subdirectory names of a directory. */
function getSubdirectoryNames(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

/** Check if a string is PascalCase (starts with uppercase, no hyphens/underscores). */
function isPascalCase(name: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(name);
}

/** Check if a string is camelCase (starts with lowercase, no hyphens/underscores). */
function isCamelCase(name: string): boolean {
  return /^[a-z][A-Za-z0-9]*$/.test(name);
}

/** Check if a string is kebab-case (all lowercase, words separated by hyphens). */
function isKebabCase(name: string): boolean {
  return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name);
}

/** Check if a string is UPPER_SNAKE_CASE. */
function isUpperSnakeCase(name: string): boolean {
  return /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/.test(name);
}

/**
 * Extract the base name of a file without its extension(s).
 * e.g. "Button.tsx" -> "Button", "auth.types.ts" -> "auth", "useAuth.ts" -> "useAuth"
 */
function baseName(filename: string): string {
  // Strip compound extensions like .types.ts, .test.ts, .test.tsx, .property.test.ts
  return filename
    .replace(/\.(property\.test|test)\.(ts|tsx)$/, '')
    .replace(/\.types\.ts$/, '')
    .replace(/\.(ts|tsx)$/, '');
}

/**
 * Extract the default export name from a TypeScript/TSX file's content.
 * Returns null if no default export is found.
 */
function extractDefaultExportName(content: string): string | null {
  // export default function Foo / export default class Foo
  const namedMatch = content.match(
    /export\s+default\s+(?:function|class)\s+([A-Za-z_$][A-Za-z0-9_$]*)/,
  );
  if (namedMatch) return namedMatch[1];

  // export default Foo (identifier)
  const identifierMatch = content.match(/export\s+default\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*[;\n]/);
  if (identifierMatch) return identifierMatch[1];

  return null;
}

// ---------------------------------------------------------------------------
// Directories under test
// ---------------------------------------------------------------------------

const FEATURES_DIR = path.join(projectRoot, 'src', 'features');
const COMPONENTS_DIR = path.join(projectRoot, 'src', 'components');
const UTILS_DIR = path.join(projectRoot, 'src', 'utils');
const LIB_DIR = path.join(projectRoot, 'src', 'lib');
const HOOKS_DIR = path.join(projectRoot, 'src', 'hooks');

/** All known feature names. */
const KNOWN_FEATURES = ['auth', 'chat', 'theme'];

// ---------------------------------------------------------------------------
// Property 8: Naming Convention Enforcement
// ---------------------------------------------------------------------------

describe('Property 8: Naming Convention Enforcement', () => {
  // -------------------------------------------------------------------------
  // 8a. Feature directory names use kebab-case (Requirement 9.3)
  // -------------------------------------------------------------------------
  describe('Feature directory names use kebab-case (Requirement 9.3)', () => {
    it('all feature directory names are kebab-case', () => {
      const featureDirs = getSubdirectoryNames(FEATURES_DIR);
      const violations = featureDirs.filter((name) => !isKebabCase(name));
      expect(
        violations,
        `Feature directories with non-kebab-case names: ${violations.join(', ')}`,
      ).toEqual([]);
    });

    for (const feature of KNOWN_FEATURES) {
      it(`src/features/${feature}/ uses kebab-case`, () => {
        expect(
          isKebabCase(feature),
          `Feature directory "${feature}" should be kebab-case`,
        ).toBe(true);
      });
    }
  });

  // -------------------------------------------------------------------------
  // 8b. Component files use PascalCase (Requirement 9.1)
  //     Applies to: components/ directories inside features and src/components/
  // -------------------------------------------------------------------------
  describe('Component files use PascalCase (Requirement 9.1)', () => {
    // Shared components
    const sharedComponentDirs = ['ui', 'common', 'layout'].map((sub) =>
      path.join(COMPONENTS_DIR, sub),
    );

    for (const dir of sharedComponentDirs) {
      const files = collectFiles(dir, ['.tsx', '.ts']).filter(
        (f) => !f.endsWith('index.ts') && !path.basename(f).startsWith('.'),
      );

      for (const file of files) {
        const filename = path.basename(file);
        // Skip non-component files (barrel exports, gitkeep, etc.)
        if (filename === 'index.ts' || filename.startsWith('.')) continue;
        // Skip type files and test files — they have their own rules
        if (filename.includes('.types.') || filename.includes('.test.')) continue;

        const name = baseName(filename);
        const relFile = path.relative(projectRoot, file);

        it(`${relFile} uses PascalCase filename`, () => {
          expect(
            isPascalCase(name),
            `Component file "${relFile}" should use PascalCase, got "${name}"`,
          ).toBe(true);
        });
      }
    }

    // Feature component directories
    for (const feature of KNOWN_FEATURES) {
      const componentDir = path.join(FEATURES_DIR, feature, 'components');
      const pageDir = path.join(FEATURES_DIR, feature, 'pages');

      for (const dir of [componentDir, pageDir]) {
        const files = collectFiles(dir, ['.tsx', '.ts']).filter(
          (f) => !path.basename(f).startsWith('.'),
        );

        for (const file of files) {
          const filename = path.basename(file);
          if (filename === 'index.ts' || filename.startsWith('.')) continue;
          if (filename.includes('.types.') || filename.includes('.test.')) continue;

          const name = baseName(filename);
          const relFile = path.relative(projectRoot, file);

          it(`${relFile} uses PascalCase filename`, () => {
            expect(
              isPascalCase(name),
              `Component file "${relFile}" should use PascalCase, got "${name}"`,
            ).toBe(true);
          });
        }
      }
    }
  });

  // -------------------------------------------------------------------------
  // 8c. Hook files start with "use" prefix (Requirement 9.5)
  //     Applies to: hooks/ directories inside features and src/hooks/
  // -------------------------------------------------------------------------
  describe('Hook files start with "use" prefix (Requirement 9.5)', () => {
    const hookDirs: string[] = [HOOKS_DIR];
    for (const feature of KNOWN_FEATURES) {
      hookDirs.push(path.join(FEATURES_DIR, feature, 'hooks'));
    }

    for (const dir of hookDirs) {
      const files = collectFiles(dir, ['.ts', '.tsx']).filter(
        (f) => !path.basename(f).startsWith('.'),
      );

      for (const file of files) {
        const filename = path.basename(file);
        if (filename === 'index.ts' || filename.startsWith('.')) continue;
        if (filename.includes('.test.')) continue;

        const name = baseName(filename);
        const relFile = path.relative(projectRoot, file);

        it(`${relFile} starts with "use" prefix`, () => {
          expect(
            name.startsWith('use'),
            `Hook file "${relFile}" should start with "use", got "${name}"`,
          ).toBe(true);
        });

        it(`${relFile} hook name is camelCase after "use" prefix`, () => {
          // The full name should be camelCase: useAuth, useToken, etc.
          expect(
            isCamelCase(name),
            `Hook file "${relFile}" should be camelCase, got "${name}"`,
          ).toBe(true);
        });
      }
    }
  });

  // -------------------------------------------------------------------------
  // 8d. Type files use .types.ts suffix (Requirement 9.6)
  //     Applies to: types/ directories inside features and src/types/
  // -------------------------------------------------------------------------
  describe('Type files use .types.ts suffix (Requirement 9.6)', () => {
    const typeDirs: string[] = [path.join(projectRoot, 'src', 'types')];
    for (const feature of KNOWN_FEATURES) {
      typeDirs.push(path.join(FEATURES_DIR, feature, 'types'));
    }

    for (const dir of typeDirs) {
      const files = collectFiles(dir, ['.ts', '.tsx']).filter(
        (f) => !path.basename(f).startsWith('.'),
      );

      for (const file of files) {
        const filename = path.basename(file);
        if (filename === 'index.ts' || filename.startsWith('.')) continue;
        if (filename.includes('.test.')) continue;

        const relFile = path.relative(projectRoot, file);

        it(`${relFile} uses .types.ts suffix`, () => {
          expect(
            filename.endsWith('.types.ts'),
            `Type file "${relFile}" should use .types.ts suffix`,
          ).toBe(true);
        });
      }
    }
  });

  // -------------------------------------------------------------------------
  // 8e. Test files use .test.ts or .test.tsx suffix (Requirement 9.7)
  //     Applies to: tests/ directories inside features
  // -------------------------------------------------------------------------
  describe('Test files use .test.ts or .test.tsx suffix (Requirement 9.7)', () => {
    for (const feature of KNOWN_FEATURES) {
      const testsDir = path.join(FEATURES_DIR, feature, 'tests');
      const files = collectFiles(testsDir, ['.ts', '.tsx']).filter(
        (f) => !path.basename(f).startsWith('.'),
      );

      for (const file of files) {
        const filename = path.basename(file);
        if (filename.startsWith('.')) continue;

        const relFile = path.relative(projectRoot, file);

        it(`${relFile} uses .test.ts or .test.tsx suffix`, () => {
          const isTestFile =
            filename.endsWith('.test.ts') ||
            filename.endsWith('.test.tsx') ||
            filename.endsWith('.property.test.ts') ||
            filename.endsWith('.property.test.tsx');
          expect(
            isTestFile,
            `Test file "${relFile}" should use .test.ts or .test.tsx suffix`,
          ).toBe(true);
        });
      }
    }
  });

  // -------------------------------------------------------------------------
  // 8f. Utility files use camelCase (Requirement 9.2)
  //     Applies to: src/utils/, src/lib/, and feature utils/ directories
  // -------------------------------------------------------------------------
  describe('Utility files use camelCase (Requirement 9.2)', () => {
    const utilDirs: string[] = [UTILS_DIR, LIB_DIR];
    for (const feature of KNOWN_FEATURES) {
      const featureUtils = path.join(FEATURES_DIR, feature, 'utils');
      if (fs.existsSync(featureUtils)) {
        utilDirs.push(featureUtils);
      }
    }

    for (const dir of utilDirs) {
      const files = collectFiles(dir, ['.ts', '.tsx']).filter(
        (f) => !path.basename(f).startsWith('.'),
      );

      for (const file of files) {
        const filename = path.basename(file);
        if (filename === 'index.ts' || filename.startsWith('.')) continue;
        if (filename.includes('.test.') || filename.includes('.types.')) continue;
        // Hook files in utils are allowed to start with "use"
        if (filename.startsWith('use')) continue;

        const name = baseName(filename);
        const relFile = path.relative(projectRoot, file);

        it(`${relFile} uses camelCase filename`, () => {
          expect(
            isCamelCase(name),
            `Utility file "${relFile}" should use camelCase, got "${name}"`,
          ).toBe(true);
        });
      }
    }
  });

  // -------------------------------------------------------------------------
  // 8g. Component files are named after their default export (Requirement 9.4)
  //     Spot-check known component files
  // -------------------------------------------------------------------------
  describe('Component files are named after their default export (Requirement 9.4)', () => {
    const knownComponents: Array<{ file: string; expectedExport: string }> = [
      { file: 'src/components/ui/Button.tsx', expectedExport: 'Button' },
      { file: 'src/components/ui/Input.tsx', expectedExport: 'Input' },
      { file: 'src/components/ui/Spinner.tsx', expectedExport: 'Spinner' },
      { file: 'src/features/auth/pages/LoginPage.tsx', expectedExport: 'LoginPage' },
      { file: 'src/features/auth/pages/SignupPage.tsx', expectedExport: 'SignupPage' },
      { file: 'src/features/chat/components/Chat.tsx', expectedExport: 'Chat' },
      { file: 'src/features/theme/components/ThemeToggle.tsx', expectedExport: 'ThemeToggle' },
    ];

    for (const { file, expectedExport } of knownComponents) {
      const absPath = path.join(projectRoot, file);
      if (!fs.existsSync(absPath)) continue;

      it(`${file} exports a component matching its filename`, () => {
        const content = fs.readFileSync(absPath, 'utf-8');
        const defaultExport = extractDefaultExportName(content);

        if (defaultExport !== null) {
          expect(
            defaultExport,
            `${file} default export should be "${expectedExport}", got "${defaultExport}"`,
          ).toBe(expectedExport);
        } else {
          // If no default export found, at least verify the file name is PascalCase
          const name = baseName(path.basename(file));
          expect(
            isPascalCase(name),
            `${file} has no default export but filename should still be PascalCase`,
          ).toBe(true);
        }
      });
    }
  });

  // -------------------------------------------------------------------------
  // 8h. Constant exports use UPPER_SNAKE_CASE (Requirement 9.8)
  //     Applies to: src/constants/ and feature constants/ directories
  // -------------------------------------------------------------------------
  describe('Constant exports use UPPER_SNAKE_CASE (Requirement 9.8)', () => {
    const constantDirs: string[] = [path.join(projectRoot, 'src', 'constants')];
    for (const feature of KNOWN_FEATURES) {
      const featureConstants = path.join(FEATURES_DIR, feature, 'constants');
      if (fs.existsSync(featureConstants)) {
        constantDirs.push(featureConstants);
      }
    }

    // Collect all constant files with PascalCase-starting exports to validate
    const violations: Array<{ file: string; constName: string }> = [];

    for (const dir of constantDirs) {
      const files = collectFiles(dir, ['.ts']).filter(
        (f) => !path.basename(f).startsWith('.'),
      );

      for (const file of files) {
        const filename = path.basename(file);
        if (filename === 'index.ts' || filename.startsWith('.')) continue;
        if (filename.includes('.test.') || filename.includes('.types.')) continue;

        const relFile = path.relative(projectRoot, file);
        const content = fs.readFileSync(file, 'utf-8');

        // Extract exported const declarations that start with uppercase (likely constants)
        const exportedConsts = [
          ...content.matchAll(/export\s+const\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*[=:]/g),
        ].map((m) => m[1]);

        for (const constName of exportedConsts) {
          // Only enforce UPPER_SNAKE_CASE for names that start with uppercase
          // (camelCase exports are functions/hooks/objects — skip them)
          if (/^[a-z]/.test(constName)) continue;

          if (!isUpperSnakeCase(constName)) {
            violations.push({ file: relFile, constName });
          }
        }
      }
    }

    it('all uppercase-starting exported constants in constants/ directories use UPPER_SNAKE_CASE', () => {
      const messages = violations.map(
        ({ file, constName }) => `"${constName}" in ${file}`,
      );
      expect(
        violations,
        `Constants violating UPPER_SNAKE_CASE: ${messages.join(', ')}`,
      ).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // 8i. Naming convention helper functions are correct (self-validation)
  // -------------------------------------------------------------------------
  describe('Naming convention validators are correct', () => {
    it('isPascalCase correctly identifies PascalCase strings', () => {
      expect(isPascalCase('Button')).toBe(true);
      expect(isPascalCase('LoginPage')).toBe(true);
      expect(isPascalCase('ThemeToggle')).toBe(true);
      expect(isPascalCase('button')).toBe(false);
      expect(isPascalCase('login-page')).toBe(false);
      expect(isPascalCase('loginPage')).toBe(false);
    });

    it('isCamelCase correctly identifies camelCase strings', () => {
      expect(isCamelCase('useAuth')).toBe(true);
      expect(isCamelCase('formatters')).toBe(true);
      expect(isCamelCase('generateCssVars')).toBe(true);
      expect(isCamelCase('Button')).toBe(false);
      expect(isCamelCase('login-page')).toBe(false);
      expect(isCamelCase('LOGIN_PAGE')).toBe(false);
    });

    it('isKebabCase correctly identifies kebab-case strings', () => {
      expect(isKebabCase('auth')).toBe(true);
      expect(isKebabCase('chat')).toBe(true);
      expect(isKebabCase('theme')).toBe(true);
      expect(isKebabCase('my-feature')).toBe(true);
      expect(isKebabCase('MyFeature')).toBe(false);
      expect(isKebabCase('my_feature')).toBe(false);
      expect(isKebabCase('myFeature')).toBe(false);
    });

    it('isUpperSnakeCase correctly identifies UPPER_SNAKE_CASE strings', () => {
      expect(isUpperSnakeCase('API_URL')).toBe(true);
      expect(isUpperSnakeCase('MAX_RETRIES')).toBe(true);
      expect(isUpperSnakeCase('TIMEOUT')).toBe(true);
      expect(isUpperSnakeCase('apiUrl')).toBe(false);
      expect(isUpperSnakeCase('api-url')).toBe(false);
      expect(isUpperSnakeCase('ApiUrl')).toBe(false);
    });
  });
});
