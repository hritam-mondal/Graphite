/**
 * Property Test: Discovery Completeness
 * Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14
 *
 * Verifies that all required directories, configuration files, and dependencies
 * are present as part of the Foundation Setup phase.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve project root relative to this test file (src/features/auth/tests/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../../');

function exists(relativePath: string): boolean {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

// ---------------------------------------------------------------------------
// Property 1: Discovery Completeness
// ---------------------------------------------------------------------------

describe('Property 1: Discovery Completeness', () => {
  // Requirement 1.2 – entry points discoverable
  it('src/app/ directory exists', () => {
    expect(exists('src/app')).toBe(true);
  });

  it('src/app/providers/ directory exists', () => {
    expect(exists('src/app/providers')).toBe(true);
  });

  it('src/app/router/ directory exists', () => {
    expect(exists('src/app/router')).toBe(true);
  });

  // Requirement 1.3 – feature directories
  it('src/features/ directory exists', () => {
    expect(exists('src/features')).toBe(true);
  });

  it('src/features/auth/ directory exists', () => {
    expect(exists('src/features/auth')).toBe(true);
  });

  it('src/features/chat/ directory exists', () => {
    expect(exists('src/features/chat')).toBe(true);
  });

  it('src/features/theme/ directory exists', () => {
    expect(exists('src/features/theme')).toBe(true);
  });

  // Requirement 1.4 – shared component directories
  it('src/components/ directory exists', () => {
    expect(exists('src/components')).toBe(true);
  });

  it('src/components/ui/ directory exists', () => {
    expect(exists('src/components/ui')).toBe(true);
  });

  it('src/components/layout/ directory exists', () => {
    expect(exists('src/components/layout')).toBe(true);
  });

  it('src/components/common/ directory exists', () => {
    expect(exists('src/components/common')).toBe(true);
  });

  // Requirement 1.5 – hooks directory
  it('src/hooks/ directory exists', () => {
    expect(exists('src/hooks')).toBe(true);
  });

  // Requirement 1.6 – services directory
  it('src/services/ directory exists', () => {
    expect(exists('src/services')).toBe(true);
  });

  it('src/services/api/ directory exists', () => {
    expect(exists('src/services/api')).toBe(true);
  });

  // Requirement 1.7 – store directory
  it('src/store/ directory exists', () => {
    expect(exists('src/store')).toBe(true);
  });

  // Requirement 1.8 – lib directory
  it('src/lib/ directory exists', () => {
    expect(exists('src/lib')).toBe(true);
  });

  // Requirement 1.9 – utils directory
  it('src/utils/ directory exists', () => {
    expect(exists('src/utils')).toBe(true);
  });

  // Requirement 1.10 – types directory
  it('src/types/ directory exists', () => {
    expect(exists('src/types')).toBe(true);
  });

  // Requirement 1.11 – constants directory
  it('src/constants/ directory exists', () => {
    expect(exists('src/constants')).toBe(true);
  });

  // Requirement 1.12 – config directory
  it('src/config/ directory exists', () => {
    expect(exists('src/config')).toBe(true);
  });

  // Requirement 1.13 – assets directory
  it('src/assets/ directory exists', () => {
    expect(exists('src/assets')).toBe(true);
  });

  // Requirement 1.14 – styles directory
  it('src/styles/ directory exists', () => {
    expect(exists('src/styles')).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // Configuration files
  // ---------------------------------------------------------------------------

  it('vite.config.ts exists', () => {
    expect(exists('vite.config.ts')).toBe(true);
  });

  it('tsconfig.app.json exists', () => {
    expect(exists('tsconfig.app.json')).toBe(true);
  });

  it('eslint.config.js exists', () => {
    expect(exists('eslint.config.js')).toBe(true);
  });

  it('.prettierrc exists', () => {
    expect(exists('.prettierrc')).toBe(true);
  });

  it('.env.example exists', () => {
    expect(exists('.env.example')).toBe(true);
  });

  it('src/config/env.ts exists', () => {
    expect(exists('src/config/env.ts')).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // Required dependencies in package.json
  // ---------------------------------------------------------------------------

  it('@tanstack/react-query is listed in package.json dependencies', () => {
    const pkgPath = path.join(projectRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(allDeps['@tanstack/react-query']).toBeDefined();
  });

  it('axios is listed in package.json dependencies', () => {
    const pkgPath = path.join(projectRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(allDeps['axios']).toBeDefined();
  });

  it('zod is listed in package.json dependencies', () => {
    const pkgPath = path.join(projectRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(allDeps['zod']).toBeDefined();
  });

  it('react-router-dom is listed in package.json dependencies', () => {
    const pkgPath = path.join(projectRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(allDeps['react-router-dom']).toBeDefined();
  });
});
