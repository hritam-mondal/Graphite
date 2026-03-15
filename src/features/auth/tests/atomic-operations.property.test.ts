/**
 * Property Test: Atomic File Operations
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
 *
 * Verifies that all file moves were atomic: components exist at their new
 * PascalCase locations, old lowercase paths are gone, barrel exports are in
 * place, no imports reference old lowercase paths, and key files use path
 * aliases.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../../');

function exists(relativePath: string): boolean {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function readSrc(relativePath: string): string {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf-8');
}

/** Recursively collect all .ts/.tsx files under a directory */
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

// ---------------------------------------------------------------------------
// Property 6: Atomic File Operations
// ---------------------------------------------------------------------------

describe('Property 6: Atomic File Operations', () => {
  // -------------------------------------------------------------------------
  // 1. UI components exist at new PascalCase locations (Requirement 8.1, 8.3)
  // -------------------------------------------------------------------------
  describe('UI components exist at PascalCase locations in src/components/ui/', () => {
    const uiComponents = [
      'Button.tsx',
      'Input.tsx',
      'Label.tsx',
      'Textarea.tsx',
      'DropdownMenu.tsx',
      'Spinner.tsx',
    ];

    for (const file of uiComponents) {
      it(`src/components/ui/${file} exists`, () => {
        expect(exists(`src/components/ui/${file}`)).toBe(true);
      });
    }
  });

  // -------------------------------------------------------------------------
  // 2. Old lowercase filenames no longer exist in components/ui/ (Requirement 8.1)
  //    On case-insensitive filesystems (macOS) we must check actual on-disk names.
  // -------------------------------------------------------------------------
  describe('Old lowercase UI component filenames no longer exist in src/components/ui/', () => {
    const uiDir = path.join(projectRoot, 'src/components/ui');
    // Read actual on-disk filenames (case-sensitive)
    const actualFiles = fs.existsSync(uiDir) ? fs.readdirSync(uiDir) : [];

    const oldNames = ['button.tsx', 'input.tsx', 'label.tsx', 'textarea.tsx', 'dropdown-menu.tsx'];

    for (const name of oldNames) {
      it(`"${name}" is NOT present in src/components/ui/ (actual disk names checked)`, () => {
        expect(actualFiles).not.toContain(name);
      });
    }
  });

  // -------------------------------------------------------------------------
  // 3. Common components exist (Requirement 8.1, 8.2)
  // -------------------------------------------------------------------------
  describe('Common components exist at src/components/common/', () => {
    const commonComponents = [
      'PasswordStrengthMeter.tsx',
      'Icons.tsx',
      'Settings.tsx',
    ];

    for (const file of commonComponents) {
      it(`src/components/common/${file} exists`, () => {
        expect(exists(`src/components/common/${file}`)).toBe(true);
      });
    }
  });

  // -------------------------------------------------------------------------
  // 4. Layout components exist (Requirement 8.1, 8.2)
  // -------------------------------------------------------------------------
  describe('Layout components exist at src/components/layout/', () => {
    const layoutComponents = ['Sidebar.tsx', 'SidebarFooter.tsx'];

    for (const file of layoutComponents) {
      it(`src/components/layout/${file} exists`, () => {
        expect(exists(`src/components/layout/${file}`)).toBe(true);
      });
    }
  });

  // -------------------------------------------------------------------------
  // 5. Barrel exports exist (Requirement 8.4)
  // -------------------------------------------------------------------------
  describe('Barrel export index.ts files exist', () => {
    const barrels = [
      'src/components/ui/index.ts',
      'src/components/common/index.ts',
      'src/components/layout/index.ts',
      'src/components/index.ts',
    ];

    for (const file of barrels) {
      it(`${file} exists`, () => {
        expect(exists(file)).toBe(true);
      });
    }
  });

  // -------------------------------------------------------------------------
  // 6. No imports from old lowercase paths (Requirement 8.1, 8.5)
  // -------------------------------------------------------------------------
  describe('No source files import from old lowercase component paths', () => {
    // Patterns that would indicate an import from the old lowercase locations
    const oldImportPatterns = [
      /from\s+['"].*components\/ui\/button['"]/,
      /from\s+['"].*components\/ui\/input['"]/,
      /from\s+['"].*components\/ui\/label['"]/,
      /from\s+['"].*components\/ui\/textarea['"]/,
      /from\s+['"].*components\/ui\/dropdown-menu['"]/,
    ];

    const srcDir = path.join(projectRoot, 'src');
    const allFiles = collectSourceFiles(srcDir);

    for (const pattern of oldImportPatterns) {
      const patternStr = pattern.source;
      it(`No file imports from old path matching ${patternStr}`, () => {
        const violations: string[] = [];
        for (const file of allFiles) {
          const content = fs.readFileSync(file, 'utf-8');
          if (pattern.test(content)) {
            violations.push(path.relative(projectRoot, file));
          }
        }
        expect(violations).toEqual([]);
      });
    }
  });

  // -------------------------------------------------------------------------
  // 7. Key files use path aliases (Requirement 8.2, 8.5)
  // -------------------------------------------------------------------------
  describe('Key files use path aliases (@components, @lib, @utils)', () => {
    const aliasPattern = /@(components|lib|utils|features|app|hooks|services|store|config|styles)\//;

    // App.tsx is the top-level file that should already use path aliases
    // after Phase 2 (Shared Infrastructure Migration)
    it('src/App.tsx uses at least one path alias', () => {
      const content = readSrc('src/App.tsx');
      expect(aliasPattern.test(content)).toBe(true);
    });

    it('src/components/index.ts re-exports from sub-directories using relative or alias paths', () => {
      const content = readSrc('src/components/index.ts');
      // Should export from ./ui, ./common, ./layout (relative) or @components/...
      expect(content).toMatch(/export\s+\*\s+from\s+['"](\.\/|@components\/)/);
    });

    // Scan all migrated component files (ui/, common/, layout/) for alias usage
    it('Migrated component files in src/components/ use path aliases for aliased directories', () => {
      // Directories that have defined path aliases — imports from these should use aliases
      const aliasedDirs = ['components', 'features', 'hooks', 'services', 'store', 'lib', 'utils', 'config', 'styles', 'app'];
      const aliasedDirPattern = new RegExp(
        `from\\s+['"]\\.\\.[\\/].*(?:${aliasedDirs.join('|')})\\/`
      );

      const dirsToCheck = [
        'src/components/ui',
        'src/components/common',
        'src/components/layout',
      ];
      const violations: string[] = [];
      for (const dir of dirsToCheck) {
        const dirPath = path.join(projectRoot, dir);
        if (!fs.existsSync(dirPath)) continue;
        for (const file of fs.readdirSync(dirPath)) {
          if (!/\.(ts|tsx)$/.test(file) || file === 'index.ts') continue;
          const content = fs.readFileSync(path.join(dirPath, file), 'utf-8');
          if (aliasedDirPattern.test(content)) {
            violations.push(`${dir}/${file}`);
          }
        }
      }
      expect(violations).toEqual([]);
    });
  });
});
