/**
 * Property Test: Feature Boundary Clustering
 * Validates: Requirements 2.9, 2.10, 13.1, 13.2, 13.3, 13.8
 *
 * **Validates: Requirements 2.9, 2.10, 13.1, 13.2, 13.3, 13.8**
 *
 * Verifies that files within feature directories have high cohesion and low
 * coupling: each feature only imports from itself, shared infrastructure, or
 * external packages — never from sibling features.
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

/** Recursively collect all .ts / .tsx files under a directory. */
function collectSourceFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectSourceFiles(full));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

/** Extract all static import/export source strings from a file's content. */
function extractImportSources(content: string): string[] {
  const sources: string[] = [];
  // Match: import ... from '...' / import '...' / export ... from '...'
  const staticRe = /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = staticRe.exec(content)) !== null) {
    sources.push(m[1]);
  }
  // Match: require('...')
  const requireRe = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((m = requireRe.exec(content)) !== null) {
    sources.push(m[1]);
  }
  return sources;
}

/**
 * Determine whether an import source is a cross-feature import from the
 * perspective of a file that belongs to `ownerFeature`.
 *
 * Cross-feature = imports @features/<other-feature>/... or a relative path
 * that resolves into another feature directory.
 */
function isCrossFeatureImport(
  importSource: string,
  ownerFeature: string,
  fileAbsPath: string,
): boolean {
  // 1. Alias-based cross-feature: @features/<other>/...
  const aliasMatch = importSource.match(/^@features\/([^/]+)/);
  if (aliasMatch) {
    return aliasMatch[1] !== ownerFeature;
  }

  // 2. Relative path that escapes the feature directory
  if (importSource.startsWith('.')) {
    const resolved = path.resolve(path.dirname(fileAbsPath), importSource);
    const featuresDir = path.join(projectRoot, 'src', 'features');
    if (resolved.startsWith(featuresDir + path.sep)) {
      // Which feature does the resolved path belong to?
      const rel = path.relative(featuresDir, resolved);
      const targetFeature = rel.split(path.sep)[0];
      return targetFeature !== ownerFeature;
    }
  }

  return false;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FEATURES_DIR = path.join(projectRoot, 'src', 'features');

/** Known feature names (subdirectories of src/features/). */
const KNOWN_FEATURES = ['auth', 'chat', 'theme'];

/** Expected subdirectories inside every feature. */
const EXPECTED_SUBDIRS = [
  'components',
  'hooks',
  'services',
  'state',
  'types',
  'pages',
  'tests',
];

/** Shared infrastructure path aliases that any feature may import from. */
const SHARED_INFRA_ALIASES = [
  '@components',
  '@lib',
  '@utils',
  '@styles',
  '@config',
  '@hooks',
  '@services',
  '@store',
  '@types',
  '@constants',
  '@assets',
  '@app',
];

/**
 * All known project-internal path alias prefixes (starts with @).
 * Any @-prefixed import NOT in this list is treated as an external scoped
 * package (e.g. @hookform/resolvers, @radix-ui/react-dropdown-menu).
 */
const ALL_INTERNAL_ALIASES = [
  '@features',
  ...SHARED_INFRA_ALIASES,
];

// ---------------------------------------------------------------------------
// Property 4: Feature Boundary Clustering
// ---------------------------------------------------------------------------

describe('Property 4: Feature Boundary Clustering', () => {
  // -------------------------------------------------------------------------
  // 4a. Feature Cohesion — each feature has the expected subdirectories
  //     Validates: Requirements 2.9, 13.1, 13.2, 13.3
  // -------------------------------------------------------------------------
  describe('Feature Cohesion: each feature contains expected subdirectories', () => {
    for (const feature of KNOWN_FEATURES) {
      describe(`Feature: ${feature}`, () => {
        for (const subdir of EXPECTED_SUBDIRS) {
          it(`src/features/${feature}/${subdir}/ exists`, () => {
            const dirPath = path.join(FEATURES_DIR, feature, subdir);
            expect(
              fs.existsSync(dirPath),
              `Expected directory ${dirPath} to exist`,
            ).toBe(true);
          });
        }
      });
    }
  });

  // -------------------------------------------------------------------------
  // 4b. Feature Cohesion — each feature has a barrel export (index.ts)
  //     Validates: Requirements 2.9, 13.8
  // -------------------------------------------------------------------------
  describe('Feature Cohesion: each feature has a barrel export (index.ts)', () => {
    for (const feature of KNOWN_FEATURES) {
      it(`src/features/${feature}/index.ts exists`, () => {
        const indexPath = path.join(FEATURES_DIR, feature, 'index.ts');
        expect(
          fs.existsSync(indexPath),
          `Expected barrel export at ${indexPath}`,
        ).toBe(true);
      });
    }
  });

  // -------------------------------------------------------------------------
  // 4c. Low Coupling — no cross-feature imports via @features/<other> alias
  //     Validates: Requirements 2.10, 13.1, 13.2, 13.3
  // -------------------------------------------------------------------------
  describe('Low Coupling: feature files must not import from sibling features', () => {
    for (const feature of KNOWN_FEATURES) {
      const featureDir = path.join(FEATURES_DIR, feature);
      const files = collectSourceFiles(featureDir);

      for (const file of files) {
        const relFile = path.relative(projectRoot, file);
        it(`${relFile} has no cross-feature imports`, () => {
          const content = fs.readFileSync(file, 'utf-8');
          const sources = extractImportSources(content);
          const violations = sources.filter((src) =>
            isCrossFeatureImport(src, feature, file),
          );
          expect(
            violations,
            `${relFile} imports from a sibling feature: ${violations.join(', ')}`,
          ).toEqual([]);
        });
      }
    }
  });

  // -------------------------------------------------------------------------
  // 4d. Low Coupling — shared components must not import from features
  //     Validates: Requirements 2.10, 13.8 (Requirement 4.8)
  // -------------------------------------------------------------------------
  describe('Low Coupling: shared components must not import from any feature', () => {
    const sharedDirs = [
      path.join(projectRoot, 'src', 'components'),
      path.join(projectRoot, 'src', 'hooks'),
      path.join(projectRoot, 'src', 'lib'),
      path.join(projectRoot, 'src', 'utils'),
    ];

    for (const dir of sharedDirs) {
      const files = collectSourceFiles(dir);
      for (const file of files) {
        const relFile = path.relative(projectRoot, file);
        it(`${relFile} does not import from any feature`, () => {
          const content = fs.readFileSync(file, 'utf-8');
          const sources = extractImportSources(content);
          const violations = sources.filter((src) =>
            /^@features\//.test(src) || src.includes('/features/'),
          );
          expect(
            violations,
            `Shared file ${relFile} imports from a feature: ${violations.join(', ')}`,
          ).toEqual([]);
        });
      }
    }
  });

  // -------------------------------------------------------------------------
  // 4e. Allowed imports — feature files only use permitted import categories
  //     Validates: Requirements 2.9, 2.10, 13.1
  //
  //     Permitted categories:
  //       1. External packages (no leading . or @)
  //       2. Same-feature alias: @features/<own-feature>/...
  //       3. Relative imports within the same feature
  //       4. Shared infrastructure aliases: @components, @lib, @utils, etc.
  // -------------------------------------------------------------------------
  describe('Allowed imports: feature files only import from permitted sources', () => {
    for (const feature of KNOWN_FEATURES) {
      const featureDir = path.join(FEATURES_DIR, feature);
      const files = collectSourceFiles(featureDir);

      for (const file of files) {
        const relFile = path.relative(projectRoot, file);
        it(`${relFile} only uses permitted import sources`, () => {
          const content = fs.readFileSync(file, 'utf-8');
          const sources = extractImportSources(content);

          const forbidden = sources.filter((src) => {
            // External package (no leading . or @) → always allowed
            if (!src.startsWith('.') && !src.startsWith('@')) return false;

            // Scoped npm package: starts with @ but is NOT a known internal alias
            // e.g. @hookform/resolvers, @radix-ui/react-dropdown-menu → always allowed
            if (
              src.startsWith('@') &&
              !ALL_INTERNAL_ALIASES.some((alias) => src.startsWith(alias))
            ) {
              return false;
            }

            // Same-feature alias → allowed
            if (src.startsWith(`@features/${feature}`)) return false;

            // Shared infrastructure alias → allowed
            if (SHARED_INFRA_ALIASES.some((alias) => src.startsWith(alias))) return false;

            // Relative import — check it stays within the feature
            if (src.startsWith('.')) {
              const resolved = path.resolve(path.dirname(file), src);
              const featuresDir = path.join(projectRoot, 'src', 'features');
              if (resolved.startsWith(featuresDir + path.sep)) {
                const rel = path.relative(featuresDir, resolved);
                const targetFeature = rel.split(path.sep)[0];
                // Relative import into a different feature → forbidden
                return targetFeature !== feature;
              }
              // Relative import outside features/ entirely → allowed (e.g. ../../../lib)
              return false;
            }

            // Any other @-alias not in the shared list → forbidden
            return true;
          });

          expect(
            forbidden,
            `${relFile} contains forbidden imports: ${forbidden.join(', ')}`,
          ).toEqual([]);
        });
      }
    }
  });
});
